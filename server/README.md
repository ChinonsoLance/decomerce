# Joyce Interiors — backend

The admin API behind the storefront. An administrator signs in, uploads a
product name and a photo, and the catalogue changes — no code edit, no redeploy.

- **Node + Express + Mongoose**, MongoDB Atlas for the product documents.
- **Photos never go into Mongo**, so the free-tier 512MB is spent on text. Two
  storage drivers sit behind one interface, chosen by whether Cloudinary
  credentials are present: `disk` writes to `server/uploads/` (local work),
  `cloudinary` uploads to their CDN (production, where there is no disk).
- **One admin account**, held in the environment rather than in a users
  collection. There is no public sign-up.
- **The wire format matches `src/data.js`** — `{ id, name, category, spec, badge,
  img }` — so the React storefront can read from the API without changing a
  single component.

## Run it

```bash
cd server
npm install
npm run seed     # imports the 40 products already in src/data.js
npm start
```

- API — <http://localhost:4000/api>
- Admin console — <http://localhost:4000/admin>

Sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`. `npm run dev`
restarts on save.

## Configuration

`.env` is git-ignored and already filled in for local work; `.env.example` is the
committed template.

| Variable | What it does |
| --- | --- |
| `MONGODB_URI` | Atlas connection string. |
| `PORT` | Defaults to 4000. |
| `JWT_SECRET` | Signs admin sessions. Rotating it signs everyone out. |
| `JWT_EXPIRES_IN` | Session length. Defaults to `12h`. |
| `ADMIN_EMAIL` | The one administrator. |
| `ADMIN_PASSWORD` | Plaintext, for local convenience. |
| `ADMIN_PASSWORD_HASH` | bcrypt hash. Set this in production and delete the plaintext line. |
| `UPLOAD_DIR` | Where photos are written, relative to `server/`. Defaults to `uploads`. |
| `MAX_UPLOAD_MB` | Per-image ceiling. Defaults to 5. |
| `CLOUDINARY_CLOUD_NAME` | Set all three and photos go to Cloudinary instead of disk. |
| `CLOUDINARY_API_KEY` | From the Cloudinary dashboard. |
| `CLOUDINARY_API_SECRET` | From the Cloudinary dashboard. Secret — never commit it. |
| `CLOUDINARY_FOLDER` | Where uploads are filed. Defaults to `decomerce/products`. |
| `PUBLIC_BASE_URL` | Origin prefixed onto image URLs. Blank gives site-relative paths. |
| `CORS_ORIGIN` | Comma-separated allowed origins, or `*`. |
| `DNS_SERVERS` | Resolvers for the Atlas SRV lookup. See the note at the bottom. |

Generate a password hash with:

```bash
npm run hash -- "your new password"
```

## The API

Reads are public. Writes need `Authorization: Bearer <token>`.

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/login` | `{ email, password }` → a token. Rate-limited to 10 tries per 15 minutes. |
| `GET` | `/api/auth/me` | Checks a stored token is still valid. |
| `GET` | `/api/products` | The catalogue. `?category=` `?q=` `?badge=` `?page=` `?limit=` |
| `GET` | `/api/products/categories` | The category and badge lists, for the admin form. |
| `GET` | `/api/products/:id` | One product. |
| `POST` | `/api/products` | **Admin.** Create. multipart/form-data. |
| `PATCH` | `/api/products/:id` | **Admin.** Update. Every field optional. |
| `DELETE` | `/api/products/:id` | **Admin.** Removes the product *and* its photo. |
| `GET` | `/uploads/:filename` | An uploaded photo, cached immutably for a year. |
| `GET` | `/api/health` | Liveness and database state. |

`includeUnpublished=true` on the list route returns drafts as well, and requires
an admin token.

### Writing a product

Fields on `POST` and `PATCH` (multipart/form-data):

| Field | Notes |
| --- | --- |
| `name` | Required on create. |
| `category` | Required on create. Must be one of the eight departments. |
| `spec` | The line under the name — `6ft × 6ft · Medium-firm · 12in`. |
| `badge` | `New`, `Bestseller`, or empty for none. |
| `published` | `false` keeps it out of the storefront. |
| `image` | The photo, as a file. jpeg, png, webp, avif or gif. |
| `imageUrl` | Instead of a file: an absolute URL to a hosted photo. |

