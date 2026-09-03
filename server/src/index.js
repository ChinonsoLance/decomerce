// index.js — boot: connect to Atlas first, then accept traffic.
//
// Connecting before listening means the API never answers a request it cannot
// serve, and a bad connection string kills the process instead of leaving a
// server that 500s on everything.

import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./db.js";
import { ensureUploadDir, driver } from "./storage.js";
import { config } from "./config.js";

let server;

try {
  await connectDatabase();
  console.log("→ MongoDB Atlas connected");
} catch (err) {
  console.error("✗ Could not reach MongoDB Atlas:", err.message);
  process.exit(1);
}

if (driver === "disk") {
  await ensureUploadDir();
  console.log(`→ Photos on disk at ${config.uploads.dir}`);
} else {
  console.log(`→ Photos on Cloudinary (${config.cloudinary.cloudName})`);
}

server = createApp().listen(config.port, () => {
  console.log(`→ Joyce Interiors API on http://localhost:${config.port}`);
  console.log(`→ Admin console  http://localhost:${config.port}/admin`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    console.log(`\n${signal} — shutting down`);
    server?.close();
    await disconnectDatabase();
    process.exit(0);
  });
}
