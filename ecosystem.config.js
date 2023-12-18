const path = require("path");

module.exports = {
  apps: [
    {
      name: "mythbound_discord_bot",
      script: path.join(__dirname, "bot.js"),
      env_file: path.join(__dirname, ".env_production"),
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
      },
    },
    // Additional configurations if needed
  ],
};
