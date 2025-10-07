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
      env: {
        NODE_ENV: 'production',
      },

      env_development: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
