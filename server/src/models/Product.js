// Product — one piece in the shop.
//
// The document mirrors the shape the storefront already consumes from
// src/data.js: { id, name, category, spec, badge, img }. `img` is a virtual so
// that an uploaded photo (a file on disk) and a hosted photo (a CDN URL) look
// identical to the client — the admin can use either and the grid never knows.

import mongoose from "mongoose";
import { config } from "../config.js";
import { CATEGORIES, BADGES } from "../categories.js";
import { nextSequence } from "./Counter.js";

const productSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },

    name: {
      type: String,
      required: [true, "A product needs a name"],
      trim: true,
      maxlength: [140, "Name is too long"],
    },

    category: {
      type: String,
      required: [true, "A product needs a category"],
      enum: { values: CATEGORIES, message: "`{VALUE}` is not a category" },
      index: true,
    },

    // The one-line detail under the name — size, thread count, tog rating.
    spec: { type: String, trim: true, default: "", maxlength: 180 },

    badge: {
      type: String,
      enum: { values: [...BADGES, null], message: "`{VALUE}` is not a badge" },
      default: null,
    },

    // Exactly one of these carries the photo: a filename inside the uploads
    // folder, or an absolute URL to a photo hosted elsewhere.
    imageFile: { type: String, trim: true, default: null },
    imageUrl: { type: String, trim: true, default: null },

    // Unpublished products stay in the admin list but leave the storefront.
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true, toObject: { virtuals: true, versionKey: false } }
);

// Free-text search across the two fields an admin actually types into.
productSchema.index({ name: "text", spec: "text" });

/** Where the storefront should fetch this product's photo. */
productSchema.virtual("img").get(function () {
  if (this.imageFile) {
    return `${config.publicBaseUrl}${config.uploads.publicPath}/${this.imageFile}`;
  }
  return this.imageUrl ?? null;
});

// Assign the next small integer id on first save.
productSchema.pre("save", async function (next) {
  if (this.isNew && this.id == null) {
    this.id = await nextSequence("products");
  }
  next();
});

// Keep the wire format exactly what the storefront's ProductCard expects, and
// drop the storage detail (which of the two image fields was used).
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(doc, ret) {
    delete ret._id;
    delete ret.imageFile;
    delete ret.imageUrl;
    return ret;
  },
});

export default mongoose.model("Product", productSchema);
