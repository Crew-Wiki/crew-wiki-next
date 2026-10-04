#!/bin/bash
# 서버(Ubuntu)에서 실행되는 초기 셋업. bootstrap.sh 가 SSH로 이 파일을 흘려보낸다.
# swap, Node, yarn, pm2, nginx, certbot 설치. 여러 번 실행해도 안전(idempotent).
set -euo pipefail

APP_DIR="${1:-/srv/app}"
SERVER_USER="${2:-ubuntu}"

echo "▶ swap 2GB (저메모리 대비)"
if [ ! -f /swapfile ]; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab >/dev/null
fi

echo "▶ 기본 패키지 + nginx"
sudo apt-get update -y
sudo apt-get install -y curl gettext-base nginx

echo "▶ Node 22 (client 의 packageManager/CI 와 동일 계열)"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# client 는 yarn 1(classic) 을 쓴다. corepack 은 쓰지 않는다.
echo "▶ yarn 1 (classic)"
sudo npm install -g yarn@1.22.22

echo "▶ pm2 + 부팅 자동시작"
sudo npm install -g pm2
sudo env PATH="$PATH:/usr/bin" pm2 startup systemd -u "$SERVER_USER" --hp "/home/$SERVER_USER" >/dev/null

echo "▶ 앱 디렉토리 $APP_DIR"
sudo mkdir -p "$APP_DIR"
sudo chown -R "$SERVER_USER:$SERVER_USER" "$APP_DIR"

echo "▶ certbot (SSL용)"
sudo apt-get install -y certbot python3-certbot-nginx

echo "✅ 서버 셋업 완료"
node -v && yarn -v && pm2 -v
