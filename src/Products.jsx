import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, SlidersHorizontal, LayoutGrid, Grid2x2 } from "lucide-react";
import { PRODUCTS, CATEGORIES, CATEGORY_META, formatPrice } from "./data";
import ProductCard from "./components/ProductCard";
import { Reveal, SplitHeading } from "./components/Motion";
import { useRevealRef } from "./hooks/useScroll";

const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "low", label: "Price: low to high" },
  { key: "high", label: "Price: high to low" },
  { key: "name", label: "Name: A to Z" },
];

// Brackets rather than a slider: on a catalogue of forty pieces a slider is
// fiddly precision nobody needs.
const BANDS = [
  { key: "all", label: "Any price", test: () => true },
  { key: "a", label: `Under ${formatPrice(50000)}`, test: (p) => p.price < 50000 },
  {
    key: "b",
    label: `${formatPrice(50000)} – ${formatPrice(150000)}`,
    test: (p) => p.price >= 50000 && p.price < 150000,
  },
  {
    key: "c",
    label: `${formatPrice(150000)} – ${formatPrice(300000)}`,
    test: (p) => p.price >= 150000 && p.price < 300000,
  },
  { key: "d", label: `Over ${formatPrice(300000)}`, test: (p) => p.price >= 300000 },
];

const countIn = (name) =>
  name === "All"
    ? PRODUCTS.length
    : PRODUCTS.filter((p) => p.category === name).length;

