#!/bin/bash
# 공통: .env 로드 + 타겟(dev|prod) 값 해석 + 검증.
# 호출측에서 TARGET 을 세팅한 뒤 이 파일을 source 한다.
#   TARGET="$1"; source "$DIR/lib/load-env.sh"
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ ! -f "$ROOT_DIR/.env" ]; then
  echo "❌ .env 파일이 없습니다. '.env.example' 를 복사해서 채우세요:"
  echo "     cp .env.example .env"
  exit 1
fi

set -a
# shellcheck disable=SC1091
source "$ROOT_DIR/.env"
set +a

# --- 타겟 검증 ---
: "${TARGET:?TARGET 이 필요합니다 (dev | prod)}"
case "$TARGET" in
  dev|prod) ;;
  *) echo "❌ TARGET 은 dev 또는 prod 여야 합니다 (받은 값: '$TARGET')"; exit 1 ;;
esac
UP="$(echo "$TARGET" | tr '[:lower:]' '[:upper:]')"   # DEV | PROD

# --- 타겟별 값 해석 (indirect expansion) ---
_get() { local v="${UP}_$1"; echo "${!v:-}"; }

SERVER_USER="$(_get SERVER_USER)"; SERVER_USER="${SERVER_USER:-ubuntu}"
SERVER_HOST="$(_get SERVER_HOST)"
APP_ENV_FILE="$(_get APP_ENV_FILE)"
DOMAIN="$(_get DOMAIN)"
# 같은 인증서/서버블록에 함께 담을 추가 도메인 (공백 구분). 예: DEV_DOMAIN_ALIASES=www.dev.example.com
DOMAIN_ALIASES="$(_get DOMAIN_ALIASES)"
CERTBOT_EMAIL="$(_get CERTBOT_EMAIL)"

# nginx server_name 에 넣을 목록과 certbot 에 넘길 -d 인자를 함께 만든다.
# 둘이 어긋나면 certbot --nginx 가 서버블록을 못 찾으므로 한곳에서 파생시킨다.
ALL_DOMAINS="$DOMAIN${DOMAIN_ALIASES:+ $DOMAIN_ALIASES}"
CERTBOT_DOMAIN_ARGS=""
for _d in $ALL_DOMAINS; do
  CERTBOT_DOMAIN_ARGS="$CERTBOT_DOMAIN_ARGS -d $_d"
done

# SSH 키는 타겟별(DEV_SSH_KEY/PROD_SSH_KEY)이 우선, 없으면 공통 SSH_KEY 를 쓴다.
_TARGET_SSH_KEY="$(_get SSH_KEY)"
SSH_KEY="${_TARGET_SSH_KEY:-${SSH_KEY:-}}"

# pm2 프로세스 이름/포트/실행은 프로젝트의 ecosystem.config.js 가 소유한다.
# nginx 설정 파일명만 고정값으로 사용 (인스턴스당 앱 1개 전제).
NGINX_SITE="${NGINX_SITE:-app}"

# --- 공통 필수값 ---
: "${SSH_KEY:?SSH_KEY(또는 ${UP}_SSH_KEY) 가 .env 에 없습니다}"
: "${APP_DIR:?APP_DIR 가 .env 에 없습니다}"
: "${APP_PORT:=3000}"
: "${SERVER_HOST:?${UP}_SERVER_HOST 가 .env 에 없습니다}"

# --- SSH 키 경로 해석 ---
# ~ 확장 후, 상대경로면 infra/ 기준으로 푼다 → .env 에 'secrets/foo.pem' 처럼 쓸 수 있다.
SSH_KEY="${SSH_KEY/#\~/$HOME}"
case "$SSH_KEY" in
  /*) ;;
  *) SSH_KEY="$ROOT_DIR/$SSH_KEY" ;;
esac

if [ ! -f "$SSH_KEY" ]; then
  echo "❌ SSH 키를 찾을 수 없습니다: $SSH_KEY"
  echo "   pem 파일을 'infra/secrets/' 에 두고 .env 에 상대경로로 적으세요 (예: SSH_KEY=secrets/my-key.pem)"
  exit 1
fi

# 권한이 열려 있으면 ssh 가 키를 거부한다 (UNPROTECTED PRIVATE KEY FILE)
SSH_KEY_PERM="$(stat -f '%Lp' "$SSH_KEY" 2>/dev/null || stat -c '%a' "$SSH_KEY")"
case "$SSH_KEY_PERM" in
  400|600) ;;
  *) echo "❌ SSH 키 권한이 너무 열려 있습니다($SSH_KEY_PERM). 다음을 실행하세요:"
     echo "     chmod 400 '$SSH_KEY'"
     exit 1 ;;
esac

# dev → .env.local, prod → .env.production 로 서버에 올린다
if [ "$TARGET" = "dev" ]; then
  REMOTE_ENV_NAME=".env.local"
else
  REMOTE_ENV_NAME=".env.production"
fi

SERVER="$SERVER_USER@$SERVER_HOST"
SSH="ssh -i $SSH_KEY $SERVER"

# nginx 설정 렌더링. envsubst 는 macOS 기본 설치가 아니라 없을 수 있어 sed 로 폴백한다.
#   render_nginx_conf "<도메인 목록(공백 구분)>" <포트>
render_nginx_conf() {
  local tpl="$ROOT_DIR/remote/nginx-app.conf.template"
  if command -v envsubst >/dev/null 2>&1; then
    SERVER_NAMES="$1" APP_PORT="$2" envsubst '${SERVER_NAMES} ${APP_PORT}' < "$tpl"
  else
    sed -e "s|\${SERVER_NAMES}|$1|g" -e "s|\${APP_PORT}|$2|g" "$tpl"
  fi
}
