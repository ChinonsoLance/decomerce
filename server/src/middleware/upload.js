// upload.js — accepts one product photo per request.
//
// The file is held in memory rather than written straight to disk, because the
// storage driver decides where it belongs: a folder, or Cloudinary. Uploads are
// capped well below any sensible memory limit, so a buffer is cheap.

import multer from "multer";
import { config } from "../config.js";
import { ApiError } from "./error.js";

const upload = multer({
  storage: multer.memoryStorage(),
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
