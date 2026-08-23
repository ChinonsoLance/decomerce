// data.js — the whole shop lives here. No backend, no admin: edit this file
// and the storefront changes.
//
// Photography is served straight from the Unsplash CDN. `img()` builds the
// transform query once so a swap is a one-word edit, and every card falls back
// to a placeholder if a photo ever disappears (see components/ProductCard).

const img = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${w}&q=80`;

const wide = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${Math.round(
    w * 0.625
  )}&q=80`;

export const PRODUCTS = [
  // ── Mattresses ───────────────────────────────────────────────────────────

  {
    id: 1,
    name: "Aurelia Pocket-Spring Mattress",
    category: "Mattresses",
    spec: "6ft × 6ft · Medium-firm · 12in",
    badge: "Bestseller",
    img: img("1505693416388-ac5ce068fe85"),
  },
  {
    id: 2,
    name: "Solene Memory Foam Mattress",
    category: "Mattresses",
    spec: "6ft × 6ft · Soft · 10in",
    img: img("1631049307264-da0ec9d70304"),
  },
  {
    id: 3,
    name: "Nocturne Hybrid Mattress",
    category: "Mattresses",
    spec: "4.5ft × 6ft · Firm · 14in",
    img: img("1617325247661-675ab4b64ae2"),
  },
  {
    id: 4,
    name: "Meridian Orthopaedic Mattress",
    category: "Mattresses",
    spec: "4ft × 6ft · Extra-firm · 8in",
    img: img("1629949009765-40fc74c9ec21"),
  },
  {
    id: 5,
    name: "Calla Latex Comfort Mattress",
    category: "Mattresses",
    spec: "3ft × 6ft · Medium · 10in",
    badge: "New",
    img: img("1571508601891-ca5e7a713859"),
  },

  // ── Bedsheets ────────────────────────────────────────────────────────────

  {
    id: 6,
    name: "Marrakesh Egyptian Cotton Set",
    category: "Bedsheets",
    spec: "400 thread count · 6pc set",
    badge: "Bestseller",
    img: img("1522771739844-6a9f6d5f14af"),
  },
  {
    id: 7,
    name: "Linen Stonewash Sheet Set",
    category: "Bedsheets",
    spec: "Pure flax linen · 4pc set",
    img: img("1584100936595-c0654b55a2e2"),
  },
  {
    id: 8,
    name: "Sahara Percale Fitted Sheet",
    category: "Bedsheets",
    spec: "200 thread count · fitted",
    img: img("1631049035182-249067d7618e"),
  },
  {
    id: 9,
    name: "Ember Sateen Sheet Set",
    category: "Bedsheets",
    spec: "600 thread count · 6pc set",
    img: img("1598300042247-d088f8ab3a91"),
  },
  {
    id: 10,
    name: "Kano Woven Cotton Set",
    category: "Bedsheets",
    spec: "300 thread count · 4pc set",
    img: img("1611892440504-42a792e24d32"),
  },

  // ── Duvets & Comforters ──────────────────────────────────────────────────

  {
    id: 11,
    name: "Cirrus Goose Down Duvet",
    category: "Duvets & Comforters",
    spec: "King · 13.5 tog · all-season",
    badge: "New",
    img: img("1615874959474-d609969a20ed"),
  },
  {
    id: 12,
    name: "Alpine Microfibre Duvet",
    category: "Duvets & Comforters",
    spec: "Queen · 10.5 tog · hypoallergenic",
    img: img("1584622650111-993a426fbf0a"),
  },
  {
    id: 13,
    name: "Harmattan Lightweight Duvet",
    category: "Duvets & Comforters",
    spec: "Double · 4.5 tog · breathable",
    img: img("1567016432779-094069958ea5"),
  },
  {
    id: 14,
    name: "Velour Quilted Comforter",
    category: "Duvets & Comforters",
    spec: "King · box-stitched · velvet face",
    img: img("1615529182904-14819c35db37"),
  },
  {
    id: 15,
    name: "Ivory Duvet Cover Set",
    category: "Duvets & Comforters",
    spec: "Queen · cotton sateen · 3pc",
    img: img("1493663284031-b7e3aefcae8e"),
  },

  // ── Pillows & Cushions ───────────────────────────────────────────────────

  {
    id: 16,
    name: "Cloudform Memory Pillow",
    category: "Pillows & Cushions",
    spec: "Contoured · gel-infused",
    badge: "Bestseller",
    img: img("1521783988139-89397d761dce"),
  },
  {
    id: 17,
    name: "Down-Alternative Sleep Pillow",
    category: "Pillows & Cushions",
    spec: "Standard · medium loft · pair",
    img: img("1592078615290-033ee584e267"),
  },
  {
    id: 18,
    name: "Bolster Lumbar Cushion",
    category: "Pillows & Cushions",
    spec: '18in × 8in · linen cover',
    img: img("1616046229478-9901c5536a45"),
  },
  {
    id: 19,
    name: "Terracotta Velvet Cushion",
    category: "Pillows & Cushions",
    spec: '20in × 20in · feather insert',
    badge: "New",
    img: img("1555041469-a586c61ea9bc"),
  },
  {
    id: 20,
    name: "Adire Print Scatter Cushion",
    category: "Pillows & Cushions",
    spec: '16in × 16in · hand-dyed cotton',
    img: img("1586023492125-27b2c045efd7"),
  },

  // ── Curtains & Drapes ────────────────────────────────────────────────────

  {
    id: 21,
    name: "Nocturne Blackout Curtains",
    category: "Curtains & Drapes",
    spec: "90in drop · triple-weave · pair",
    badge: "Bestseller",
    img: img("1534349762230-e0cadf78f5da"),
  },
  {
    id: 22,
    name: "Voile Sheer Drapes",
    category: "Curtains & Drapes",
    spec: "108in drop · pinch pleat · pair",
    img: img("1449247709967-d4461a6a6103"),
  },
  {
    id: 23,
    name: "Amber Velvet Drapes",
    category: "Curtains & Drapes",
    spec: "96in drop · rod pocket · pair",
    img: img("1513694203232-719a280e022f"),
  },
  {
    id: 24,
    name: "Linen Wave-Fold Curtains",
    category: "Curtains & Drapes",
    spec: "84in drop · S-fold track · pair",
    img: img("1616486788371-62d930495c44"),
  },
  {
    id: 25,
    name: "Cafe Tier Curtain Set",
    category: "Curtains & Drapes",
    spec: "36in drop · cotton twill · pair",
    img: img("1503602642458-232111445657"),
  },

  // ── Rugs & Carpets ───────────────────────────────────────────────────────

  {
    id: 26,
    name: "Atlas Hand-Knotted Rug",
    category: "Rugs & Carpets",
    spec: "8ft × 10ft · wool pile",
    badge: "New",
    img: img("1583847268964-b28dc8f51f92"),
  },
  {
    id: 27,
    name: "Berber Diamond Runner",
    category: "Rugs & Carpets",
    spec: "2.5ft × 8ft · flatweave",
    img: img("1594026112284-02bb6f3352fe"),
  },
  {
    id: 28,
    name: "Ochre Shag Area Rug",
    category: "Rugs & Carpets",
    spec: "6ft × 9ft · high pile",
    img: img("1560185007-cde436f6a4d0"),
  },
  {
    id: 29,
    name: "Jute Braided Round Rug",
    category: "Rugs & Carpets",
    spec: "6ft diameter · natural fibre",
    img: img("1518005020951-eccb494ad742"),
  },
  {
    id: 30,
    name: "Wall-to-Wall Carpet Tile",
    category: "Rugs & Carpets",
    spec: "50cm × 50cm · per box of 20",
    img: img("1524758631624-e2822e304c36"),
  },

  // ── Throws & Blankets ────────────────────────────────────────────────────

  {
    id: 31,
    name: "Cashmere-Blend Throw",
    category: "Throws & Blankets",
    spec: "130cm × 180cm · fringed",
    badge: "Bestseller",
    img: img("1616593969747-4797dc75033e"),
  },
  {
    id: 32,
    name: "Chunky Knit Wool Blanket",
    category: "Throws & Blankets",
    spec: "150cm × 200cm · merino",
    img: img("1519961655809-34fa156820ff"),
  },
  {
    id: 33,
    name: "Waffle Cotton Bed Throw",
    category: "Throws & Blankets",
    spec: "180cm × 240cm · king",
    img: img("1556228453-efd6c1ff04f6"),
  },
  {
    id: 34,
    name: "Weighted Calm Blanket",
    category: "Throws & Blankets",
    spec: "7kg · glass bead fill",
    img: img("1533779283484-8ad4940aa3a8"),
  },
  {
    id: 35,
    name: "Mudcloth Woven Throw",
    category: "Throws & Blankets",
    spec: "120cm × 160cm · handloomed",
    img: img("1558211583-d26f610c1eb1"),
  },

  // ── Wall Decor & Lighting ────────────────────────────────────────────────

  {
    id: 36,
    name: "Arched Brass Wall Mirror",
    category: "Wall Decor & Lighting",
    spec: "80cm × 140cm · antique brass",
    badge: "New",
    img: img("1618220179428-22790b461013"),
  },
  {
    id: 37,
    name: "Halo Ribbed Table Lamp",
    category: "Wall Decor & Lighting",
    spec: "48cm · linen shade · E27",
    img: img("1507473885765-e6ed057f782c"),
  },
  {
    id: 38,
    name: "Ember Rattan Floor Lamp",
    category: "Wall Decor & Lighting",
    spec: "160cm · woven cane shade",
    img: img("1550581190-9c1c48d21d6c"),
  },
  {
    id: 39,
    name: "Gallery Frame Set",
    category: "Wall Decor & Lighting",
    spec: "Set of 6 · oak · mixed sizes",
    img: img("1616486029423-aaa4789e8c9a"),
  },
  {
    id: 40,
    name: "Sculpted Ceramic Vase",
    category: "Wall Decor & Lighting",
    spec: "34cm · matte stoneware",
    img: img("1612196808214-b8e1d6145a8c"),
  },
];

