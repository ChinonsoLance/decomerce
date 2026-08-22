# DECOMERCE

Interior decoration and bedding storefront — mattresses, bedsheets, duvets,
pillows, curtains, rugs, throws and lighting.

Static React site: no backend, no admin, no database. The whole catalogue is
`src/data.js`; the cart lives in `localStorage` and checks out over WhatsApp.

## Run it

```bash
npm install
npm run dev
```

Build for production with `npm run build`. `vercel.json` rewrites every path to
`index.html` so the client-side routes survive a hard refresh.

## Where things live

| Path | What it is |
| --- | --- |
| `src/data.js` | Products, prices, collections, masthead, lookbook, testimonials. Edit here to change the shop. |
| `src/index.css` | Design tokens (amber on warm near-black), the arch, surfaces, motion. |
| `src/App.jsx` | Routing, navbar, cart/saved drawer, toasts. |
| `src/Home.jsx` | Masthead, marquee, bento collections, arrivals rail, lookbook, promise, testimonials. |
| `src/Products.jsx` | The shop: sidebar filters, price bands, sort, density toggle. |
| `src/components/QuickView.jsx` | The product sheet that opens over the grid. |
| `src/components/Section.jsx` | The editorial section header — index, rule, label, title. |
| `src/hooks/useScroll.js` | One rAF-throttled scroll loop shared by every parallax and reveal. |
| `src/components/` | Backdrop, motion primitives, product card, footer. |

## The design language

- **The arch** is the site's one shape. Photographs are masked into it
  (`.arch`, `.arch-sm`, `.arch-flat`); nothing else is allowed to be round —
  buttons and panels sit at a 2–3px radius.
- **Amber is the only accent.** There is no second hue anywhere in the system,
  and no light surfaces: contrast comes from `.panel-ember`, a dark surface
  pushed toward the accent.
- **Structure is hairlines**, not cards — plus a visible column grid painted by
  the backdrop, matching the layout's own columns.
- **Headlines are lowercase Playfair**, with a single italic amber word per
  headline (`<SplitHeading accent="…">`).
- **The room is lit by one lamp** that follows the pointer, instead of an
  animated particle field.

## Things worth knowing

- **Prices** are integers in naira in `data.js`; `formatPrice` is the only
  place currency is rendered.
- **Collections deep-link**: `/products?category=Mattresses` filters the shop,
  which is what the homepage cards and footer links use.
- **Photography** is served from the Unsplash CDN via the `img()` helper in
  `data.js`. Swap an id there to change a photo; cards fall back to a
  placeholder if one ever 404s.
- **Performance tiers**: `main.jsx` adds `perf-lite` to `<html>` on small
  screens and low-power devices, which drops the grain, beams and dust field.
