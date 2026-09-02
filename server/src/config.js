// config.js — every environment value the server reads, resolved once.
//
// Anything missing that the server cannot invent a safe default for throws at
// boot rather than at the first request, so a misconfigured deploy fails loudly.

import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const origins = (process.env.CORS_ORIGIN ?? "*")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export const config = {
  env: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  mongoUri: required("MONGODB_URI"),

  // Prefixes image URLs handed to the storefront. Leave it blank and the API
  // returns site-relative paths, which only work when the client shares an
  // origin with the API — set it to the deployed API origin otherwise.
  publicBaseUrl: (process.env.PUBLIC_BASE_URL ?? "").replace(/\/$/, ""),

  jwt: {
    secret: required("JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN ?? "12h",
  },

  admin: {
    email: (process.env.ADMIN_EMAIL ?? "admin@decomerce.com").toLowerCase(),
    // Prefer the hash. The plaintext fallback exists so a fresh clone runs
    // without a setup step; production should set the hash and delete it.
    passwordHash: process.env.ADMIN_PASSWORD_HASH?.trim() || null,
    password: process.env.ADMIN_PASSWORD?.trim() || null,
  },

  cors: { origins, allowAll: origins.includes("*") },

  // Some home and office resolvers mangle the SRV record an mongodb+srv:// URI
  // depends on, which surfaces as EBADRESP at boot. Naming resolvers here makes
  // the driver ask those instead. Empty = use the system resolver.
  dnsServers: (process.env.DNS_SERVERS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  uploads: {
    // Where product photos are written. Point UPLOAD_DIR at a mounted volume
    // when deploying somewhere the filesystem is wiped between releases.
    dir: path.resolve(serverRoot, process.env.UPLOAD_DIR ?? "uploads"),
    // The URL prefix those files are served under.
    publicPath: "/uploads",
    maxBytes: Number(process.env.MAX_UPLOAD_MB ?? 5) * 1024 * 1024,
    // Formats a browser will render in an <img> without a plugin.
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
  },
};

if (!config.admin.passwordHash && !config.admin.password) {
  throw new Error("Set ADMIN_PASSWORD_HASH (preferred) or ADMIN_PASSWORD");
}