export const CATEGORIES = [
  "All",
  "Mattresses",
  "Bedsheets",
  "Duvets & Comforters",
  "Pillows & Cushions",
  "Curtains & Drapes",
  "Rugs & Carpets",
  "Throws & Blankets",
  "Wall Decor & Lighting",
];

/**
 * The hero banner. A rotating promotional slide, the way a storefront leads —
 * each slide points straight at a collection rather than at a brochure page.
 */
export const HERO_SLIDES = [
  {
    id: "sleep",
    label: "Bedding event",
    headline: "sleep on\nsomething better.",
    accent: "better.",
    sub: "Pocket-spring, memory foam and hybrid mattresses in every Nigerian bed size — on the floor in Lekki, delivered in 48 hours.",
    cta: "Shop mattresses",
    link: "Mattresses",
    img: img("1616594039964-ae9021a400a0", 1200),
    featureId: 1,
  },
  {
    id: "windows",
    label: "Made to measure",
    headline: "drapes cut\nto your window.",
    accent: "cut",
    sub: "Blackout, sheer and velvet panels in standard drops — or measured on site and hung by our own team, at no extra charge.",
    cta: "Shop curtains",
    link: "Curtains & Drapes",
    img: img("1534349762230-e0cadf78f5da", 1200),
    featureId: 21,
  },
  {
    id: "floor",
    label: "New season",
    headline: "the floor is\nhalf the room.",
    accent: "half",
    sub: "Hand-knotted wool, flatweave runners and carpet tiling, sized to anchor a room instead of floating in the middle of it.",
    cta: "Shop rugs",
    link: "Rugs & Carpets",
    img: img("1583847268964-b28dc8f51f92", 1200),
    featureId: 26,
  },
];

