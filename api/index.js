// The Vercel serverless entry point.
//
// vercel.json rewrites every /api/* request here, so Express does its own
// routing with the original URL intact. The rewrite does the catch-all work
// rather than a bracketed filename: Vercel read `[[...path]].js` as a single
// dynamic segment, which routed /api/health but 404'd /api/auth/login before
// the function was ever invoked. The application is unchanged — it is the same
// one `npm start` serves on port 4000 locally.
//
// Cold starts connect to Atlas; warm invocations reuse the cached connection in
// server/src/db.js, so a busy shop opens one connection per container rather
// than one per request.

import { createApp } from "../server/src/app.js";
import { connectDatabase } from "../server/src/db.js";

const app = createApp();

export default async function handler(req, res) {
  try {
    await connectDatabase();
  } catch (err) {
    console.error("Database unreachable:", err.message);
    return res
      .status(503)
      .json({ error: "The catalogue is temporarily unavailable" });
  }

  return app(req, res);
}
