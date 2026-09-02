// Admin sign-in. POST a password, get a bearer token back.

import { Router } from "express";
import { verifyAdmin, issueToken, requireAdmin } from "../middleware/auth.js";
import { ApiError } from "../middleware/error.js";
import { config } from "../config.js";

const router = Router();

// A slow, in-memory brake on password guessing. One admin, one process — this
// does not need to be a distributed rate limiter.
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function tooManyAttempts(ip) {
  const record = attempts.get(ip);
  if (!record || Date.now() - record.first > WINDOW_MS) return false;
  return record.count >= MAX_ATTEMPTS;
}

function recordFailure(ip) {
  const record = attempts.get(ip);
  if (!record || Date.now() - record.first > WINDOW_MS) {
    attempts.set(ip, { first: Date.now(), count: 1 });
  } else {
    record.count += 1;
  }
}

router.post("/login", async (req, res, next) => {
  try {
    const ip = req.ip ?? "unknown";
    if (tooManyAttempts(ip)) {
      throw new ApiError(429, "Too many attempts — try again in 15 minutes");
    }

    const { email, password } = req.body ?? {};
    const identity = await verifyAdmin(email, password);

    if (!identity) {
      recordFailure(ip);
      throw new ApiError(401, "Wrong email or password");
    }

    attempts.delete(ip);
    res.json({
      token: issueToken(identity),
      expiresIn: config.jwt.expiresIn,
      admin: { email: identity.sub, role: identity.role },
    });
  } catch (err) {
    next(err);
  }
});

// Lets the admin console check a stored token is still good before rendering.
router.get("/me", requireAdmin, (req, res) => {
  res.json({ admin: { email: req.admin.sub, role: req.admin.role } });
});

export default router;