/** The three promo cards stacked beside the hero banner. */
export const HERO_PROMOS = [
  {
    title: "Free Lagos delivery",
    body: "Carried in, fitted, packaging taken away.",
    link: "/products",
    cta: "Shop now",
  },
  {
    title: "100-night trial",
    body: "Sleep on it. Swap the firmness if it is wrong.",
    link: "/products?category=Mattresses",
    cta: "Shop mattresses",
  },
  {
    title: "Two-year guarantee",
    body: "Against sag, seam failure and hardware faults.",
    link: "/about",
    cta: "How it works",
  },
];

/** The lookbook: three rooms, told in order. */
export const ROOMS = [
  {
    index: "01",
    label: "The bedroom",
    title: "start with\nthe mattress.",
    copy: "Everything else in a bedroom is decoration. Get the support right — pocket spring for weight, memory foam for pressure, hybrid when two people disagree — and the duvet, the sheets and the lamp all become easy decisions.",
    link: "Mattresses",
    img: wide("1522771739844-6a9f6d5f14af"),
  },
  {
    index: "02",
    label: "The windows",
    title: "then kill\nthe glare.",
    copy: "A blackout lining changes a room more than any paint colour. We measure the drop on site, allow for stack-back, and hang it ourselves — because a curtain two inches short is a curtain you notice every morning.",
    link: "Curtains & Drapes",
    img: wide("1534349762230-e0cadf78f5da"),
  },
  {
    index: "03",
    label: "The floor & the light",
    title: "finish with\nwarmth.",
    copy: "A rug large enough to sit under the front legs of the furniture, a throw at the foot of the bed, and one low lamp instead of a ceiling light. This is the last ten percent that separates furnished from finished.",
    link: "Rugs & Carpets",
    img: wide("1618221195710-dd6b41faaea6"),
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "They measured the windows on a Tuesday and hung the drapes on the Friday. Nobody else quoted me without asking for a deposit first.",
    name: "Adaeze O.",
    place: "Ikoyi",
  },
  {
    quote:
      "I slept on the wrong mattress for two nights, called them, and they swapped it for the firmer one. No argument, no restocking fee.",
    name: "Tunde A.",
    place: "Yaba",
  },
  {
    quote:
      "The rug was the thing I nearly skipped. It is the thing every visitor comments on. They were right about the size.",
    name: "Chiamaka N.",
    place: "Lekki Phase 1",
  },
];

