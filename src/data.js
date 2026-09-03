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
  // ── Mattress ──────────────────────────────────────────────────────────

  {
    id: 1,
    name: "Aurelia Pocket-Spring Mattress",
    category: "Mattress",
    spec: "6ft × 6ft · Medium-firm · 12in",
    badge: "Bestseller",
    img: img("1505693416388-ac5ce068fe85"),
  },
  {
    id: 2,
    name: "Solene Memory Foam Mattress",
    category: "Mattress",
    spec: "6ft × 6ft · Soft · 10in",
    img: img("1631049307264-da0ec9d70304"),
  },
  {
    id: 3,
    name: "Nocturne Hybrid Mattress",
    category: "Mattress",
    spec: "4.5ft × 6ft · Firm · 14in",
    img: img("1617325247661-675ab4b64ae2"),
  },
  {
    id: 4,
    name: "Meridian Orthopaedic Mattress",
    category: "Mattress",
    spec: "4ft × 6ft · Extra-firm · 8in",
    img: img("1629949009765-40fc74c9ec21"),
  },
  {
    id: 5,
    name: "Calla Latex Comfort Mattress",
    category: "Mattress",
    spec: "3ft × 6ft · Medium · 10in",
    badge: "New",
    img: img("1571508601891-ca5e7a713859"),
  },

  // ── Bedsheet & Duvet ──────────────────────────────────────────────────

  {
    id: 6,
    name: "Marrakesh Egyptian Cotton Set",
    category: "Bedsheet & Duvet",
    spec: "400 thread count · 6pc set",
    badge: "Bestseller",
    img: img("1522771739844-6a9f6d5f14af"),
  },
  {
    id: 7,
    name: "Linen Stonewash Sheet Set",
    category: "Bedsheet & Duvet",
    spec: "Pure flax linen · 4pc set",
    img: img("1584100936595-c0654b55a2e2"),
  },
  {
    id: 8,
    name: "Sahara Percale Fitted Sheet",
    category: "Bedsheet & Duvet",
    spec: "200 thread count · fitted",
    img: img("1631049035182-249067d7618e"),
  },
  {
    id: 9,
    name: "Ember Sateen Sheet Set",
    category: "Bedsheet & Duvet",
    spec: "600 thread count · 6pc set",
    img: img("1598300042247-d088f8ab3a91"),
  },
  {
    id: 10,
    name: "Kano Woven Cotton Set",
    category: "Bedsheet & Duvet",
    spec: "300 thread count · 4pc set",
    img: img("1611892440504-42a792e24d32"),
  },

  // ── Bedsheet & Duvet (duvets) ─────────────────────────────────────────

  {
    id: 11,
    name: "Cirrus Goose Down Duvet",
    category: "Bedsheet & Duvet",
    spec: "King · 13.5 tog · all-season",
    badge: "New",
    img: img("1615874959474-d609969a20ed"),
  },
  {
    id: 12,
    name: "Alpine Microfibre Duvet",
    category: "Bedsheet & Duvet",
    spec: "Queen · 10.5 tog · hypoallergenic",
    img: img("1584622650111-993a426fbf0a"),
  },
  {
    id: 13,
    name: "Harmattan Lightweight Duvet",
    category: "Bedsheet & Duvet",
    spec: "Double · 4.5 tog · breathable",
    img: img("1567016432779-094069958ea5"),
  },
  {
    id: 14,
    name: "Velour Quilted Comforter",
    category: "Bedsheet & Duvet",
    spec: "King · box-stitched · velvet face",
    img: img("1615529182904-14819c35db37"),
  },
  {
    id: 15,
    name: "Ivory Duvet Cover Set",
    category: "Bedsheet & Duvet",
    spec: "Queen · cotton sateen · 3pc",
    img: img("1493663284031-b7e3aefcae8e"),
  },

  // ── Pillow / Throw pillow ─────────────────────────────────────────────

  {
    id: 16,
    name: "Cloudform Memory Pillow",
    category: "Pillow",
    spec: "Contoured · gel-infused",
    badge: "Bestseller",
    img: img("1521783988139-89397d761dce"),
  },
  {
    id: 17,
    name: "Down-Alternative Sleep Pillow",
    category: "Pillow",
    spec: "Standard · medium loft · pair",
    img: img("1592078615290-033ee584e267"),
  },
  {
    id: 18,
    name: "Bolster Lumbar Cushion",
    category: "Throw pillow",
    spec: '18in × 8in · linen cover',
    img: img("1616046229478-9901c5536a45"),
  },
  {
    id: 19,
    name: "Terracotta Velvet Cushion",
    category: "Throw pillow",
    spec: '20in × 20in · feather insert',
    badge: "New",
    img: img("1555041469-a586c61ea9bc"),
  },
  {
    id: 20,
    name: "Adire Print Scatter Cushion",
    category: "Throw pillow",
    spec: '16in × 16in · hand-dyed cotton',
    img: img("1586023492125-27b2c045efd7"),
  },

  // ── Curtains ──────────────────────────────────────────────────────────

  {
    id: 21,
    name: "Nocturne Blackout Curtains",
    category: "Curtains",
    spec: "90in drop · triple-weave · pair",
    badge: "Bestseller",
    img: img("1534349762230-e0cadf78f5da"),
  },
  {
    id: 22,
    name: "Voile Sheer Drapes",
    category: "Curtains",
    spec: "108in drop · pinch pleat · pair",
    img: img("1449247709967-d4461a6a6103"),
  },
  {
    id: 23,
    name: "Amber Velvet Drapes",
    category: "Curtains",
    spec: "96in drop · rod pocket · pair",
    img: img("1513694203232-719a280e022f"),
  },
  {
    id: 24,
    name: "Linen Wave-Fold Curtains",
    category: "Curtains",
    spec: "84in drop · S-fold track · pair",
    img: img("1616486788371-62d930495c44"),
  },
  {
    id: 25,
    name: "Cafe Tier Curtain Set",
    category: "Curtains",
    spec: "36in drop · cotton twill · pair",
    img: img("1503602642458-232111445657"),
  },

  // ── Rugs ──────────────────────────────────────────────────────────────

  {
    id: 26,
    name: "Atlas Hand-Knotted Rug",
    category: "Rugs",
    spec: "8ft × 10ft · wool pile",
    badge: "New",
    img: img("1583847268964-b28dc8f51f92"),
  },
  {
    id: 27,
    name: "Berber Diamond Runner",
    category: "Rugs",
    spec: "2.5ft × 8ft · flatweave",
    img: img("1594026112284-02bb6f3352fe"),
  },
  {
    id: 28,
    name: "Ochre Shag Area Rug",
    category: "Rugs",
    spec: "6ft × 9ft · high pile",
    img: img("1560185007-cde436f6a4d0"),
  },
  {
    id: 29,
    name: "Jute Braided Round Rug",
    category: "Rugs",
    spec: "6ft diameter · natural fibre",
    img: img("1518005020951-eccb494ad742"),
  },
  {
    id: 30,
    name: "Wall-to-Wall Carpet Tile",
    category: "Rugs",
    spec: "50cm × 50cm · per box of 20",
    img: img("1524758631624-e2822e304c36"),
  },

  // ── Towel ─────────────────────────────────────────────────────────────

  {
    id: 31,
    name: "Cascade Egyptian Cotton Towel Set",
    category: "Towel",
    spec: "700gsm · 6pc set",
    badge: "Bestseller",
    img: img("1558505780-1e584fab3ede"),
  },
  {
    id: 32,
    name: "Zero-Twist Bath Sheet",
    category: "Towel",
    spec: "90cm × 150cm · 600gsm",
    img: img("1616663717839-2fea42e1a1f6"),
  },
  {
    id: 33,
    name: "Waffle Weave Hammam Towel",
    category: "Towel",
    spec: "100cm × 180cm · quick-dry",
    img: img("1574421233376-06f2ccf017f7"),
  },
  {
    id: 34,
    name: "Ribbed Hand Towel Pair",
    category: "Towel",
    spec: "50cm × 90cm · 550gsm",
    img: img("1620000190821-abd8f262b86f"),
  },
  {
    id: 35,
    name: "Bamboo Blend Bath Towel",
    category: "Towel",
    spec: "70cm × 140cm · quick-dry",
    badge: "New",
    img: img("1471880504582-cf7e63045303"),
  },

  // ── Bed topper ────────────────────────────────────────────────────────

  {
    id: 36,
    name: "Cumulus Memory Foam Topper",
    category: "Bed topper",
    spec: "6ft × 6ft · 3in profile",
    badge: "New",
    img: img("1759176170879-6bd7073ab4f4"),
  },
  {
    id: 37,
    name: "Quilted Microfibre Topper",
    category: "Bed topper",
    spec: "4.5ft × 6ft · elasticated skirt",
    img: img("1581448361195-86be336c9ab8"),
  },
  {
    id: 38,
    name: "Down-Alternative Featherbed Topper",
    category: "Bed topper",
    spec: "6ft × 6ft · 2in loft",
    img: img("1779958128629-aaf6e187a505"),
  },
  {
    id: 39,
    name: "Cooling Gel Bed Topper",
    category: "Bed topper",
    spec: "4ft × 6ft · perforated gel layer",
    badge: "Bestseller",
    img: img("1599163666602-ef737d996c16"),
  },
];

