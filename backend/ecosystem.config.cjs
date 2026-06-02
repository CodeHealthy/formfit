module.exports = {
  apps: [
    {
      name: 'formfit-backend',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      env_production: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '300M',
    },
  ],
};