// Category storytelling used by the homepage collection cards.
export const CATEGORY_META = [
  {
    name: "Mattresses",
    index: "01",
    blurb:
      "Pocket-spring, memory foam and hybrid builds in every Nigerian bed size, from 3ft singles to 6ft kings.",
  },
  {
    name: "Bedsheets",
    index: "02",
    blurb:
      "Egyptian cotton, stonewashed linen and cool percale — sets that survive a hundred washes and stay square.",
  },
  {
    name: "Duvets & Comforters",
    index: "03",
    blurb:
      "Tog ratings for the harmattan and for the humidity, in down, microfibre and quilted velvet.",
  },
  {
    name: "Pillows & Cushions",
    index: "04",
    blurb:
      "Sleep pillows engineered for side and back sleepers, plus scatter cushions to finish a sofa.",
  },
  {
    name: "Curtains & Drapes",
    index: "05",
    blurb:
      "Blackout, sheer and velvet panels in standard drops — or made to your window, measured on site.",
  },
  {
    name: "Rugs & Carpets",
    index: "06",
    blurb:
      "Hand-knotted wool, flatweave runners and carpet tiling, sized to anchor a room rather than float in it.",
  },
  {
    name: "Throws & Blankets",
    index: "07",
    blurb:
      "Cashmere blends, chunky merino knits and handloomed mudcloth for the foot of the bed.",
  },
  {
    name: "Wall Decor & Lighting",
    index: "08",
    blurb:
      "Mirrors, frames, lamps and ceramics — the warm, low light that makes everything else read better.",
  },
];

export const STATS = [
  { value: 40, suffix: "+", label: "Pieces in stock" },
  { value: 8, suffix: "", label: "Collections" },
  { value: 4.9, suffix: "/5", label: "Customer rating", decimals: 1 },
  { value: 48, suffix: "h", label: "Lagos delivery" },
];

export const MARQUEE_TERMS = [
  "Free Lagos Delivery",
  "Made-to-Measure Curtains",
  "100-Night Mattress Trial",
  "In-Home Styling Visits",
  "Nationwide Dispatch",
  "Two-Year Guarantee",
];
