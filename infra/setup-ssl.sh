#!/bin/bash
# [로컬에서 실행] 도메인 SSL 인증서 발급 + 매주 월요일 갱신 crontab (인스턴스당 1회).
# 사전 조건: 타겟 DOMAIN 의 A레코드가 해당 서버 (Elastic) IP 로 연결되어 전파 완료.
# 실행: ./setup-ssl.sh <dev|prod>
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="${1:?사용법: ./setup-ssl.sh <dev|prod>}"
# shellcheck disable=SC1091
source "$DIR/lib/load-env.sh"

: "${DOMAIN:?${UP}_DOMAIN 을 .env 에 채우세요}"
: "${CERTBOT_EMAIL:?${UP}_CERTBOT_EMAIL 을 .env 에 채우세요}"

echo "▶ [$TARGET] nginx server_name 을 '$ALL_DOMAINS' 로 갱신"
NGINX_CONF="$(render_nginx_conf "$ALL_DOMAINS" "$APP_PORT")"
$SSH "
  set -e
  echo '$NGINX_CONF' | sudo tee /etc/nginx/sites-available/$NGINX_SITE >/dev/null
  sudo nginx -t && sudo systemctl reload nginx
"

echo "▶ [$TARGET] certbot 발급 (+ HTTP→HTTPS 리다이렉트):$CERTBOT_DOMAIN_ARGS"
# 도메인이 여럿이면 한 인증서(SAN)로 묶어 발급한다. 목록이 기존 인증서와 다르면
# --cert-name 으로 같은 lineage 를 갱신해 인증서가 쪼개지지 않게 한다.
$SSH "
  sudo certbot --nginx --cert-name '$DOMAIN'$CERTBOT_DOMAIN_ARGS \
    --non-interactive --agree-tos -m '$CERTBOT_EMAIL' --redirect --expand
"

echo "▶ [$TARGET] 매주 월요일 03:00 인증서 갱신 crontab 등록"
$SSH "
  set -e
  CRON_LINE='0 3 * * 1 certbot renew --quiet --deploy-hook \"systemctl reload nginx\"'
  ( sudo crontab -l 2>/dev/null | grep -v 'certbot renew' ; echo \"\$CRON_LINE\" ) | sudo crontab -
"

echo "✅ [$TARGET] SSL 완료 → https://$DOMAIN"
