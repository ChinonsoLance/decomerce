# DECOMERCE

Interior decoration and bedding storefront — mattresses, bedsheets, duvets,
pillows, curtains, rugs, throws and lighting.

React storefront, still served entirely from `src/data.js`. There is **no cart
and no pricing** — the site is a browse-and-enquire storefront, and every route
out of it ends in WhatsApp.

`server/` adds an admin API on top: an administrator signs in at `/admin`,
uploads a product name and a photo, and the catalogue changes without a code
edit. It returns the same shape `src/data.js` exports, so the front end can move
over one component at a time — or not at all. See
[server/README.md](server/README.md).

Storefront, API and admin console share one domain in production: Vercel serves
the React build, `api/[[...path]].js` runs the same Express app as a serverless
function, and photos go to Cloudinary because Vercel has no persistent disk.

## Run it

```bash
npm install
npm run dev
```

Build for production with `npm run build`. `vercel.json` rewrites every path to
`index.html` so the client-side routes survive a hard refresh.

The backend runs separately:

```bash
cd server && npm install && npm run seed && npm start
```

## Where things live

| Path | What it is |
| --- | --- |
| `src/data.js` | Products, collections, hero slides, lookbook, testimonials. Edit here to change the shop. |
| `src/index.css` | Design tokens (marigold on warm paper), the arch, surfaces, motion. |
| `src/App.jsx` | Routing, navbar with search, shortlist drawer, toasts. |
| `src/Home.jsx` | Hero banner, service strip, category rail, bestsellers, collections, arrivals, buying guide, testimonials. |
| `src/Products.jsx` | The shop: chips, sidebar filters, sort, density toggle. |
| `src/components/QuickView.jsx` | The product sheet that opens over the grid. |
| `src/components/Section.jsx` | The editorial section header — index, rule, label, title. |
| `src/hooks/useScroll.js` | One rAF-throttled scroll loop shared by every parallax and reveal. |
| `src/components/` | Backdrop, motion primitives, product card, footer. |
| `server/` | The admin API — products, image uploads, admin auth. |
| `public/admin.html` | The admin console. One file, no build step. |
| `api/[[...path]].js` | Vercel's entry point into the API. |

## The design language

- **Light, warm paper.** The ground is `--color-cloud`, never clinical white,
  and never neutral grey. Contrast comes from `.panel-ink` — a dark block used
  once or twice a page — rather than from a dark base.
- **Marigold is the only accent.** There is no second hue in the system.
- **One typeface.** Montserrat carries every level of hierarchy through weight
  and letterspacing; there is no serif and no mono.
- **The arch** is the site's one shape. Photographs are masked into it
  (`.arch`, `.arch-sm`, `.arch-flat`). Everything else is a soft card.
- **Structure is paper cards that lift**, plus hairlines and a visible column
  grid painted by the backdrop, matching the layout's own columns.
- **Headlines are lowercase**, with a single italic marigold word per headline
  (`<SplitHeading accent="…">`).
- **The room is lit by one warm glow** that follows the pointer.

## Things worth knowing

- **No prices anywhere.** `data.js` holds no `price` field and there is no
  currency formatter. Product enquiries go to WhatsApp with the product name
  and spec prefilled.
- **The shortlist replaces the cart.** Hearts on cards save to `localStorage`
  under `decomerce.saved`; the entry point is a pill that only appears once
  something is saved, and it sends the whole list as one WhatsApp message.
- **Component CSS lives in `@layer components`** so Tailwind utilities applied
  alongside `.display`, `.card` and friends still win the cascade. Moving those
  rules out of the layer silently breaks every `text-cloud` on a dark panel.
- **Collections and search deep-link**: `/products?category=Mattresses` and
  `/products?q=linen` both drive the shop, which is what the homepage tiles,
  the footer links and the navbar search use.
- **Photography** is served from the Unsplash CDN via the `img()` helper in
  `data.js`. Swap an id there to change a photo; cards fall back to a
  placeholder if one ever 404s.
- **Performance tiers**: `main.jsx` adds `perf-lite` to `<html>` on small
  screens and low-power devices, which drops the grain, the column grid and
  the card zoom.
