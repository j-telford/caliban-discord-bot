const fs = require("fs");
const gulp = require("gulp");
const zip = require("gulp-zip");
const del = require("del");
const sftp = require("ssh2-sftp-client");
const config = require("config");

// Define the task to SCP the zip archive to the server
gulp.task("scp", async () => {
  const client = new sftp();

  try {
    const connectionConfig = {
      host: config.get("host"),
      port: config.get("port"),
      username: config.get("username"),
    };

    // Check if private key path is defined in config
    if (config.has("privateKeyPath")) {
      connectionConfig.privateKey = fs.readFileSync(
        config.get("privateKeyPath")
      );
    }

    // Check if password is defined in config
    if (config.has("password")) {
      connectionConfig.password = config.get("password");
    }

    await client.connect(connectionConfig);

    // Update the remote path as needed
    const remotePath = "~/discordbot/";

    // Upload the zip file
    await client.uploadDir("dist", remotePath);
  } finally {
    client.end();
  }
});

// Define the task to create a zip archive
gulp.task("zip", () => {
  // Check if the dist directory exists, and create it if not
  if (!fs.existsSync("./dist")) {
    fs.mkdirSync("./dist");
  }

  const packageName = config.get("name");
  const version = config.get("version");
  const zipName = `${packageName}-${version}.zip`;

  return gulp
    .src([
      "bot.js",
      "package-lock.json",
      "package.json",
      "LICENSE",
      "README.md",
      // Add other necessary files
    ])
    .pipe(zip(zipName))
    .pipe(gulp.dest("./dist"));
});

// Define the task to clean the /dist directory
gulp.task("clean", () => del(["dist"]));

// Define the task to reset (clean, zip, scp)
gulp.task("reset", gulp.series("clean", "zip", "scp"));

// Define the default task to run all tasks
gulp.task("default", gulp.series("reset"));
