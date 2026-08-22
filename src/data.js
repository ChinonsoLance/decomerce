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

/** Prices are held as plain integers in naira — no floats, no rounding drift. */
export const CURRENCY = "₦";

export const formatPrice = (value) =>
  `${CURRENCY}${value.toLocaleString("en-NG")}`;

export const PRODUCTS = [
  // ── Mattresses ───────────────────────────────────────────────────────────

  {
    id: 1,
    name: "Aurelia Pocket-Spring Mattress",
    category: "Mattresses",
    spec: "6ft × 6ft · Medium-firm · 12in",
    price: 540000,
    badge: "Bestseller",
    img: img("1505693416388-ac5ce068fe85"),
  },
  {
    id: 2,
    name: "Solene Memory Foam Mattress",
    category: "Mattresses",
    spec: "6ft × 6ft · Soft · 10in",
    price: 425000,
    img: img("1631049307264-da0ec9d70304"),
  },
  {
    id: 3,
    name: "Nocturne Hybrid Mattress",
    category: "Mattresses",
    spec: "4.5ft × 6ft · Firm · 14in",
    price: 610000,
    img: img("1617325247661-675ab4b64ae2"),
  },
  {
    id: 4,
    name: "Meridian Orthopaedic Mattress",
    category: "Mattresses",
    spec: "4ft × 6ft · Extra-firm · 8in",
    price: 268000,
    img: img("1629949009765-40fc74c9ec21"),
  },
  {
    id: 5,
    name: "Calla Latex Comfort Mattress",
    category: "Mattresses",
    spec: "3ft × 6ft · Medium · 10in",
    price: 195000,
    badge: "New",
    img: img("1571508601891-ca5e7a713859"),
  },

  // ── Bedsheets ────────────────────────────────────────────────────────────

  {
    id: 6,
    name: "Marrakesh Egyptian Cotton Set",
    category: "Bedsheets",
    spec: "400 thread count · 6pc set",
    price: 52000,
    badge: "Bestseller",
    img: img("1522771739844-6a9f6d5f14af"),
  },
  {
    id: 7,
    name: "Linen Stonewash Sheet Set",
    category: "Bedsheets",
    spec: "Pure flax linen · 4pc set",
    price: 68000,
    img: img("1584100936595-c0654b55a2e2"),
  },
  {
    id: 8,
    name: "Sahara Percale Fitted Sheet",
    category: "Bedsheets",
    spec: "200 thread count · fitted",
    price: 24500,
    img: img("1631049035182-249067d7618e"),
  },
  {
    id: 9,
    name: "Ember Sateen Sheet Set",
    category: "Bedsheets",
    spec: "600 thread count · 6pc set",
    price: 74000,
    img: img("1598300042247-d088f8ab3a91"),
  },
  {
    id: 10,
    name: "Kano Woven Cotton Set",
    category: "Bedsheets",
    spec: "300 thread count · 4pc set",
    price: 38000,
    img: img("1611892440504-42a792e24d32"),
  },

  // ── Duvets & Comforters ──────────────────────────────────────────────────

  {
    id: 11,
    name: "Cirrus Goose Down Duvet",
    category: "Duvets & Comforters",
    spec: "King · 13.5 tog · all-season",
    price: 168000,
    badge: "New",
    img: img("1615874959474-d609969a20ed"),
  },
  {
    id: 12,
    name: "Alpine Microfibre Duvet",
    category: "Duvets & Comforters",
    spec: "Queen · 10.5 tog · hypoallergenic",
    price: 74000,
    img: img("1584622650111-993a426fbf0a"),
  },
  {
    id: 13,
    name: "Harmattan Lightweight Duvet",
    category: "Duvets & Comforters",
    spec: "Double · 4.5 tog · breathable",
    price: 52000,
    img: img("1567016432779-094069958ea5"),
  },
  {
    id: 14,
    name: "Velour Quilted Comforter",
    category: "Duvets & Comforters",
    spec: "King · box-stitched · velvet face",
    price: 128000,
    img: img("1615529182904-14819c35db37"),
  },
  {
    id: 15,
    name: "Ivory Duvet Cover Set",
    category: "Duvets & Comforters",
    spec: "Queen · cotton sateen · 3pc",
    price: 46000,
    img: img("1493663284031-b7e3aefcae8e"),
  },

  // ── Pillows & Cushions ───────────────────────────────────────────────────

  {
    id: 16,
    name: "Cloudform Memory Pillow",
    category: "Pillows & Cushions",
    spec: "Contoured · gel-infused",
    price: 34000,
    badge: "Bestseller",
    img: img("1521783988139-89397d761dce"),
  },
  {
    id: 17,
    name: "Down-Alternative Sleep Pillow",
    category: "Pillows & Cushions",
    spec: "Standard · medium loft · pair",
    price: 22000,
    img: img("1592078615290-033ee584e267"),
  },
  {
    id: 18,
    name: "Bolster Lumbar Cushion",
    category: "Pillows & Cushions",
    spec: '18in × 8in · linen cover',
    price: 16500,
    img: img("1616046229478-9901c5536a45"),
  },
  {
    id: 19,
    name: "Terracotta Velvet Cushion",
    category: "Pillows & Cushions",
    spec: '20in × 20in · feather insert',
    price: 19500,
    badge: "New",
    img: img("1555041469-a586c61ea9bc"),
  },
  {
    id: 20,
    name: "Adire Print Scatter Cushion",
    category: "Pillows & Cushions",
    spec: '16in × 16in · hand-dyed cotton',
    price: 14000,
    img: img("1586023492125-27b2c045efd7"),
  },

  // ── Curtains & Drapes ────────────────────────────────────────────────────

  {
    id: 21,
    name: "Nocturne Blackout Curtains",
    category: "Curtains & Drapes",
    spec: "90in drop · triple-weave · pair",
    price: 142000,
    badge: "Bestseller",
    img: img("1534349762230-e0cadf78f5da"),
  },
  {
    id: 22,
    name: "Voile Sheer Drapes",
    category: "Curtains & Drapes",
    spec: "108in drop · pinch pleat · pair",
    price: 68000,
    img: img("1449247709967-d4461a6a6103"),
  },
  {
    id: 23,
    name: "Amber Velvet Drapes",
    category: "Curtains & Drapes",
    spec: "96in drop · rod pocket · pair",
    price: 186000,
    img: img("1513694203232-719a280e022f"),
  },
  {
    id: 24,
    name: "Linen Wave-Fold Curtains",
    category: "Curtains & Drapes",
    spec: "84in drop · S-fold track · pair",
    price: 124000,
    img: img("1616486788371-62d930495c44"),
  },
  {
    id: 25,
    name: "Cafe Tier Curtain Set",
    category: "Curtains & Drapes",
    spec: "36in drop · cotton twill · pair",
    price: 42000,
    img: img("1503602642458-232111445657"),
  },

  // ── Rugs & Carpets ───────────────────────────────────────────────────────

  {
    id: 26,
    name: "Atlas Hand-Knotted Rug",
    category: "Rugs & Carpets",
    spec: "8ft × 10ft · wool pile",
    price: 486000,
    badge: "New",
    img: img("1583847268964-b28dc8f51f92"),
  },
  {
    id: 27,
    name: "Berber Diamond Runner",
    category: "Rugs & Carpets",
    spec: "2.5ft × 8ft · flatweave",
    price: 118000,
    img: img("1594026112284-02bb6f3352fe"),
  },
  {
    id: 28,
    name: "Ochre Shag Area Rug",
    category: "Rugs & Carpets",
    spec: "6ft × 9ft · high pile",
    price: 232000,
    img: img("1560185007-cde436f6a4d0"),
  },
  {
    id: 29,
    name: "Jute Braided Round Rug",
    category: "Rugs & Carpets",
    spec: "6ft diameter · natural fibre",
    price: 96000,
    img: img("1518005020951-eccb494ad742"),
  },
  {
    id: 30,
    name: "Wall-to-Wall Carpet Tile",
    category: "Rugs & Carpets",
    spec: "50cm × 50cm · per box of 20",
    price: 148000,
    img: img("1524758631624-e2822e304c36"),
  },

  // ── Throws & Blankets ────────────────────────────────────────────────────

  {
    id: 31,
    name: "Cashmere-Blend Throw",
    category: "Throws & Blankets",
    spec: "130cm × 180cm · fringed",
    price: 88000,
    badge: "Bestseller",
    img: img("1616593969747-4797dc75033e"),
  },
  {
    id: 32,
    name: "Chunky Knit Wool Blanket",
    category: "Throws & Blankets",
    spec: "150cm × 200cm · merino",
    price: 112000,
    img: img("1519961655809-34fa156820ff"),
  },
  {
    id: 33,
    name: "Waffle Cotton Bed Throw",
    category: "Throws & Blankets",
    spec: "180cm × 240cm · king",
    price: 54000,
    img: img("1556228453-efd6c1ff04f6"),
  },
  {
    id: 34,
    name: "Weighted Calm Blanket",
    category: "Throws & Blankets",
    spec: "7kg · glass bead fill",
    price: 96000,
    img: img("1533779283484-8ad4940aa3a8"),
  },
  {
    id: 35,
    name: "Mudcloth Woven Throw",
    category: "Throws & Blankets",
    spec: "120cm × 160cm · handloomed",
    price: 46000,
    img: img("1558211583-d26f610c1eb1"),
  },

  // ── Wall Decor & Lighting ────────────────────────────────────────────────

  {
    id: 36,
    name: "Arched Brass Wall Mirror",
    category: "Wall Decor & Lighting",
    spec: "80cm × 140cm · antique brass",
    price: 264000,
    badge: "New",
    img: img("1618220179428-22790b461013"),
  },
  {
    id: 37,
    name: "Halo Ribbed Table Lamp",
    category: "Wall Decor & Lighting",
    spec: "48cm · linen shade · E27",
    price: 78000,
    img: img("1507473885765-e6ed057f782c"),
  },
  {
    id: 38,
    name: "Ember Rattan Floor Lamp",
    category: "Wall Decor & Lighting",
    spec: "160cm · woven cane shade",
    price: 148000,
    img: img("1550581190-9c1c48d21d6c"),
  },
  {
    id: 39,
    name: "Gallery Frame Set",
    category: "Wall Decor & Lighting",
    spec: "Set of 6 · oak · mixed sizes",
    price: 62000,
    img: img("1616486029423-aaa4789e8c9a"),
  },
  {
    id: 40,
    name: "Sculpted Ceramic Vase",
    category: "Wall Decor & Lighting",
    spec: "34cm · matte stoneware",
    price: 34000,
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

/** The masthead. One statement, not a carousel. */
export const HERO = {
  label: "Interior & bedding — Lagos",
  headline: "rooms that\nhold you.",
  // The word set in italic amber inside the headline.
  accent: "hold",
  sub: "Mattresses, bedding, drapes and light, chosen for how a room feels at the end of a long day — not for how it photographs.",
  img: img("1616594039964-ae9021a400a0", 1100),
  // The piece that floats over the masthead image.
  featureId: 21,
};

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
