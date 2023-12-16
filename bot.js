const { Client, GatewayIntentBits } = require("discord.js");
const Parser = require("rss-parser");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const parser = new Parser();
const articleCache = new Set();

client.once("ready", () => {
  console.log("Bot is ready!");

  // Initial fetch and post
  fetchAndPostArticles();

  // Schedule fetching and posting every 4 hours
  setInterval(fetchAndPostArticles, 4 * 60 * 60 * 1000);
});

// Function to fetch and post new articles
async function fetchAndPostArticles() {
  try {
    // Parse the RSS feed
    const feed = await parser.parseURL("https://mythbound.online/rss");

    // Find the "published-articles" channel
    const channel = client.channels.cache.find(
      (ch) => ch.name === "published-articles" && ch.type === "GUILD_TEXT"
    );

    if (channel) {
      // Post links to new articles
      feed.items.forEach((item) => {
        if (!articleCache.has(item.link)) {
          channel.send(item.link);
          articleCache.add(item.link);
        }
      });
    } else {
      console.error('Channel "published-articles" not found!');
    }
  } catch (error) {
    console.error("Error fetching or posting articles:", error.message);
  }
}

client.login(
  "MTE4NDg0MzI1NjI2MjA1MzkyOA.Gl7b_p.vVzWq49oc_khIfE9i2unWq4ftzXh2OV9seuMEw"
);
