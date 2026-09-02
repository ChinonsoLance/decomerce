// error.js — one shape for every failure the API returns.

import multer from "multer";

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function notFound(req, _res, next) {
  next(new ApiError(404, `No route for ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars -- Express needs the 4-arg signature.
export function errorHandler(err, req, res, _next) {
  let status = err.status ?? 500;
  let message = err.message ?? "Something went wrong";
  let details = err.details;

  // Mongoose validation — surface which field the admin got wrong.
  if (err.name === "ValidationError") {
    status = 422;
    message = "Some fields need fixing";
    details = Object.fromEntries(
      Object.entries(err.errors).map(([field, e]) => [field, e.message])
    );
  } else if (err.name === "CastError") {
    status = 400;
    message = `\`${err.value}\` is not a valid ${err.path}`;
  } else if (err.code === "ENOENT") {
    // A missing static file. Never echo the filesystem path back to a client.
    status = 404;
    message = "Image not found";
    details = undefined;
  } else if (err.code === 11000) {
    status = 409;
    message = "That already exists";
  } else if (err instanceof multer.MulterError) {
    status = 413;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "That image is too large"
        : `Upload rejected: ${err.message}`;
  }

  if (status >= 500) console.error(err);

  res.status(status).json({ error: message, ...(details ? { details } : {}) });
}