export default function Products({
  addToCart,
  onQuickView,
  wishlist = [],
  toggleWishlist,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [band, setBand] = useState("all");
  const [flags, setFlags] = useState({ New: false, Bestseller: false });
  const [dense, setDense] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const ruleRef = useRevealRef(true);

  // The collection lives in the URL so the homepage tiles can deep-link into
  // it and a filtered view stays shareable. An unknown value falls back to
  // "All" rather than showing an empty grid.
  const param = searchParams.get("category");
  const category = CATEGORIES.includes(param) ? param : "All";

  const setCategory = (next) => {
    if (next === "All") setSearchParams({}, { replace: true });
    else setSearchParams({ category: next }, { replace: true });
    setFiltersOpen(false);
  };

  // A deep link lands mid-page otherwise, since the route itself has not
  // changed and the global ScrollToTop never fires.
  useEffect(() => {
    if (param) window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeCount =
    (category !== "All" ? 1 : 0) +
    (band !== "all" ? 1 : 0) +
    Object.values(flags).filter(Boolean).length;

  const reset = () => {
    setQuery("");
    setBand("all");
    setFlags({ New: false, Bestseller: false });
    setCategory("All");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const bandTest = BANDS.find((b) => b.key === band)?.test ?? (() => true);
    const wanted = Object.entries(flags)
      .filter(([, on]) => on)
      .map(([k]) => k);

    const list = PRODUCTS.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (!bandTest(p)) return false;
      if (wanted.length && !wanted.includes(p.badge)) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.spec || "").toLowerCase().includes(q)
      );
    });

    if (sort === "low") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...list].sort((a, b) => b.price - a.price);
    if (sort === "name")
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [query, category, sort, band, flags]);

  const blurb = CATEGORY_META.find((c) => c.name === category)?.blurb;

  return (
    <div className="min-h-screen">
      {/* ---------- Header ---------- */}
      <section className="mx-auto max-w-[var(--shell)] px-5 pb-12 pt-16 sm:px-8 md:pb-16 md:pt-24">
        <div className="flex items-center gap-5">
          <Reveal variant="fade">
            <span className="font-mono text-[11px] tracking-[0.3em] text-ember-400">
              {String(filtered.length).padStart(2, "0")}
            </span>
          </Reveal>
          <div ref={ruleRef} className="rule-draw hairline flex-1" />
          <Reveal variant="fade" delay={120}>
            <span className="label whitespace-nowrap">The shop</span>
          </Reveal>
        </div>

        <div className="mt-9 grid gap-8 lg:grid-cols-12 lg:items-end">
          <SplitHeading
            as="h1"
            key={category}
            text={
              category === "All"
                ? "everything\nwe carry."
                : category.toLowerCase() + "."
            }
            accent="everything"
            className="display text-[clamp(2.6rem,7vw,5.4rem)] text-white lg:col-span-7"
            stagger={80}
          />
          <Reveal variant="up" delay={200} className="lg:col-span-5">
            <p className="lead max-w-md text-[15px]">
              {blurb ||
                `${PRODUCTS.length} pieces across mattresses, bedding, curtains, rugs, throws and lighting — held in stock in Lagos and delivered by our own team.`}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Body ---------- */}
      <section className="mx-auto max-w-[var(--shell)] px-5 pb-24 sm:px-8 md:pb-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="flex items-center justify-between border-y border-white/10 py-3 lg:hidden">
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-mist/70"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-ember-400" />
                Filters
                {activeCount > 0 && (
                  <span className="bg-ember-400 px-1.5 text-[10px] text-ink">
                    {activeCount}
                  </span>
                )}
              </button>
              <span className="label">{filtered.length} results</span>
            </div>

            <div
              className={`lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)] ${
                filtersOpen ? "block" : "hidden lg:block"
              }`}
            >
              <div className="pt-7 lg:pt-0">
                {/* Search */}
                <div className="flex items-center gap-3 border-b border-white/12 pb-3 focus-within:border-ember-400/60">
                  <Search className="h-4 w-4 flex-shrink-0 text-ember-300/70" />
                  <input
                    className="w-full bg-transparent text-sm text-white placeholder-mist/30 outline-none"
                    placeholder="Search the shop…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="text-mist/40 transition-colors hover:text-white"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Collections */}
                <p className="label mt-9">Collections</p>
                <ul className="mt-4 space-y-px">
                  {CATEGORIES.map((cat) => {
                    const on = category === cat;
                    return (
                      <li key={cat}>
                        <button
                          onClick={() => setCategory(cat)}
                          className={`flex w-full items-center justify-between border-l-2 py-2 pl-3.5 pr-1 text-left text-[13px] transition-colors duration-300 ${
                            on
                              ? "border-ember-400 text-ember-300"
                              : "border-transparent text-mist/55 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          <span>{cat}</span>
                          <span className="font-mono text-[10px] text-mist/30">
                            {String(countIn(cat)).padStart(2, "0")}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* Price */}
                <p className="label mt-9">Price</p>
                <ul className="mt-4 space-y-px">
                  {BANDS.map((b) => {
                    const on = band === b.key;
                    return (
                      <li key={b.key}>
                        <button
                          onClick={() => setBand(b.key)}
                          className={`flex w-full items-center gap-3 py-2 text-left text-[13px] transition-colors duration-300 ${
                            on ? "text-ember-300" : "text-mist/55 hover:text-white"
                          }`}
                        >
                          <span
                            className={`h-2.5 w-2.5 flex-shrink-0 border ${
                              on
                                ? "border-ember-400 bg-ember-400"
                                : "border-white/25"
                            }`}
                          />
                          {b.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* Flags */}
                <p className="label mt-9">Show only</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["New", "Bestseller"].map((f) => (
                    <button
                      key={f}
                      onClick={() =>
                        setFlags((prev) => ({ ...prev, [f]: !prev[f] }))
                      }
                      className={`border px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                        flags[f]
                          ? "border-ember-400 bg-ember-400 text-ink"
                          : "border-white/15 text-mist/55 hover:border-ember-400/40 hover:text-white"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {activeCount > 0 && (
                  <button onClick={reset} className="link-rule mt-9">
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="lg:col-span-9">
            <div className="mb-8 hidden items-center justify-between border-b border-white/10 pb-4 lg:flex">
              <span className="label">
                {String(filtered.length).padStart(2, "0")} pieces
              </span>

              <div className="flex items-center gap-5">
                <label className="flex items-center gap-3">
                  <span className="label">Sort</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="border border-white/12 bg-transparent px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-mist/80 outline-none transition-colors hover:border-ember-400/50"
                  >
                    {SORTS.map((s) => (
                      <option key={s.key} value={s.key} className="bg-ash-900">
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex border border-white/12">
                  <button
                    onClick={() => setDense(false)}
                    aria-label="Comfortable grid"
                    aria-pressed={!dense}
                    className={`flex h-9 w-9 items-center justify-center transition-colors ${
                      !dense ? "bg-ember-400 text-ink" : "text-mist/50 hover:text-white"
                    }`}
                  >
                    <Grid2x2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDense(true)}
                    aria-label="Dense grid"
                    aria-pressed={dense}
                    className={`flex h-9 w-9 items-center justify-center transition-colors ${
                      dense ? "bg-ember-400 text-ink" : "text-mist/50 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile sort */}
            <div className="mb-7 flex items-center justify-between lg:hidden">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-white/12 bg-transparent px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-mist/80 outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key} className="bg-ash-900">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="py-28 text-center">
                <p className="display text-4xl text-white/80">nothing here.</p>
                <p className="mt-5 text-sm text-mist/50">
                  No piece matches those filters{query && ` and “${query}”`}.
                </p>
                <button onClick={reset} className="btn btn-outline mt-9">
                  Reset everything
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-x-5 gap-y-12 ${
                  dense
                    ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-2 md:grid-cols-3"
                }`}
              >
                {filtered.map((p, i) => (
                  <Reveal
                    key={p.id}
                    variant="up"
                    delay={(i % 3) * 80}
                    className="h-full"
                  >
                    <ProductCard
                      product={p}
                      onAddToCart={addToCart}
                      onQuickView={onQuickView}
                      onWishlistToggle={toggleWishlist}
                      isWishlisted={wishlist.includes(p.id)}
                    />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