export const CATEGORIES = [
  "All",
  "Mattress",
  "Bedsheet & Duvet",
  "Pillow",
  "Curtains",
  "Rugs",
  "Towel",
  "Throw pillow",
  "Bed topper",
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
    sub: "Pocket-spring, memory foam and hybrid mattresses in every Nigerian bed size — on the floor in Magodo, delivered in 48 hours.",
    cta: "Shop mattresses",
    link: "Mattress",
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
    link: "Curtains",
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
    link: "Rugs",
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
    link: "/products?category=Mattress",
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
    link: "Mattress",
    img: wide("1522771739844-6a9f6d5f14af"),
  },
  {
    index: "02",
    label: "The windows",
    title: "then kill\nthe glare.",
    copy: "A blackout lining changes a room more than any paint colour. We measure the drop on site, allow for stack-back, and hang it ourselves — because a curtain two inches short is a curtain you notice every morning.",
    link: "Curtains",
    img: wide("1534349762230-e0cadf78f5da"),
  },
  {
    index: "03",
    label: "The floor & the light",
    title: "finish with\nwarmth.",
    copy: "A rug large enough to sit under the front legs of the furniture, a throw at the foot of the bed, and one low lamp instead of a ceiling light. This is the last ten percent that separates furnished from finished.",
    link: "Rugs",
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
    name: "Mattress",
    index: "01",
    blurb:
      "Pocket-spring, memory foam and hybrid builds in every Nigerian bed size, from 3ft singles to 6ft kings.",
  },
  {
    name: "Bedsheet & Duvet",
    index: "02",
    blurb:
      "Egyptian cotton, stonewashed linen and cool percale, with tog ratings picked for the harmattan and the humidity.",
  },
  {
    name: "Pillow",
    index: "03",
    blurb:
      "Sleep pillows engineered for side and back sleepers — contoured memory foam through to soft down-alternative loft.",
  },
  {
    name: "Curtains",
    index: "04",
    blurb:
      "Blackout, sheer and velvet panels in standard drops — or made to your window, measured on site.",
  },
  {
    name: "Rugs",
    index: "05",
    blurb:
      "Hand-knotted wool, flatweave runners and carpet tiling, sized to anchor a room rather than float in it.",
  },
  {
    name: "Towel",
    index: "06",
    blurb:
      "Egyptian cotton, zero-twist and waffle weave in weights from 550 to 700gsm — the ones that still dry you in year three.",
  },
  {
    name: "Throw pillow",
    index: "07",
    blurb:
      "Scatter cushions, bolsters and hand-dyed adire covers to finish a sofa or the head of a bed.",
  },
  {
    name: "Bed topper",
    index: "08",
    blurb:
      "Memory foam, quilted microfibre and cooling gel — the cheapest way to change how a mattress feels.",
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
