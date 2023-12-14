const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    // Add other intents as needed
  ],
});

client.once("ready", () => {
  console.log("Bot is ready!");
});

client.login(
  "MTE4NDg0MzI1NjI2MjA1MzkyOA.Gl7b_p.vVzWq49oc_khIfE9i2unWq4ftzXh2OV9seuMEw"
);
