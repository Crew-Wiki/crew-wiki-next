module.exports = {
  apps: [
    {
      name: 'crew-wiki',
      script: './node_modules/next/dist/bin/next',
      args: 'start',
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      // dev/prod 서버 모두 프로덕션 빌드를 next start 로 띄우므로 NODE_ENV 는 항상 production.
      // 타겟별 차이는 서버에 업로드되는 env 파일(.env.local / .env.production)이 가진다.
      // PORT 는 infra/.env 의 APP_PORT(= nginx 프록시 대상)와 일치해야 한다.
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
