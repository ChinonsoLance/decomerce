import { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  X,
  SlidersHorizontal,
  LayoutGrid,
  Grid2x2,
} from "lucide-react";
import { PRODUCTS, CATEGORIES, CATEGORY_META } from "./data";
import ProductCard from "./components/ProductCard";
import { Reveal, SplitHeading } from "./components/Motion";
import { useRevealRef } from "./hooks/useScroll";

const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "new", label: "New in first" },
  { key: "name", label: "Name: A to Z" },
  { key: "name-desc", label: "Name: Z to A" },
];

const countIn = (name) =>
  name === "All"
    ? PRODUCTS.length
    : PRODUCTS.filter((p) => p.category === name).length;

export default function Products({ onQuickView, wishlist = [], toggleWishlist }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("featured");
  const [dense, setDense] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const ruleRef = useRevealRef(true);

  // The collection and the search term both live in the URL, so the homepage
  // tiles and the nav search can deep-link into this page and any filtered
  // view stays shareable. An unknown category falls back to "All" rather than
  // showing an empty grid.
  const param = searchParams.get("category");
  const category = CATEGORIES.includes(param) ? param : "All";
  const query = searchParams.get("q") || "";

  // Params are merged rather than replaced so changing the collection never
  // silently drops the search term, and vice versa.
  const patchParams = useCallback(
    (patch) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(patch).forEach(([key, value]) => {
        if (!value) next.delete(key);
        else next.set(key, value);
      });
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const setCategory = (next) => {
    patchParams({ category: next === "All" ? null : next });
    setFiltersOpen(false);
  };

  const setQuery = (next) => patchParams({ q: next });

  // A deep link lands mid-page otherwise, since the route itself has not
  // changed and the global ScrollToTop never fires.
  useEffect(() => {
    if (param || query) window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeCount = (category !== "All" ? 1 : 0) + (query ? 1 : 0);

  const reset = () => {
    setSearchParams({}, { replace: true });
    setFiltersOpen(false);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = PRODUCTS.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.spec || "").toLowerCase().includes(q)
      );
    });

    if (sort === "name")
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name-desc")
      return [...list].sort((a, b) => b.name.localeCompare(a.name));
    if (sort === "new")
      return [...list].sort(
        (a, b) => (b.badge === "New" ? 1 : 0) - (a.badge === "New" ? 1 : 0)
      );
    return list;
  }, [query, category, sort]);

  const blurb = CATEGORY_META.find((c) => c.name === category)?.blurb;

  const selectClass =
    "rounded-full border border-line bg-canvas px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink outline-none transition-colors hover:border-brand-300";

  return (
    <div className="min-h-screen">
      {/* ---------- Header ---------- */}
      <section className="mx-auto max-w-[var(--shell)] px-5 pb-10 pt-14 sm:px-8 md:pb-12 md:pt-20">
        <div className="flex items-center gap-5">
          <Reveal variant="fade">
            <span className="num text-[11px] font-bold tracking-[0.3em] text-brand-500">
              {String(filtered.length).padStart(2, "0")}
            </span>
          </Reveal>
          <div ref={ruleRef} className="rule-draw hairline flex-1" />
          <Reveal variant="fade" delay={120}>
            <span className="label whitespace-nowrap">The shop</span>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
          <SplitHeading
            as="h1"
            key={category}
            text={
              category === "All"
                ? "everything\nwe carry."
                : category.toLowerCase() + "."
            }
            accent="everything"
            className="display text-[clamp(2.6rem,7vw,5rem)] lg:col-span-7"
            stagger={80}
          />
          <Reveal variant="up" delay={200} className="lg:col-span-5">
            <p className="lead max-w-md text-[15px]">
              {blurb ||
                `${PRODUCTS.length} pieces across mattresses, bedding, curtains, rugs, throws and lighting — held in stock in Lagos and delivered by our own team.`}
            </p>
          </Reveal>
        </div>

        {/* Collection chips — the fast route, before anyone reaches the sidebar. */}
        <Reveal variant="up" delay={260}>
          <div className="scrollbar-none mt-10 flex gap-2.5 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                data-on={category === cat}
                className="chip"
              >
                {cat}
                <span className="num text-[10px] opacity-55">
                  {countIn(cat)}
                </span>
              </button>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ---------- Body ---------- */}
      <section className="mx-auto max-w-[var(--shell)] px-5 pb-24 sm:px-8 md:pb-32">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="flex items-center justify-between rounded-full border border-line bg-canvas px-4 py-2.5 lg:hidden">
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-ink"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-brand-500" />
                Filters
                {activeCount > 0 && (
                  <span className="num rounded-full bg-brand-500 px-2 py-0.5 text-[10px] text-white">
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
              <div className="mt-5 rounded-3xl border border-line bg-canvas p-6 shadow-[var(--shadow-rest)] lg:mt-0">
                {/* Search */}
                <div className="flex items-center gap-3 rounded-full border border-line bg-cloud px-4 py-2.5 transition-colors focus-within:border-brand-300">
                  <Search className="h-4 w-4 flex-shrink-0 text-haze" />
                  <input
                    className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-haze"
                    placeholder="Search the shop…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search the shop"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="text-haze transition-colors hover:text-ink"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Collections */}
                <p className="label mt-8">Collections</p>
                <ul className="mt-4 space-y-px">
                  {CATEGORIES.map((cat) => {
                    const on = category === cat;
                    return (
                      <li key={cat}>
                        <button
                          onClick={() => setCategory(cat)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] transition-colors duration-300 ${
                            on
                              ? "bg-brand-50 font-semibold text-brand-700"
                              : "text-stone hover:bg-sand hover:text-ink"
                          }`}
                        >
                          <span>{cat}</span>
                          <span className="num text-[10px] text-haze">
                            {String(countIn(cat)).padStart(2, "0")}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {activeCount > 0 && (
                  <button onClick={reset} className="link-rule mt-8">
                    Clear all filters
                  </button>
                )}
              </div>

              {/* The sidebar's closing note — a quiet route to a human. */}
              <div className="panel-brand mt-5 hidden p-6 lg:block">
                <p className="display-md text-[17px]">Not sure on sizing?</p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                  Send us the room measurements and we will tell you what fits
                  before you choose.
                </p>
                <Link to="/contact" className="link-rule mt-4">
                  Talk to us
                </Link>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="lg:col-span-9">
            <div className="mb-8 hidden items-center justify-between border-b border-line pb-4 lg:flex">
              <span className="label">
                {String(filtered.length).padStart(2, "0")} pieces
                {query && (
                  <span className="normal-case tracking-normal text-ink">
                    {" "}
                    for “{query}”
                  </span>
                )}
              </span>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-3">
                  <span className="label">Sort</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className={selectClass}
                  >
                    {SORTS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex overflow-hidden rounded-full border border-line bg-canvas">
                  <button
                    onClick={() => setDense(false)}
                    aria-label="Comfortable grid"
                    aria-pressed={!dense}
                    className={`flex h-9 w-10 items-center justify-center transition-colors ${
                      !dense
                        ? "bg-brand-500 text-white"
                        : "text-haze hover:text-ink"
                    }`}
                  >
                    <Grid2x2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDense(true)}
                    aria-label="Dense grid"
                    aria-pressed={dense}
                    className={`flex h-9 w-10 items-center justify-center transition-colors ${
                      dense
                        ? "bg-brand-500 text-white"
                        : "text-haze hover:text-ink"
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile sort */}
            <div className="mb-7 mt-5 flex items-center justify-between lg:hidden">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className={selectClass}
                aria-label="Sort products"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
              <span className="label">
                {String(filtered.length).padStart(2, "0")} pieces
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="panel py-24 text-center">
                <p className="display text-4xl">nothing here.</p>
                <p className="mt-4 text-sm text-stone">
                  No piece matches those filters{query && ` and “${query}”`}.
                </p>
                <button onClick={reset} className="btn btn-primary mt-8">
                  Reset everything
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-4 sm:gap-5 ${
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
