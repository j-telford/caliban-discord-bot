module.exports = {
  apps: [
    {
      name: "mythbound_discord_bot",
      script: "/home/jay/caliban/bot.js",
      env_file: "/home/jay/caliban/.env_production",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
    },
    // Additional configurations if needed
  ],
};
