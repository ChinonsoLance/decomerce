// npm run seed [-- --fresh]
//
// Imports the 40 pieces already hardcoded in the storefront's src/data.js so
// the API starts life with the shop that exists today. Their photos stay on the
// Unsplash CDN — only new admin uploads land in the uploads folder.
//
// Re-running is safe: products are matched on name and updated in place, unless
// --fresh is passed, which empties the collection first.

import { PRODUCTS } from "../../src/data.js";
import { connectDatabase, disconnectDatabase } from "./db.js";
import Product from "./models/Product.js";
import { ensureSequenceAtLeast } from "./models/Counter.js";

const fresh = process.argv.includes("--fresh");

await connectDatabase();
console.log("→ MongoDB Atlas connected");

if (fresh) {
  const { deletedCount } = await Product.deleteMany({});
  console.log(`→ Cleared ${deletedCount} existing products`);
}

let created = 0;
let updated = 0;

for (const item of PRODUCTS) {
  const doc = {
    id: item.id,
    name: item.name,
    category: item.category,
    spec: item.spec ?? "",
    badge: item.badge ?? null,
    imageUrl: item.img,
    imageFile: null,
    published: true,
  };

  const existing = await Product.findOne({ name: doc.name });

  if (existing) {
    existing.set(doc);
    await existing.save();
    updated += 1;
  } else {
    await Product.create(doc);
    created += 1;
  }
}

// Keep the id counter ahead of everything the import just wrote.
const highest = Math.max(0, ...PRODUCTS.map((p) => p.id));
await ensureSequenceAtLeast("products", highest);

console.log(`→ ${created} created, ${updated} updated (ids now start at ${highest + 1})`);

await disconnectDatabase();
