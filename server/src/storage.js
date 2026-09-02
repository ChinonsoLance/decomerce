// storage.js — product photos on disk.
//
// Mongo stores a filename and nothing more; the bytes sit in config.uploads.dir
// and are served as static files. Names are randomised so two uploads called
// "IMG_0001.jpg" cannot overwrite each other, and so a filename can never be
// steered out of the uploads folder by a crafted upload.

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { config } from "./config.js";

const EXTENSIONS = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
};

export async function ensureUploadDir() {
  await fs.mkdir(config.uploads.dir, { recursive: true });
  return config.uploads.dir;
}

/** A collision-proof, traversal-proof filename that keeps a readable stem. */
export function buildFilename(originalName, mimetype) {
  const stem = path
    .basename(originalName ?? "product", path.extname(originalName ?? ""))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "product";

  const ext = EXTENSIONS[mimetype] ?? ".jpg";
  return `${stem}-${Date.now().toString(36)}-${crypto.randomBytes(6).toString("hex")}${ext}`;
}

/** Absolute path of a stored photo, refusing anything outside the folder. */
export function resolveUpload(filename) {
  const full = path.resolve(config.uploads.dir, path.basename(filename));
  return full.startsWith(config.uploads.dir) ? full : null;
}

/** Deletes a photo. A file that is already gone is a success, not an error. */
export async function deleteUpload(filename) {
  if (!filename) return;
  const full = resolveUpload(filename);
  if (!full) return;

  try {
    await fs.unlink(full);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
}