Exactly one of `image` or `imageUrl` is needed to create a product. On update,
whichever you send replaces what was there, and the old upload is deleted once
the new one is safely saved.

```bash
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@decomerce.com","password":"..."}' | jq -r .token)

curl -X POST http://localhost:4000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=Aurelia Pocket-Spring Mattress" \
  -F "category=Mattresses" \
  -F "spec=6ft × 6ft · Medium-firm · 12in" \
  -F "badge=Bestseller" \
  -F "image=@./aurelia.jpg"
```

Errors come back as `{ "error": "…" }`, with a `details` object naming the
offending fields when validation is what failed.

## Where things live

| Path | What it is |
| --- | --- |
| `src/index.js` | Boot: connect to Atlas, then listen. |
| `src/app.js` | The Express app — CORS, static files, routes, error handling. |
| `src/config.js` | Every environment value, resolved once and validated at boot. |
| `src/db.js` | The Atlas connection. |
| `src/storage.js` | The storage drivers: disk and Cloudinary, behind one interface. |
| `src/models/Product.js` | The product document, and the `img` virtual the storefront reads. |
| `src/models/Counter.js` | The sequence behind the small integer `id`. |
| `src/routes/products.js` | The catalogue, and the admin writes. |
| `src/routes/auth.js` | Sign-in and the login brake. |
| `src/middleware/upload.js` | Multer: one image per request, buffered for whichever driver is active. |
| `src/seed.js` | Imports the storefront's hardcoded catalogue. |
| `../public/admin.html` | The admin console. One file, no build step, served by all three environments. |
| `../api/[[...path]].js` | The Vercel entry point — hands every `/api/*` request to the same Express app. |

## Connecting the storefront

The API returns exactly the shape `src/data.js` exports, so `PRODUCTS` can be
swapped for a fetch without touching `ProductCard`, `Products.jsx` or
`QuickView`:

```js
const res = await fetch("http://localhost:4000/api/products?limit=100");
const { products } = await res.json();   // same fields as PRODUCTS
```

Keep `CATEGORY_META`, `HERO_SLIDES` and the rest of the editorial content in
`src/data.js` — the API deliberately owns products only.

## Deploying

The storefront, the API and the admin console all run on one Vercel project and
one domain. `vercel.json` sends `/admin` to the static console and everything
else to the React app; `api/[[...path]].js` catches `/api/*` and hands it to
this same Express app as a serverless function.

Vercel has no persistent disk, so **production must use Cloudinary** — set the
three `CLOUDINARY_*` variables and the disk driver steps aside automatically.
Without them the API would accept an upload, write it to a temporary
filesystem, and lose it on the next request.

Set these in the Vercel dashboard, under Settings → Environment Variables:

| Variable | Value |
| --- | --- |
| `MONGODB_URI` | The Atlas connection string. |
| `JWT_SECRET` | A fresh random string — not the local one. |
| `ADMIN_EMAIL` | The administrator's address. |
| `ADMIN_PASSWORD_HASH` | Output of `npm run hash -- "…"`. Do not set `ADMIN_PASSWORD`. |
| `CLOUDINARY_CLOUD_NAME` | From the Cloudinary dashboard. |
| `CLOUDINARY_API_KEY` | From the Cloudinary dashboard. |
| `CLOUDINARY_API_SECRET` | From the Cloudinary dashboard. |
| `CORS_ORIGIN` | The site's own origin, e.g. `https://decomerce.vercel.app`. |

Atlas also needs to accept connections from Vercel: Network Access → add
`0.0.0.0/0`. Serverless functions have no fixed egress address, so an IP
allowlist cannot be narrower than that. The database password is what protects
it — make it a good one.

`PUBLIC_BASE_URL` can stay unset in production: Cloudinary returns absolute
URLs, so nothing needs a prefix.

### Hosting it somewhere with a real disk instead

Leave the Cloudinary variables blank and the disk driver takes over, which suits
a VPS, or Render/Railway/Fly with a mounted volume pointed at by `UPLOAD_DIR`.
Only the free tiers without a volume are a problem — those wipe the filesystem
on every deploy.

## If it will not start

`querySrv EBADRESP` at boot means the network's DNS resolver mangles the SRV
record that a `mongodb+srv://` URI depends on. It is not an Atlas fault and not
a credentials problem. Set:

```
DNS_SERVERS=1.1.1.1,8.8.8.8
```

which is already set in the local `.env`, since this machine's resolver does
exactly that.
