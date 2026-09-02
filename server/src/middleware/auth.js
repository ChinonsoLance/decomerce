// auth.js — the admin gate.
//
// There is one administrator and no public sign-up, so the account lives in the
// environment rather than in a users collection. Login exchanges the password
// for a short-lived JWT; every write route demands that token.

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../config.js";
import { ApiError } from "./error.js";

/** Verifies a login attempt. Resolves to the admin identity or null. */
export async function verifyAdmin(email, password) {
  if (typeof email !== "string" || typeof password !== "string") return null;
  if (email.trim().toLowerCase() !== config.admin.email) return null;

  const ok = config.admin.passwordHash
    ? await bcrypt.compare(password, config.admin.passwordHash)
    : password === config.admin.password;

  return ok ? { sub: config.admin.email, role: "admin" } : null;
}

export function issueToken(identity) {
  return jwt.sign(identity, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

/** Route guard: 401s unless a valid admin bearer token is present. */
export function requireAdmin(req, _res, next) {
  const header = req.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return next(new ApiError(401, "Sign in as an administrator to do that"));
  }

  try {
    const claims = jwt.verify(token, config.jwt.secret);
    if (claims.role !== "admin") throw new Error("not an admin");
    req.admin = claims;
    next();
  } catch {
    next(new ApiError(401, "Your session has expired — sign in again"));
  }
}

/** True when the request carries a valid admin token. Never throws. */
export function isAdminRequest(req) {
  const [scheme, token] = (req.get("authorization") ?? "").split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return false;
  try {
    return jwt.verify(token, config.jwt.secret).role === "admin";
  } catch {
    return false;
  }
}
