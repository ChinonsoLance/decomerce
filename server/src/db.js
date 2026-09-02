// db.js — the MongoDB Atlas connection.
//
// Atlas holds product documents only. Photos live on the local filesystem
// (see storage.js), which keeps the free-tier 512MB for text where it belongs.

import dns from "node:dns";
import mongoose from "mongoose";
import { config } from "./config.js";

// A serverless function is invoked far more often than it is cold-started, and
// each invocation reuses the module scope. Caching the promise means one
// connection per container instead of one per request — which would exhaust the
// Atlas connection limit within a few minutes of traffic.
let connection = null;

export async function connectDatabase() {
  if (connection) return connection;

  if (config.dnsServers.length) dns.setServers(config.dnsServers);

  mongoose.set("strictQuery", true);

  connection = mongoose
    .connect(config.mongoUri, {
      serverSelectionTimeoutMS: 15000,
      // Serverless containers are frozen between invocations; a small pool
      // avoids holding sockets a paused instance will never use again.
      maxPoolSize: 10,
    })
    .then((m) => m.connection)
    .catch((err) => {
      // Never cache a failure — the next request deserves a fresh attempt.
      connection = null;
      throw err;
    });

  return connection;
}

export async function disconnectDatabase() {
  connection = null;
  await mongoose.disconnect();
}
