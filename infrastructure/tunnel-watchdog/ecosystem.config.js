/**
 * PM2 Ecosystem Configuration for Tunnel Watchdog
 * Samsung S25 (Termux) Production Environment
 *
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 save
 */

module.exports = {
  apps: [
    {
      name: 'tunnel-watchdog',
      script: './scripts/watchdog.sh',
      interpreter: 'bash',
      cron_restart: '*/5 * * * *', // Runs health check every 5 minutes
      autorestart: false,          // One-shot check on cron schedule
      watch: false,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '../../logs/pm2-error.log',
      out_file: '../../logs/pm2-out.log',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
