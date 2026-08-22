import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Ruler,
  Truck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  PRODUCTS,
  HERO,
  ROOMS,
  TESTIMONIALS,
  CATEGORY_META,
  MARQUEE_TERMS,
  formatPrice,
} from "./data";
import ProductCard from "./components/ProductCard";
import { SectionHead } from "./components/Section";
import { Reveal, SplitHeading, Parallax } from "./components/Motion";

const shopLink = (category) =>
  `/products?category=${encodeURIComponent(category)}`;

/* ============================================================
   Masthead — one statement, one photograph, one arch.
   ============================================================ */
function Masthead({ addToCart }) {
  const feature = PRODUCTS.find((p) => p.id === HERO.featureId);

  return (
    <section className="relative mx-auto max-w-[var(--shell)] px-5 pb-20 pt-12 sm:px-8 md:pb-28 md:pt-20">
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Type */}
        <div className="lg:col-span-6 xl:col-span-6">
          <Reveal variant="fade">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-ember-400/70" />
              <span className="eyebrow">{HERO.label}</span>
            </div>
          </Reveal>

          <SplitHeading
            as="h1"
            text={HERO.headline}
            accent={HERO.accent}
            className="display mt-8 text-[clamp(3.4rem,9vw,7rem)] text-white"
            stagger={80}
          />

          <Reveal variant="up" delay={220}>
            <p className="lead mt-9 max-w-md">{HERO.sub}</p>
          </Reveal>

          <Reveal variant="up" delay={340}>
            <div className="mt-11 flex flex-wrap items-center gap-3">
              <Link to="/products" className="btn btn-primary">
                Shop the collection
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Book a styling visit
              </Link>
            </div>
          </Reveal>

          {/* The three things that actually close a sale, on one rule. */}
          <Reveal variant="up" delay={440}>
            <div className="mt-14 grid grid-cols-3 border-t border-white/10 pt-6">
              {[
                ["48h", "Lagos delivery"],
                ["100", "Night trial"],
                ["2yr", "Guarantee"],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="display-md text-2xl text-ember-300">{value}</p>
                  <p className="label mt-1.5">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Plate */}
        <div className="relative lg:col-span-6 lg:pl-8">
          <Reveal variant="curtain" duration={1500}>
            <Parallax speed={-0.05}>
              <div className="arch relative border border-white/10">
                <img
                  src={HERO.img}
                  alt=""
                  className="h-[460px] w-full object-cover sm:h-[560px] lg:h-[660px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              </div>
            </Parallax>
          </Reveal>

          {/* The floating piece — a real product, addable from the masthead. */}
          {feature && (
            <Reveal variant="up" delay={500}>
              <div className="panel-ember absolute -bottom-6 -left-2 w-[248px] p-4 sm:left-4 lg:-left-6">
                <div className="flex gap-3.5">
                  <div className="arch-sm h-20 w-16 flex-shrink-0 border border-white/10">
                    <img
                      src={feature.img}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="label">{feature.category}</p>
                    <p className="display-md mt-1 line-clamp-2 text-[14px] text-white">
                      {feature.name}
                    </p>
                    <p className="mt-1 font-mono text-[12px] text-ember-300">
                      {formatPrice(feature.price)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(feature)}
                  className="mt-3.5 w-full bg-ember-400 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ember-300"
                >
                  Add to cart
                </button>
              </div>
            </Reveal>
          )}

          <div className="scroll-cue absolute -bottom-16 right-2 hidden flex-col items-center gap-3 lg:flex">
            <span />
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-mist/35">
              Scroll
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Marquee — set in the display serif, not in chrome type.
   ============================================================ */
function Marquee() {
  const row = [...MARQUEE_TERMS, ...MARQUEE_TERMS];
  return (
    <div className="relative overflow-hidden border-y border-white/10 py-7">
      <div className="marquee">
        {row.map((term, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="display-md px-9 text-[clamp(1.4rem,2.6vw,2.1rem)] text-mist/70">
              {term}
            </span>
            <span className="text-ember-400/80">✳</span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
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
    <section className="mx-auto max-w-[var(--shell)] px-5 py-24 sm:px-8 md:py-32">
      <SectionHead
        index="01"
        label="The collections"
        title={"eight ways to\nfinish a room."}
        aside="Each collection is stocked in the sizes Nigerian homes are actually built around. Pick one to jump straight into it."
      />

      <div className="mt-16 grid auto-rows-[168px] grid-cols-2 gap-3 md:auto-rows-[210px] md:grid-cols-4 md:gap-4">
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
                className="group relative block h-full overflow-hidden rounded-[3px] border border-white/10"
              >
                {sample && (
                  <img
                    src={sample.img}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-55 transition-all duration-[1400ms] ease-out group-hover:scale-105 group-hover:opacity-80"
                    loading="lazy"
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
                <span className="absolute inset-0 bg-ember-600/0 transition-colors duration-700 group-hover:bg-ember-600/12" />

                <span className="absolute left-5 top-4 font-mono text-[10px] tracking-[0.3em] text-ember-300/80">
                  {cat.index}
                </span>

                <span className="absolute inset-x-5 bottom-4">
                  <span
                    className={`display-md block text-white ${
                      big ? "text-2xl md:text-[32px]" : "text-lg md:text-xl"
                    }`}
                  >
                    {cat.name}
                  </span>
                  {big && (
                    <span className="mt-2 hidden max-w-xs text-[13px] leading-relaxed text-mist/55 md:block">
                      {cat.blurb}
                    </span>
                  )}
                  <span className="mt-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.24em] text-ember-300 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
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
function Arrivals({ addToCart, onQuickView, wishlist, toggleWishlist }) {
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
    <section className="py-24 md:py-32">
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
            className="flex h-10 w-10 items-center justify-center border border-white/12 text-mist/60 transition-colors hover:border-ember-400/60 hover:text-ember-300"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => nudge(1)}
            aria-label="Next"
            className="flex h-10 w-10 items-center justify-center border border-white/12 text-mist/60 transition-colors hover:border-ember-400/60 hover:text-ember-300"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <span className="label ml-3">Drag or swipe</span>
        </div>
      </div>

      {/* Full-bleed on purpose: the rail should run off the edge of the page. */}
      <div className="mt-8 pl-5 sm:pl-8">
        <div
          ref={railRef}
          className="rail mx-auto max-w-[calc(var(--shell)-2.5rem)] pr-5 sm:pr-8"
        >
          {items.map((p) => (
            <div key={p.id} className="w-[248px] sm:w-[286px]">
              <ProductCard
                product={p}
                onAddToCart={addToCart}
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
              className="panel group flex w-full flex-col items-start justify-end p-7 transition-colors hover:border-ember-400/40"
            >
              <p className="display-md text-2xl text-white">
                All {PRODUCTS.length}
                <br />
                pieces
              </p>
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
    <section className="border-t border-white/8 py-24 md:py-32">
      <div className="mx-auto max-w-[var(--shell)] px-5 sm:px-8">
        <SectionHead
          index="03"
          label="The lookbook"
          title={"how a room\ncomes together."}
          aside="We furnish in a fixed order, and it is never the order people expect. Bed, then windows, then floor and light."
        />
      </div>

      <div className="mt-20 space-y-24 md:mt-24 md:space-y-32">
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
                <div className="arch-flat border border-white/10">
                  <img
                    src={room.img}
                    alt=""
                    className="h-[340px] w-full object-cover md:h-[520px]"
                    loading="lazy"
                  />
                </div>
              </Parallax>
            </Reveal>

            <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
              <Reveal variant="fade">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[11px] tracking-[0.3em] text-ember-400">
                    {room.index}
                  </span>
                  <span className="h-px w-8 bg-ember-400/40" />
                  <span className="label">{room.label}</span>
                </div>
              </Reveal>

              <SplitHeading
                text={room.title}
                className="display mt-7 text-[clamp(2rem,4.4vw,3.4rem)] text-white"
              />

              <Reveal variant="up" delay={160}>
                <p className="mt-7 max-w-md text-[15px] leading-[1.9] text-mist/60">
                  {room.copy}
                </p>
              </Reveal>

              <Reveal variant="up" delay={260}>
                <Link to={shopLink(room.link)} className="link-rule mt-9">
                  Shop {room.link.toLowerCase()}
                  <ArrowRight className="h-3 w-3" />
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
   The promise — the one block that steps forward out of the dark.
   ============================================================ */
const PROMISES = [
  {
    icon: Ruler,
    title: "Measured on site",
    body: "Drops, stack-back and track are worked out in your room before anything is cut.",
  },
  {
    icon: Truck,
    title: "Delivered and set up",
    body: "Our own team carries it in, fits it, and leaves with the packaging.",
  },
  {
    icon: ShieldCheck,
    title: "Two years, in writing",
    body: "Against sag, seam failure and hardware faults — not a goodwill gesture.",
  },
  {
    icon: Sparkles,
    title: "Styled, not just sold",
    body: "Leave a styling visit with a palette and a layout. No obligation to buy.",
  },
];

function Promise() {
  return (
    <section className="mx-auto max-w-[var(--shell)] px-5 py-24 sm:px-8 md:py-32">
      <div className="panel-ember relative overflow-hidden p-8 md:p-16">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-ember-500/10 blur-[90px]" />

        <div className="relative grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal variant="fade">
              <span className="eyebrow">The promise</span>
            </Reveal>
            <SplitHeading
              text={"the part nobody\nphotographs."}
              accent="nobody"
              className="display mt-7 text-[clamp(2rem,4vw,3.2rem)] text-white"
            />
            <Reveal variant="up" delay={180}>
              <p className="mt-8 max-w-sm text-[15px] leading-[1.9] text-mist/60">
                Furnishing a room is mostly logistics. Four things decide
                whether it goes well, and none of them are the photograph.
              </p>
            </Reveal>
            <Reveal variant="up" delay={280}>
              <Link to="/about" className="link-rule mt-9">
                How we work
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Reveal>
          </div>

          <div className="grid gap-px bg-white/8 sm:grid-cols-2 lg:col-span-7">
            {PROMISES.map((p, i) => (
              <Reveal
                key={p.title}
                variant="up"
                delay={i * 90}
                className="bg-ash-900/60 p-7"
              >
                <p.icon className="h-5 w-5 text-ember-400" />
                <h3 className="display-md mt-5 text-lg text-white">{p.title}</h3>
                <p className="mt-3 text-[13px] leading-[1.8] text-mist/50">
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
    <section className="mx-auto max-w-[var(--shell)] px-5 pb-24 sm:px-8 md:pb-32">
      <SectionHead
        index="04"
        label="From the rooms"
        title={"what people\nsay after."}
        titleClass="text-[clamp(2rem,5vw,3.6rem)]"
      />

      <div className="mt-16 grid gap-px bg-white/8 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal
            key={t.name}
            variant="up"
            delay={i * 110}
            className="flex flex-col bg-ink p-8 md:p-10"
          >
            <span className="display text-5xl leading-none text-ember-400/40">
              “
            </span>
            <p className="display-md mt-4 flex-1 text-[17px] leading-[1.65] text-mist/85">
              {t.quote}
            </p>
            <div className="mt-8 border-t border-white/8 pt-5">
              <p className="font-mono text-[11px] tracking-[0.16em] text-white">
                {t.name}
              </p>
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
    <section className="relative overflow-hidden border-t border-white/8">
      <Parallax speed={0.06} className="absolute inset-0">
        <img
          src={ROOMS[0].img}
          alt=""
          className="h-[120%] w-full object-cover opacity-25"
          loading="lazy"
        />
      </Parallax>
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/85 to-ink" />

      <div className="relative mx-auto max-w-2xl px-5 py-28 text-center sm:px-8 md:py-40">
        <Reveal variant="fade">
          <span className="eyebrow">Start a room</span>
        </Reveal>

        <SplitHeading
          text={"tell us about\nthe space."}
          accent="space."
          className="display mt-8 text-[clamp(2.4rem,6.5vw,4.8rem)] text-white"
          stagger={70}
        />

        <Reveal variant="up" delay={200}>
          <p className="lead mx-auto mt-8 max-w-md">
            Send the room, the window measurements, and roughly what you want it
            to feel like. We come back with a scheme and a total.
          </p>
        </Reveal>

        <Reveal variant="up" delay={320}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Link to="/contact" className="btn btn-primary">
              Book a styling visit
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href="https://wa.me/2347047535828"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              WhatsApp us
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
export default function Home({
  addToCart,
  onQuickView,
  wishlist = [],
  toggleWishlist,
}) {
  return (
    <div>
      <Masthead addToCart={addToCart} />
      <Marquee />
      <Collections />
      <Arrivals
        addToCart={addToCart}
        onQuickView={onQuickView}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
      />
      <Lookbook />
      <Promise />
      <Voices />
      <Closing />
    </div>
  );
}
