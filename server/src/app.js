// app.js — the Express application, minus the listening.
//
// Kept separate from index.js so the app can be mounted by another host or
// exercised by a test without opening a port.

import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { config } from "./config.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import { notFound, errorHandler } from "./middleware/error.js";

// The admin console lives in the repository's public/ folder, the one Vite
// copies into the production build. One copy, served three ways: by this server
// locally, by Vite on :5173, and by Vercel's CDN in production.
const publicDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "public"
);

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(
    cors({
      origin: config.cors.allowAll ? true : config.cors.origins,
      credentials: false,
    })
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Product photos. Filenames are random and a stored file is never rewritten,
  // so the browser can hold on to one indefinitely.
  app.use(
    config.uploads.publicPath,
    express.static(config.uploads.dir, {
      immutable: true,
      maxAge: "365d",
      index: false,
      dotfiles: "deny",
    }),
    // Anything the folder does not hold. Answered here rather than by the
    // generic handler so a missing file cannot echo a server path back.
    (_req, res) => res.status(404).json({ error: "Image not found" })
  );

  // The admin console. Served from this same origin, so it needs no build step
  // and no CORS exception.
  app.use(express.static(publicDir, { extensions: ["html"] }));

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: mongoose.connection.readyState === 1,
      db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      env: config.env,
      uptime: Math.round(process.uptime()),
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
