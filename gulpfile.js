const fs = require("fs");
const gulp = require("gulp");
const zip = require("gulp-zip");
const del = require("del");
const sftp = require("ssh2-sftp-client");
const packageJson = require("./package.json");
const config = require("./config.json");

// Define the task to SCP the zip archive to the server
gulp.task("scp", async () => {
  const client = new sftp();

  try {
    const connectionConfig = {
      host: config.host,
      port: config.port,
      username: config.username,
      privateKey: fs.readFileSync(config.privateKeyPath),
      passphrase: config.privateKeyPassphrase,
    };

    // Customize the remote path as needed
    const remotePath = config.remotePath;

    await client.connect(connectionConfig);
    await client.uploadDir("dist", remotePath);
  } finally {
    client.end();
  }
});

// Define the task to create a zip archive
gulp.task("zip", () => {
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
