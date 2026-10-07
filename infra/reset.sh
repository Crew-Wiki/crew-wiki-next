#!/bin/bash
# [로컬에서 실행] 타겟 서버의 배포물/설정만 초기화 (설치된 패키지는 유지).
# 인스턴스를 종료/중지하지 않으므로 IP는 유지된다.
# 초기화 후엔 './bootstrap.sh <타겟>' → './deploy.sh <타겟> <프로젝트>' 로 재배포.
# 실행: ./reset.sh <dev|prod>
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="${1:?사용법: ./reset.sh <dev|prod>}"
# shellcheck disable=SC1091
source "$DIR/lib/load-env.sh"

echo "⚠️  [$TARGET] $SERVER 의 배포물을 초기화합니다:"
echo "    - pm2 프로세스 전체 제거 (인스턴스당 앱 1개 전제)"
echo "    - '$APP_DIR' 내용 삭제 (env 포함)"
echo "    - SSL 인증서/갱신 crontab 정리 (있으면)"
echo "    * 설치된 Node/nginx 등 패키지는 그대로 둡니다."
read -r -p "계속할까요? (y/N) " ans
[ "$ans" = "y" ] || [ "$ans" = "Y" ] || { echo "취소됨"; exit 0; }

echo "▶ [$TARGET] 앱 초기화"
# pm2 이름은 ecosystem.config.js 가 소유하고 인스턴스당 앱이 1개이므로 전체를 제거한다.
$SSH "
  set -e
  pm2 delete all || true
  pm2 save --force || true
  rm -rf '$APP_DIR'/* '$APP_DIR'/.env* '$APP_DIR'/.next 2>/dev/null || true
"

echo "▶ [$TARGET] SSL 인증서/크론 정리"
# certbot delete 후엔 nginx가 삭제된 인증서를 가리키므로 reload 하지 않는다.
# (다음 bootstrap.sh 가 nginx 설정을 HTTP 로 덮어써 정상화한다)
$SSH "
  set -e
  if command -v certbot >/dev/null 2>&1; then
    for name in \$(sudo certbot certificates 2>/dev/null | awk -F': ' '/Certificate Name/{print \$2}'); do
      echo \"  - certbot delete \$name\"
      sudo certbot delete --cert-name \"\$name\" --non-interactive || true
    done
  fi
  sudo crontab -l 2>/dev/null | grep -v 'certbot renew' | sudo crontab - || true
"

echo "✅ [$TARGET] 초기화 완료."
echo "   재배포: ./bootstrap.sh $TARGET && ./deploy.sh $TARGET <프로젝트경로>"
