// upload.js — accepts one product photo per request and writes it to disk.

import multer from "multer";
import { config } from "../config.js";
import { buildFilename, ensureUploadDir } from "../storage.js";
import { ApiError } from "./error.js";

const storage = multer.diskStorage({
  async destination(_req, _file, cb) {
    try {
      cb(null, await ensureUploadDir());
    } catch (err) {
      cb(err);
    }
  },
  filename(_req, file, cb) {
    cb(null, buildFilename(file.originalname, file.mimetype));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: config.uploads.maxBytes, files: 1 },
  fileFilter(_req, file, cb) {
    if (config.uploads.mimeTypes.includes(file.mimetype)) return cb(null, true);
    cb(
      new ApiError(
        415,
        `${file.mimetype} is not a supported image (use ${config.uploads.mimeTypes
          .map((m) => m.replace("image/", ""))
          .join(", ")})`
      )
    );
  },
});

/** Reads the optional `image` file field off a multipart request. */
export const singleImage = upload.single("image");
