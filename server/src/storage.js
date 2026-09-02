// storage.js — where product photos actually live.
//
// Two drivers behind one interface:
//
//   disk        bytes in config.uploads.dir, served by this server at /uploads.
//               The default, and what local development uses.
//   cloudinary  bytes on Cloudinary's CDN, served by them. Used whenever
//               credentials are present, because a serverless host (Vercel)
//               has no disk that survives a deploy.
//
// The rest of the app calls saveImage/removeImage and never learns which one
// is in play. Mongo stores whatever the driver hands back.

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { v2 as cloudinary } from "cloudinary";
import { config } from "./config.js";

const EXTENSIONS = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
};

export const driver = config.cloudinary.configured ? "cloudinary" : "disk";

if (driver === "cloudinary") {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });
}

/* ── shared ───────────────────────────────────────────────────────────── */

/** A readable, collision-proof stem taken from what the admin uploaded. */
function slugify(originalName) {
  const stem = path
    .basename(originalName ?? "product", path.extname(originalName ?? ""))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  return stem || "product";
}

function uniqueSuffix() {
  return Date.now().toString(36) + "-" + crypto.randomBytes(6).toString("hex");
}

/* ── disk ─────────────────────────────────────────────────────────────── */

export async function ensureUploadDir() {
  await fs.mkdir(config.uploads.dir, { recursive: true });
  return config.uploads.dir;
}

/** Absolute path of a stored photo, refusing anything outside the folder. */
export function resolveUpload(filename) {
  const full = path.resolve(config.uploads.dir, path.basename(filename));
  return full.startsWith(config.uploads.dir) ? full : null;
}

async function saveToDisk(file) {
  await ensureUploadDir();

  const filename =
    slugify(file.originalname) +
    "-" +
    uniqueSuffix() +
    (EXTENSIONS[file.mimetype] ?? ".jpg");

  await fs.writeFile(path.join(config.uploads.dir, filename), file.buffer);

  return { imageFile: filename, imageUrl: null, imagePublicId: null };
}

async function removeFromDisk(filename) {
  const full = resolveUpload(filename);
  if (!full) return;

  try {
    await fs.unlink(full);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
}

/* ── cloudinary ───────────────────────────────────────────────────────── */

function saveToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: config.cloudinary.folder,
        public_id: slugify(file.originalname) + "-" + uniqueSuffix(),
        resource_type: "image",
        overwrite: false,
        // Let the CDN pick a modern format and a sane quality per browser.
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (err, result) => {
        if (err) return reject(err);
        resolve({
          imageFile: null,
          imageUrl: result.secure_url,
          imagePublicId: result.public_id,
        });
      }
    );

    stream.end(file.buffer);
  });
}

async function removeFromCloudinary(publicId) {
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

/* ── the interface the app uses ───────────────────────────────────────── */

/**
 * Persists an uploaded photo.
 * @returns {Promise<{imageFile: string|null, imageUrl: string|null, imagePublicId: string|null}>}
 */
export async function saveImage(file) {
  return driver === "cloudinary" ? saveToCloudinary(file) : saveToDisk(file);
}

/**
 * Deletes a stored photo. A photo that is already gone is a success, not an
 * error — the caller only wants it to no longer exist.
 *
 * Photos referenced by URL alone (an admin pasted a link) are left untouched:
 * they belong to somebody else's server.
 */
export async function removeImage({ imageFile, imagePublicId } = {}) {
  try {
    if (imagePublicId) return await removeFromCloudinary(imagePublicId);
    if (imageFile) return await removeFromDisk(imageFile);
  } catch (err) {
    // A failed cleanup must not fail the request that triggered it: the
    // product is already gone, and a stray file is a smaller problem.
    console.error("Could not delete stored image:", err.message);
  }
}
