#!/bin/bash
# [로컬에서 실행] 타겟 env를 주입해 로컬 빌드 → 서버 업로드 → pm2 재시작.
# 실행: ./deploy.sh <dev|prod> [프로젝트경로]   (기본: ../client)
#   - 빌드 시 타겟 앱 env를 주입 → NEXT_PUBLIC_* 이 타겟별로 박제됨
#   - 서버엔 dev→.env.local, prod→.env.production 로 앱 env 업로드
#
# 환경변수 옵션:
#   DRY_RUN=1    서버를 전혀 바꾸지 않는 리허설. 접속 확인 + rsync --dry-run 까지만.
#   SKIP_BUILD=1 이미 있는 .next 를 재사용 (빌드 생략)
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="${1:?사용법: ./deploy.sh <dev|prod> [프로젝트경로]}"
# shellcheck disable=SC1091
source "$DIR/lib/load-env.sh"

DRY_RUN="${DRY_RUN:-}"
SKIP_BUILD="${SKIP_BUILD:-}"
[ -n "$DRY_RUN" ] && echo "🔎 DRY RUN — 서버는 변경하지 않습니다 (로컬 빌드와 업로드 시뮬레이션만)"

PROJECT_DIR="${2:-$DIR/../client}"
cd "$PROJECT_DIR"
[ -f package.json ] || { echo "❌ $PROJECT_DIR 에 package.json 이 없습니다."; exit 1; }
[ -f ecosystem.config.js ] || { echo "❌ $PROJECT_DIR 에 ecosystem.config.js 가 없습니다."; exit 1; }

# --- 앱 env 파일 위치 확인 ---
APP_ENV_PATH="$DIR/$APP_ENV_FILE"
[ -f "$APP_ENV_PATH" ] || { echo "❌ 앱 env 파일이 없습니다: $APP_ENV_PATH ('${UP}_APP_ENV_FILE')"; exit 1; }

# 조회수 데이터 파일 경로 (앱이 process.cwd() 기준으로 읽고 쓴다) → 서버에 디렉토리를 만들어 둔다
VIEW_DATA_DIR="$( set -a; . "$APP_ENV_PATH"; set +a; [ -n "${VIEW_DATA_FILE_PATH:-}" ] && dirname "$VIEW_DATA_FILE_PATH" || true )"

echo "▶ [$TARGET] 서버 접속 확인 → $SERVER"
$SSH "echo '  연결 OK:' \$(hostname)"

if [ -n "$SKIP_BUILD" ]; then
  echo "▶ [$TARGET] 빌드 생략 (SKIP_BUILD=1) — 기존 .next 재사용"
  [ -d .next ] || { echo "❌ .next 가 없습니다. SKIP_BUILD 없이 한 번은 빌드해야 합니다."; exit 1; }
else
  echo "▶ [$TARGET] 앱 env 주입 후 로컬 빌드"
  yarn install --frozen-lockfile
  # 타겟 env를 셸에 올려 빌드 → next 가 NEXT_PUBLIC_* 을 이 값으로 박제 (셸 값이 우선)
  # build:release 는 package.json 의 version 을 NEXT_PUBLIC_APP_VERSION 으로 주입한다
  ( set -a; . "$APP_ENV_PATH"; set +a; yarn build:release )
fi

echo "▶ [$TARGET] 빌드 결과 업로드 → $SERVER:$APP_DIR"
# -R(--relative): src/constants 를 서버에도 같은 경로로 올린다 (next.config.ts 가 런타임에 import 한다)
# --delete 는 목록에 없는 서버 파일을 지우므로, 서버에만 있어야 하는 것들은 --exclude 로 보호한다:
#   node_modules … 서버에서 설치     .env* … 아래 단계에서 업로드
#   src/data     … 조회수 데이터      .next/cache … 런타임 캐시 (업로드 불필요)
if [ -n "$DRY_RUN" ] && ! $SSH "test -d '$APP_DIR'"; then
  # bootstrap.sh 가 아직 안 돌아 목적지가 없으면 rsync 가 실패한다. 리허설이므로 건너뛴다.
  echo "  ⚠️  서버에 $APP_DIR 가 없습니다 (bootstrap.sh 가 만듭니다). 업로드 시뮬레이션은 건너뜁니다."
else
  rsync -azR --delete ${DRY_RUN:+--dry-run --itemize-changes} \
    --exclude '/node_modules' \
    --exclude '/.env*' \
    --exclude '/src/data' \
    --exclude '/.next/cache' \
    -e "ssh -i $SSH_KEY" \
    .next package.json yarn.lock public ecosystem.config.js tsconfig.json src/constants \
    $(ls next.config.* 2>/dev/null) \
    "$SERVER:$APP_DIR/"
fi

echo "▶ [$TARGET] 런타임 env 업로드 → $APP_DIR/$REMOTE_ENV_NAME"
# SENTRY_AUTH_TOKEN 은 빌드 때만 쓰이므로 서버에 올리지 않는다
TMP_ENV="$(mktemp)"
trap 'rm -f "$TMP_ENV"' EXIT
grep -v '^[[:space:]]*SENTRY_AUTH_TOKEN' "$APP_ENV_PATH" > "$TMP_ENV"
if [ -n "$DRY_RUN" ]; then
  echo "  (dry run) 업로드할 키: $(grep -oE '^[A-Za-z_][A-Za-z0-9_]*' "$TMP_ENV" | tr '\n' ' ')"
else
  rsync -az -e "ssh -i $SSH_KEY" "$TMP_ENV" "$SERVER:$APP_DIR/$REMOTE_ENV_NAME"
fi

echo "▶ [$TARGET] 서버: 프로덕션 의존성 설치 + 재시작"
# pm2 이름/포트/실행은 ecosystem.config.js 가 소유한다 (startOrReload: 있으면 무중단 reload, 없으면 start).
REMOTE_SCRIPT="
  set -e
  cd '$APP_DIR'
  yarn install --frozen-lockfile --production
  ${VIEW_DATA_DIR:+mkdir -p '$APP_DIR/$VIEW_DATA_DIR'}
  pm2 startOrReload ecosystem.config.js --update-env
  pm2 save
"
if [ -n "$DRY_RUN" ]; then
  echo "  (dry run) 서버에서 실행하지 않은 명령:"
  echo "$REMOTE_SCRIPT" | sed 's/^/    /'
  echo ""
  echo "✅ [$TARGET] DRY RUN 완료 — 서버는 그대로입니다. 실제 배포는 DRY_RUN 없이 실행하세요."
  exit 0
fi
$SSH "$REMOTE_SCRIPT"

echo "✅ [$TARGET] 배포 완료 → http://$SERVER_HOST"
