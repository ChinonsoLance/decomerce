# DECOMERCE — backend

The admin API behind the storefront. An administrator signs in, uploads a
product name and a photo, and the catalogue changes — no code edit, no redeploy.

- **Node + Express + Mongoose**, MongoDB Atlas for the product documents.
- **Photos live on disk**, in `server/uploads/`. Mongo stores only the filename,
  so the free-tier 512MB is spent on text and never on images.
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
| `src/storage.js` | Photos on disk: naming, resolving, deleting. |
| `src/models/Product.js` | The product document, and the `img` virtual the storefront reads. |
| `src/models/Counter.js` | The sequence behind the small integer `id`. |
| `src/routes/products.js` | The catalogue, and the admin writes. |
| `src/routes/auth.js` | Sign-in and the login brake. |
| `src/middleware/upload.js` | Multer: one image per request, straight to `uploads/`. |
| `src/seed.js` | Imports the storefront's hardcoded catalogue. |
| `public/admin.html` | The admin console. One file, no build step. |

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

The uploads folder is ordinary disk, which matters:

- **A VPS, or any host with a persistent disk** — works as-is.
- **Render, Railway, Fly** — mount a volume and point `UPLOAD_DIR` at it.
- **Vercel and other ephemeral hosts** — the filesystem is wiped on every
  release, so uploaded photos would disappear. Either mount a volume or move the
  uploads to object storage (S3, Cloudflare R2, Cloudinary). Only `storage.js`
  would need to change; nothing else in the app knows where the bytes are.

Before going live: set `ADMIN_PASSWORD_HASH` and drop `ADMIN_PASSWORD`, set a
fresh `JWT_SECRET`, set `CORS_ORIGIN` to the storefront's real origin, set
`PUBLIC_BASE_URL` to the API's own origin, and change the Atlas password — the
one in `.env` has been shared in plaintext.

## If it will not start

`querySrv EBADRESP` at boot means the network's DNS resolver mangles the SRV
record that a `mongodb+srv://` URI depends on. It is not an Atlas fault and not
a credentials problem. Set:

```
DNS_SERVERS=1.1.1.1,8.8.8.8
```

which is already set in the local `.env`, since this machine's resolver does
exactly that.
