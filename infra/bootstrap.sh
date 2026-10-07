#!/bin/bash
# [로컬에서 실행] 서버 최초 1회 셋업 (Node/yarn/pm2/nginx/certbot + swap 2G + nginx 프록시).
# 실행: ./bootstrap.sh <dev|prod>
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="${1:?사용법: ./bootstrap.sh <dev|prod>}"
# shellcheck disable=SC1091
source "$DIR/lib/load-env.sh"

echo "▶ [$TARGET] [1/2] 서버 패키지 셋업 (swap/Node/yarn/pm2/nginx/certbot)"
$SSH "bash -s -- '$APP_DIR' '$SERVER_USER'" < "$DIR/remote/server-setup.sh"

echo "▶ [$TARGET] [2/2] nginx 리버스 프록시 구성"
NGINX_CONF="$(render_nginx_conf "${ALL_DOMAINS:-_}" "$APP_PORT")"
$SSH "
  set -e
  echo '$NGINX_CONF' | sudo tee /etc/nginx/sites-available/$NGINX_SITE >/dev/null
  sudo ln -sf /etc/nginx/sites-available/$NGINX_SITE /etc/nginx/sites-enabled/$NGINX_SITE
  sudo rm -f /etc/nginx/sites-enabled/default
  sudo nginx -t && sudo systemctl reload nginx
"

echo "✅ [$TARGET] 부트스트랩 완료. 이제 './deploy.sh $TARGET <프로젝트경로>' 로 배포하세요."
