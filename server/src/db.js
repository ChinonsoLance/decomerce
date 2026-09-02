// db.js — the MongoDB Atlas connection.
//
// Atlas holds product documents only. Photos live on the local filesystem
// (see storage.js), which keeps the free-tier 512MB for text where it belongs.

import dns from "node:dns";
import mongoose from "mongoose";
import { config } from "./config.js";

export async function connectDatabase() {
  if (config.dnsServers.length) dns.setServers(config.dnsServers);

  mongoose.set("strictQuery", true);
  await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 15000 });
  return mongoose.connection;
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
