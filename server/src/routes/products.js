// The product catalogue. Reads are public; writes need the admin token.
//
// Writes are multipart/form-data so the name and the photo arrive in one
// request — the admin fills a form, picks a file, and the product exists.

import { Router } from "express";
import Product from "../models/Product.js";
import { CATEGORIES, BADGES } from "../categories.js";
import { requireAdmin, isAdminRequest } from "../middleware/auth.js";
import { singleImage } from "../middleware/upload.js";
import { deleteUpload } from "../storage.js";
import { ApiError } from "../middleware/error.js";

const router = Router();

/** Multipart sends everything as a string; put the types back. */
function readFields(body = {}) {
  const fields = {};

  if (body.name !== undefined) fields.name = String(body.name).trim();
  if (body.category !== undefined) fields.category = String(body.category).trim();
  if (body.spec !== undefined) fields.spec = String(body.spec).trim();

  if (body.badge !== undefined) {
    const badge = String(body.badge).trim();
    if (badge && !BADGES.includes(badge)) {
      throw new ApiError(422, `Badge must be one of: ${BADGES.join(", ")}`);
    }
    fields.badge = badge || null;
  }

  if (body.published !== undefined) {
    fields.published = !["false", "0", "no", ""].includes(
      String(body.published).toLowerCase()
    );
  }

  if (body.imageUrl !== undefined) {
    const url = String(body.imageUrl).trim();
    if (url && !/^https?:\/\//i.test(url)) {
      throw new ApiError(422, "imageUrl must start with http:// or https://");
    }
    fields.imageUrl = url || null;
  }

  return fields;
}

/** Finds by the small integer id the storefront uses. */
async function findProduct(id) {
  const numeric = Number(id);
  if (!Number.isInteger(numeric)) throw new ApiError(404, "No such product");

  const product = await Product.findOne({ id: numeric });
  if (!product) throw new ApiError(404, "No such product");
  return product;
}

// ── Read ────────────────────────────────────────────────────────────────────

/** The department list, for the admin form's category select. */
router.get("/categories", (_req, res) => {
  res.json({ categories: CATEGORIES, badges: BADGES });
});

/**
 * GET /api/products
 * ?category=Rugs & Carpets  ?q=linen  ?badge=New  ?page=1  ?limit=24
 * ?includeUnpublished=true (admin token required)
 */
router.get("/", async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.category && req.query.category !== "All") {
      filter.category = req.query.category;
    }
    if (req.query.badge) filter.badge = req.query.badge;

    if (req.query.q) {
      const term = String(req.query.q).trim();
      // Regex rather than $text so partial words match as the admin types.
      const safe = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: new RegExp(safe, "i") },
        { spec: new RegExp(safe, "i") },
      ];
    }

    // Drafts are admin-only. Anyone without a token sees the live shop.
    const wantsDrafts = req.query.includeUnpublished === "true";
    if (wantsDrafts && !isAdminRequest(req)) {
      throw new ApiError(401, "Sign in as an administrator to see drafts");
    }
    if (!wantsDrafts) filter.published = true;

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 24));

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1, id: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      products: items,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    res.json({ product: await findProduct(req.params.id) });
  } catch (err) {
    next(err);
  }
});

// ── Write ───────────────────────────────────────────────────────────────────

/** POST /api/products — multipart: name, category, spec, badge, image | imageUrl */
router.post("/", requireAdmin, singleImage, async (req, res, next) => {
  try {
    const fields = readFields(req.body);

    if (!fields.name) throw new ApiError(422, "A product needs a name");
    if (!req.file && !fields.imageUrl) {
      throw new ApiError(422, "Attach an image file or give an imageUrl");
    }

    if (req.file) {
      fields.imageFile = req.file.filename;
      fields.imageUrl = null;
    }

    try {
      const product = await Product.create(fields);
      res.status(201).json({ product });
    } catch (err) {
      // Do not leave an orphaned file behind if the document is rejected.
      if (req.file) await deleteUpload(req.file.filename);
      throw err;
    }
  } catch (err) {
    next(err);
  }
});

/** PATCH /api/products/:id — same fields, all optional. */
router.patch("/:id", requireAdmin, singleImage, async (req, res, next) => {
  try {
    const product = await findProduct(req.params.id);
    const fields = readFields(req.body);
    const previousFile = product.imageFile;

    // A new photo — by file or by URL — replaces whatever was there.
    if (req.file) {
      product.imageFile = req.file.filename;
      product.imageUrl = null;
    } else if (fields.imageUrl) {
      product.imageFile = null;
      product.imageUrl = fields.imageUrl;
    }
    delete fields.imageUrl;

    product.set(fields);
    await product.save();

    // Only bin the old photo once the new state is safely persisted.
    if (previousFile && previousFile !== product.imageFile) {
      await deleteUpload(previousFile);
    }

    res.json({ product });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const product = await findProduct(req.params.id);
    await product.deleteOne();
    await deleteUpload(product.imageFile);
    res.json({ deleted: product.id });
  } catch (err) {
    next(err);
  }
});

export default router;
