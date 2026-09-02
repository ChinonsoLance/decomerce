// Counter — the sequence behind Product.id.
//
// The storefront keys products by a small integer (`product.id` is used for
// wishlists, quick-view links and the placeholder image seed), so the API keeps
// that contract instead of exposing raw ObjectIds to the UI.

import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: String,
  value: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

export async function nextSequence(name) {
  const doc = await Counter.findByIdAndUpdate(
    name,
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return doc.value;
}

/** Lifts the counter so it never re-issues an id an import already used. */
export async function ensureSequenceAtLeast(name, floor) {
  await Counter.findByIdAndUpdate(
    name,
    { $max: { value: floor } },
    { upsert: true }
  );
}

export default Counter;
