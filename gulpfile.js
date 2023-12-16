const fs = require("fs");
const gulp = require("gulp");
const zip = require("gulp-zip");
const del = require("del");
const sftp = require("ssh2-sftp-client");
const packageJson = require("./package.json");
require("dotenv").config(); // Load environment variables from .env file

// Use process.env to get environment variables
const MY_PROJECT_HOST = process.env.MY_PROJECT_HOST;
const MY_PROJECT_PORT = parseInt(process.env.MY_PROJECT_PORT, 10);
const MY_PROJECT_USERNAME = process.env.MY_PROJECT_USERNAME;
const MY_PROJECT_PRIVATE_KEY_PATH = process.env.MY_PROJECT_PRIVATE_KEY_PATH;
const MY_PROJECT_PASSWORD = process.env.MY_PROJECT_PASSWORD;
const MY_PROJECT_REMOTE_PATH = process.env.MY_PROJECT_REMOTE_PATH;
const BOT_TOKEN = process.env.BOT_TOKEN;

// Use process.env to get environment variables
const scppassword = MY_PROJECT_PASSWORD;

// Define the task to create a zip archive
gulp.task("zip", () => {
  // Check if the dist directory exists, and create it if not
  if (!fs.existsSync("./dist")) {
    fs.mkdirSync("./dist");
  }

  const packageName = packageJson.name;
  const version = packageJson.version;
  const zipName = `${packageName}-${version}.zip`;

  return gulp
    .src([
      "bot.js",
      "package-lock.json",
      "package.json",
      "LICENSE",
      "README.md",
      ".env_production",
      // Add other necessary files
    ])
    .pipe(zip(zipName))
    .pipe(gulp.dest("./dist"));
});

// Define the task to SCP the zip archive to the server
gulp.task("scp", async () => {
  const client = new sftp();

  try {
    const connectionConfig = {
      host: MY_PROJECT_HOST,
      port: MY_PROJECT_PORT,
      username: MY_PROJECT_USERNAME,
      privateKey: fs.readFileSync(MY_PROJECT_PRIVATE_KEY_PATH),
      passphrase: MY_PROJECT_PASSWORD,
    };

    const remotePath = MY_PROJECT_REMOTE_PATH;

    await client.connect(connectionConfig);
    await client.uploadDir("dist", remotePath);
  } finally {
    client.end();
  }
});

// Define the task to clean the /dist directory
gulp.task("clean", () => del(["dist"]));

// Define the task to reset (clean, zip, scp)
gulp.task("reset", gulp.series("clean", "zip", "scp"));

// Define the default task to run all tasks
gulp.task("default", gulp.series("reset"));

// Create a task to run the bot locally
gulp.task("run-local", () => {
  // You can add any other necessary configurations for running the bot locally
  // For example, you might want to pass the local token here
  client.login(MY_PROJECT_TOKEN);
});
