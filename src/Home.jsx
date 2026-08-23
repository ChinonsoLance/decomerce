import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Truck,
  ShieldCheck,
  Undo2,
  Headset,
  Star,
  ChevronRight,
} from "lucide-react";
import {
  PRODUCTS,
  HERO_SLIDES,
  HERO_PROMOS,
  ROOMS,
  TESTIMONIALS,
  CATEGORY_META,
  MARQUEE_TERMS,
} from "./data";
import ProductCard from "./components/ProductCard";
import { SectionHead } from "./components/Section";
import { Reveal, SplitHeading, Parallax } from "./components/Motion";

const shopLink = (category) =>
  `/products?category=${encodeURIComponent(category)}`;

/* ============================================================
   Hero — the storefront banner: category rail, rotating promo,
   and the three things a shopper wants reassurance about.
   ============================================================ */
function Hero() {
  const [index, setIndex] = useState(0);
  const slide = HERO_SLIDES[index];

  const go = useCallback(
    (next) => setIndex((i) => (i + next + HERO_SLIDES.length) % HERO_SLIDES.length),
    []
  );

  // Auto-advance, reset on every manual move so a click always buys a full
  // interval before the banner moves on its own again.
  useEffect(() => {
    const timer = setTimeout(() => go(1), 6500);
    return () => clearTimeout(timer);
  }, [index, go]);

  return (
    <section className="mx-auto max-w-[var(--shell)] px-5 pt-6 sm:px-8">
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Category rail — the shop's whole surface area, one click away. */}
        <nav className="hidden rounded-2xl border border-line bg-canvas p-2 shadow-[var(--shadow-rest)] xl:col-span-2 xl:block">
          <p className="label px-3 pb-2 pt-3">All collections</p>
          <ul>
            {CATEGORY_META.map((c) => (
              <li key={c.name}>
                <Link
                  to={shopLink(c.name)}
                  className="group flex items-center justify-between rounded-lg px-3 py-[9px] text-[12.5px] font-medium text-stone transition-colors hover:bg-brand-50 hover:text-brand-700"
                >
                  <span className="truncate">{c.name}</span>
                  <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* The banner */}
        <div className="relative overflow-hidden rounded-3xl bg-sand shadow-[var(--shadow-lift)] lg:col-span-8 xl:col-span-7">
          {HERO_SLIDES.map((s, i) => (
            <img
              key={s.id}
              src={s.img}
              alt=""
              aria-hidden={i !== index}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[900ms] ease-out ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
              loading={i === 0 ? "eager" : "lazy"}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-transparent" />

          {/* Bottom padding reserves the control strip's row: the copy is
              vertically centred while the dots and arrows are absolutely
              positioned, so without it a wrapped CTA runs underneath them. */}
          <div className="relative flex min-h-[460px] flex-col justify-center px-8 pb-24 pt-10 sm:min-h-[500px] sm:px-12 sm:pb-24 sm:pt-12 lg:min-h-[540px]">
            <div key={slide.id} className="scale-in max-w-lg">
              <span className="inline-flex rounded-full bg-brand-500 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                {slide.label}
              </span>

              <h1 className="display mt-6 whitespace-pre-line text-[clamp(2.3rem,5.2vw,3.9rem)] text-cloud">
                {slide.headline}
              </h1>

              <p className="mt-5 max-w-md text-[15px] leading-[1.8] text-cloud/70">
                {slide.sub}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to={shopLink(slide.link)} className="btn btn-primary">
                  {slide.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/products"
                  className="btn border border-white/25 bg-white/10 text-cloud backdrop-blur transition-colors hover:border-white/50 hover:bg-white/20"
                >
                  All {PRODUCTS.length} pieces
                </Link>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute inset-x-8 bottom-7 flex items-center justify-between sm:inset-x-12">
              <div className="flex gap-2">
                {HERO_SLIDES.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setIndex(i)}
                    aria-label={`Show slide ${i + 1}`}
                    aria-current={i === index}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === index
                        ? "w-8 bg-brand-500"
                        : "w-4 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>

              <div className="hidden gap-2 sm:flex">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous slide"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-cloud backdrop-blur transition-colors hover:bg-white/25"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next slide"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-cloud backdrop-blur transition-colors hover:bg-white/25"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Promo stack */}
        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1 xl:col-span-3">
          {HERO_PROMOS.map((promo) => (
            <Link
              key={promo.title}
              to={promo.link}
              className="group flex flex-col justify-between rounded-2xl border border-line bg-canvas p-5 shadow-[var(--shadow-rest)] transition-all duration-500 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[var(--shadow-lift)]"
            >
              <div>
                <p className="display-md text-[16px] group-hover:text-brand-600">
                  {promo.title}
                </p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-stone">
                  {promo.body}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600">
                {promo.cta}
                <ArrowRight className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Service strip — the shop's terms, stated once, near the top.
   ============================================================ */
const SERVICES = [
  { icon: Truck, title: "Free Lagos delivery", body: "Carried in and fitted" },
  { icon: Undo2, title: "100-night trial", body: "Swap the firmness free" },
  { icon: ShieldCheck, title: "Two-year guarantee", body: "In writing, every piece" },
  { icon: Headset, title: "Talk to a human", body: "Mon–Sat, 9am – 7pm" },
];

function ServiceStrip() {
  return (
    <section className="mx-auto max-w-[var(--shell)] px-5 pt-8 sm:px-8">
      <Reveal variant="up">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="flex items-center gap-4 bg-canvas px-5 py-5 transition-colors hover:bg-brand-50"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-50">
                <s.icon className="h-[18px] w-[18px] text-brand-600" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-ink">{s.title}</p>
                <p className="mt-0.5 truncate text-[12px] text-haze">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ============================================================
   Category rail — the fast lane into the shop, before any story.
   ============================================================ */
function CategoryRail() {
  return (
    <section className="mx-auto max-w-[var(--shell)] px-5 pt-16 sm:px-8 md:pt-20">
      <div className="mb-8 flex items-end justify-between gap-6">
        <h2 className="display text-[clamp(1.5rem,3vw,2.1rem)]">
          shop by <span className="italic-accent">collection</span>
        </h2>
        <Link to="/products" className="link-rule">
          See all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <Reveal variant="up">
        <div className="scrollbar-none flex gap-5 overflow-x-auto pb-2 md:grid md:grid-cols-8 md:gap-4 md:overflow-visible">
          {CATEGORY_META.map((cat) => {
            const sample = PRODUCTS.find((p) => p.category === cat.name);
            return (
              <Link
                key={cat.name}
                to={shopLink(cat.name)}
                className="group flex w-[104px] flex-shrink-0 flex-col items-center gap-3 md:w-auto"
              >
                <span className="relative block h-[104px] w-[104px] overflow-hidden rounded-full border-2 border-transparent bg-sand transition-all duration-500 group-hover:border-brand-400 group-hover:shadow-[var(--shadow-brand)] md:aspect-square md:h-auto md:w-full">
                  {sample && (
                    <img
                      src={sample.img}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                  )}
                </span>
                <span className="text-center text-[11px] font-semibold leading-tight text-stone transition-colors group-hover:text-brand-600">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

/* ============================================================
   Marquee — the accent band, the one full-width block of colour.
   ============================================================ */
function Marquee() {
  const row = [...MARQUEE_TERMS, ...MARQUEE_TERMS];
  return (
    <div className="relative mt-20 overflow-hidden bg-brand-500 py-5 md:mt-24">
      <div className="marquee">
        {row.map((term, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="px-8 text-[clamp(0.95rem,1.7vw,1.25rem)] font-bold uppercase tracking-[0.12em] text-white">
              {term}
            </span>
            <span className="text-[1.1rem] text-white/60">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Bestsellers — the row every storefront leads its grid with.
   ============================================================ */
function Bestsellers({ onQuickView, wishlist, toggleWishlist }) {
  const items = PRODUCTS.filter((p) => p.badge === "Bestseller");

  return (
    <section className="mx-auto max-w-[var(--shell)] px-5 py-20 sm:px-8 md:py-24">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-5 border-b border-line pb-5">
        <div>
          <span className="eyebrow">Most wanted</span>
          <h2 className="display mt-3 text-[clamp(1.8rem,4vw,2.8rem)]">
            our <span className="italic-accent">bestsellers</span>
          </h2>
        </div>
        <Link to="/products" className="btn btn-outline">
          Shop all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-5">
        {items.map((p, i) => (
          <Reveal key={p.id} variant="up" delay={(i % 5) * 80} className="h-full">
            <ProductCard
              product={p}
              onQuickView={onQuickView}
              onWishlistToggle={toggleWishlist}
              isWishlisted={wishlist.includes(p.id)}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   Collections — a bento moodboard, not a uniform grid.
   ============================================================ */
// Spans are declared per tile so the board has a deliberate rhythm rather
// than a repeating one. Index maps to CATEGORY_META order.
const BENTO_SPANS = [
  "md:col-span-2 md:row-span-2", // Mattresses
  "md:col-span-1 md:row-span-1", // Bedsheets
  "md:col-span-1 md:row-span-1", // Duvets
  "md:col-span-2 md:row-span-1", // Pillows
  "md:col-span-2 md:row-span-2", // Curtains
  "md:col-span-1 md:row-span-1", // Rugs
  "md:col-span-1 md:row-span-1", // Throws
  "md:col-span-2 md:row-span-1", // Wall decor
];

function Collections() {
  return (
    <section className="mx-auto max-w-[var(--shell)] px-5 py-20 sm:px-8 md:py-24">
      <SectionHead
        index="01"
        label="The collections"
        title={"eight ways to\nfinish a room."}
        aside="Each collection is stocked in the sizes Nigerian homes are actually built around. Pick one to jump straight into it."
      />

      <div className="mt-14 grid auto-rows-[170px] grid-cols-2 gap-3 md:auto-rows-[215px] md:grid-cols-4 md:gap-4">
        {CATEGORY_META.map((cat, i) => {
          const sample = PRODUCTS.find((p) => p.category === cat.name);
          const big = BENTO_SPANS[i].includes("row-span-2");
          return (
            <Reveal
              key={cat.name}
              variant="scale"
              delay={(i % 4) * 90}
              className={BENTO_SPANS[i]}
            >
              <Link
                to={shopLink(cat.name)}
                className="group relative block h-full overflow-hidden rounded-2xl border border-line bg-sand shadow-[var(--shadow-rest)] transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]"
              >
                {sample && (
                  <img
                    src={sample.img}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                <span className="absolute inset-0 bg-brand-500/0 transition-colors duration-700 group-hover:bg-brand-500/15" />

                <span className="num absolute left-5 top-4 text-[10px] font-bold tracking-[0.28em] text-white/75">
                  {cat.index}
                </span>

                <span className="absolute inset-x-5 bottom-4">
                  <span
                    className={`block font-extrabold leading-tight tracking-[-0.02em] text-white ${
                      big ? "text-2xl md:text-[30px]" : "text-lg md:text-xl"
                    }`}
                  >
                    {cat.name}
                  </span>
                  {big && (
                    <span className="mt-2 hidden max-w-xs text-[13px] leading-relaxed text-white/70 md:block">
                      {cat.blurb}
                    </span>
                  )}
                  <span className="mt-3 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-brand-200 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    Browse
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ============================================================
   New arrivals — a drag rail rather than another grid.
   ============================================================ */
function Arrivals({ onQuickView, wishlist, toggleWishlist }) {
  const railRef = useRef(null);
  const items = PRODUCTS.filter((p) => p.badge === "New");

  const nudge = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    // Scroll by one card plus its gap, so the snap always lands cleanly.
    const step = rail.firstElementChild?.offsetWidth ?? 300;
    rail.scrollBy({ left: direction * (step + 20), behavior: "smooth" });
  };

  return (
    <section className="bg-sand/60 py-20 md:py-24">
      <div className="mx-auto max-w-[var(--shell)] px-5 sm:px-8">
        <SectionHead
          index="02"
          label="Just landed"
          title={"new this\nseason."}
          aside="Fresh into the Lekki showroom. Drag the row, or open a piece to see the full specification."
        />

        <div className="mt-10 flex items-center gap-2">
          <button
            onClick={() => nudge(-1)}
            aria-label="Previous"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-canvas text-stone transition-colors hover:border-brand-300 hover:text-brand-600"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => nudge(1)}
            aria-label="Next"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-canvas text-stone transition-colors hover:border-brand-300 hover:text-brand-600"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <span className="label ml-3">Drag or swipe</span>
        </div>
      </div>

      {/* Full-bleed on purpose: the rail should run off the edge of the page. */}
      <div className="mt-6 pl-5 sm:pl-8">
        <div
          ref={railRef}
          className="rail mx-auto max-w-[calc(var(--shell)-2.5rem)] pr-5 sm:pr-8"
        >
          {items.map((p) => (
            <div key={p.id} className="w-[248px] sm:w-[286px]">
              <ProductCard
                product={p}
                onQuickView={onQuickView}
                onWishlistToggle={toggleWishlist}
                isWishlisted={wishlist.includes(p.id)}
              />
            </div>
          ))}

          {/* Tail card — turns the end of the rail into a route into the shop. */}
          <div className="flex w-[248px] sm:w-[286px]">
            <Link
              to="/products"
              className="panel-brand group flex w-full flex-col items-start justify-end p-7 transition-transform duration-500 hover:-translate-y-1.5"
            >
              <p className="display num text-3xl">All {PRODUCTS.length}</p>
              <p className="display text-3xl">pieces</p>
              <span className="link-rule mt-5">
                Enter the shop
                <ArrowRight className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Lookbook — three rooms, told in order, images alternating.
   ============================================================ */
function Lookbook() {
  return (
    <section className="py-20 md:py-24">
      <div className="mx-auto max-w-[var(--shell)] px-5 sm:px-8">
        <SectionHead
          index="03"
          label="Buying guide"
          title={"what to buy\nfirst."}
          aside="Furnish in this order and the room lands every time. Each step links straight to the collection it needs."
        />
      </div>

      <div className="mt-18 space-y-20 md:mt-20 md:space-y-28">
        {ROOMS.map((room, i) => (
          <div
            key={room.index}
            className="mx-auto grid max-w-[var(--shell)] items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16"
          >
            <Reveal
              variant={i % 2 === 0 ? "left" : "right"}
              duration={1300}
              className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-2" : ""}`}
            >
              <Parallax speed={i % 2 === 0 ? -0.04 : 0.04}>
                <div className="arch-flat bg-sand shadow-[var(--shadow-lift)]">
                  <img
                    src={room.img}
                    alt=""
                    className="h-[340px] w-full object-cover md:h-[500px]"
                    loading="lazy"
                  />
                </div>
              </Parallax>
            </Reveal>

            <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
              <Reveal variant="fade">
                <div className="flex items-center gap-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-[11px] font-bold text-white">
                    {room.index}
                  </span>
                  <span className="label">{room.label}</span>
                </div>
              </Reveal>

              <SplitHeading
                text={room.title}
                className="display mt-6 text-[clamp(2rem,4.2vw,3.1rem)]"
              />

              <Reveal variant="up" delay={160}>
                <p className="mt-6 max-w-md text-[15px] leading-[1.9] text-stone">
                  {room.copy}
                </p>
              </Reveal>

              <Reveal variant="up" delay={260}>
                <Link to={shopLink(room.link)} className="btn btn-primary mt-8">
                  Shop {room.link.toLowerCase()}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Reveal>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   Why shop here — the one block that goes dark, so it lands.
   ============================================================ */
const REASONS = [
  {
    icon: Truck,
    title: "We deliver and fit it",
    body: "Our own van, our own team. Curtains hung, rugs laid, packaging taken away.",
  },
  {
    icon: Undo2,
    title: "100 nights to change your mind",
    body: "Sleep on the mattress. If the firmness is wrong we swap it, no restocking fee.",
  },
  {
    icon: ShieldCheck,
    title: "Two years, in writing",
    body: "Against sag, seam failure and hardware faults — not a goodwill gesture.",
  },
  {
    icon: Headset,
    title: "Everything is in stock",
    body: "Forty pieces held in Lagos. If it is on the site, it is on the floor.",
  },
];

function WhyShop() {
  return (
    <section className="mx-auto max-w-[var(--shell)] px-5 py-20 sm:px-8 md:py-24">
      <div className="panel-ink relative overflow-hidden p-8 md:p-16">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/25 blur-[90px]" />

        <div className="relative grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal variant="fade">
              <span className="eyebrow text-brand-300">Why shop here</span>
            </Reveal>
            <SplitHeading
              text={"the part nobody\nphotographs."}
              accent="nobody"
              className="display mt-6 text-[clamp(2rem,4vw,3.1rem)] text-cloud"
            />
            <Reveal variant="up" delay={180}>
              <p className="mt-7 max-w-sm text-[15px] leading-[1.9] text-cloud/60">
                Anyone can put a photograph on a website. Four things decide
                whether the thing actually turns up and lasts.
              </p>
            </Reveal>
            <Reveal variant="up" delay={280}>
              <Link to="/products" className="btn btn-primary mt-8">
                Start shopping
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Reveal>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            {REASONS.map((p, i) => (
              <Reveal
                key={p.title}
                variant="up"
                delay={i * 90}
                className="rounded-2xl border border-white/8 bg-white/[0.04] p-6 transition-colors duration-500 hover:border-brand-400/40 hover:bg-white/[0.07]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/15">
                  <p.icon className="h-[18px] w-[18px] text-brand-400" />
                </span>
                <h3 className="display-md mt-4 text-[17px] text-cloud">
                  {p.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-[1.8] text-cloud/55">
                  {p.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Testimonials
   ============================================================ */
function Voices() {
  return (
    <section className="mx-auto max-w-[var(--shell)] px-5 pb-20 sm:px-8 md:pb-24">
      <SectionHead
        index="04"
        label="Verified buyers"
        title={"what people\nsay after."}
        titleClass="text-[clamp(2rem,5vw,3.4rem)]"
      />

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal
            key={t.name}
            variant="up"
            delay={i * 110}
            className="panel flex flex-col p-8 transition-transform duration-500 hover:-translate-y-1.5 md:p-9"
          >
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star
                  key={s}
                  className="h-3.5 w-3.5 fill-brand-500 text-brand-500"
                />
              ))}
            </div>
            <p className="display-md mt-5 flex-1 text-[16px] font-semibold leading-[1.7] text-ink-soft">
              {t.quote}
            </p>
            <div className="mt-7 border-t border-line pt-5">
              <p className="text-[13px] font-bold text-ink">{t.name}</p>
              <p className="label mt-1.5">{t.place}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   Closing
   ============================================================ */
function Closing() {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <Parallax speed={0.06} className="absolute inset-0">
        <img
          src={ROOMS[0].img}
          alt=""
          className="h-[120%] w-full object-cover opacity-20"
          loading="lazy"
        />
      </Parallax>
      <div className="absolute inset-0 bg-gradient-to-b from-cloud via-cloud/88 to-cloud" />

      <div className="relative mx-auto max-w-2xl px-5 py-24 text-center sm:px-8 md:py-32">
        <Reveal variant="fade">
          <span className="eyebrow">Forty pieces, in stock</span>
        </Reveal>

        <SplitHeading
          text={"start with\none room."}
          accent="one"
          className="display mt-7 text-[clamp(2.4rem,6.5vw,4.4rem)]"
          stagger={70}
        />

        <Reveal variant="up" delay={200}>
          <p className="lead mx-auto mt-7 max-w-md">
            Everything on this site is held in Lagos and delivered by our own
            team. Browse the shop, or send us a photo of the room and we will
            tell you what fits.
          </p>
        </Reveal>

        <Reveal variant="up" delay={320}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/products" className="btn btn-primary">
              Shop the collection
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href="https://wa.me/2347047535828"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              WhatsApp us
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   Page
   ============================================================ */
export default function Home({ onQuickView, wishlist = [], toggleWishlist }) {
  const shopProps = { onQuickView, wishlist, toggleWishlist };

  return (
    <div>
      <Hero />
      <ServiceStrip />
      <CategoryRail />
      <Marquee />
      <Bestsellers {...shopProps} />
      <Collections />
      <Arrivals {...shopProps} />
      <Lookbook />
      <WhyShop />
      <Voices />
      <Closing />
    </div>
  );
}
