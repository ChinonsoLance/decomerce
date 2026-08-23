import { useState, useEffect, useRef, useCallback } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  NavLink,
} from "react-router-dom";
import { Heart, X, Check, Search, MessageCircle } from "lucide-react";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import Products from "./Products";
import Footer from "./components/Footer";
import Backdrop from "./components/Backdrop";
import QuickView from "./components/QuickView";
import { useScrollTick } from "./hooks/useScroll";
import { PRODUCTS, CATEGORY_META } from "./data";

// -------- IMPORT YOUR LOGO HERE ----------
import logo from "./assets/decomerce.svg";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const WHATSAPP = "2347047535828";

// There is no backend, so the saved list lives in the browser. Without this a
// refresh — or following a link out to WhatsApp and coming back — silently
// empties someone's shortlist.
const SAVED_KEY = "decomerce.saved";

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    // Private mode, quota, or hand-edited garbage — start clean rather than
    // taking the whole app down on boot.
    return fallback;
  }
}

/* ---------------- Loading ---------------- */
function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-cloud">
      <div className="backdrop-lamp absolute inset-0" />
      <div className="relative flex flex-col items-center gap-9">
        <img
          src={logo}
          alt="DECOMERCE"
          className="float-slow h-16 w-auto drop-shadow-[0_10px_30px_rgba(23,19,14,0.14)]"
        />
        <p className="display text-3xl">
          deco<span className="italic-accent">merce</span>
        </p>
        <div className="h-[3px] w-48 overflow-hidden rounded-full bg-sand-deep">
          <div className="loader-sweep h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Chrome ---------------- */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Fills the hairline along the bottom edge of the nav as the page advances. */
function ProgressRule() {
  const ref = useRef(null);
  const last = useRef(-1);

  // Written straight to the DOM — a progress rule should not re-render React
  // on every animation frame. Page height comes from the shared metrics rather
  // than a per-frame `scrollHeight` read, which would force a full layout.
  useScrollTick((m) => {
    const el = ref.current;
    if (!el) return;
    const p = Math.round(m.depth * 1000) / 1000;
    if (p === last.current) return;
    last.current = p;
    el.style.transform = `scaleX(${p})`;
  });

  return (
    <div className="absolute inset-x-0 bottom-0 h-[2px] overflow-hidden bg-transparent">
      <div
        ref={ref}
        className="h-full origin-left bg-gradient-to-r from-brand-400 to-brand-600"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

/* ---------------- Saved drawer ---------------- */
function SavedDrawer({ saved, onClose, onUnsave, onOpen }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // The shortlist lands in WhatsApp — the shop quotes per room rather than
  // per line item, so there is nothing to total up here.
  const listText = encodeURIComponent(
    [
      "Hello DECOMERCE, I am interested in these pieces:",
      "",
      ...saved.map((i) => `• ${i.name}${i.spec ? ` — ${i.spec}` : ""}`),
      "",
      "Could you send me availability and a quote?",
    ].join("\n")
  );

  return (
    <div className="fixed inset-0 z-[60] flex">
      <div className="flex-1 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="flex w-full max-w-md flex-col border-l border-line bg-canvas shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <p className="label">Your shortlist</p>
            <p className="display-md mt-1 text-lg">
              {saved.length} {saved.length === 1 ? "piece" : "pieces"} saved
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-stone transition-colors hover:border-brand-300 hover:text-brand-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {saved.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
                <Heart className="h-6 w-6 text-brand-500" />
              </span>
              <p className="display-md text-lg">Nothing saved yet</p>
              <p className="mt-2 max-w-[16rem] text-sm text-stone">
                Tap the heart on any piece to build a list you can send us in
                one message.
              </p>
              <button onClick={onClose} className="link-rule mt-6">
                Continue browsing
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {saved.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-line bg-cloud p-3 transition-colors hover:border-brand-200"
                >
                  <button
                    onClick={() => onOpen(item)}
                    className="arch-sm h-24 w-20 flex-shrink-0 bg-sand"
                    aria-label={`View ${item.name}`}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="label">{item.category}</p>
                    <p className="display-md mt-1 line-clamp-2 text-[14px]">
                      {item.name}
                    </p>
                    {item.spec && (
                      <p className="mt-1 line-clamp-1 text-[11px] text-haze">
                        {item.spec}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-4">
                      <button
                        onClick={() => onOpen(item)}
                        className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600 transition-colors hover:text-brand-700"
                      >
                        View details
                      </button>
                      <button
                        onClick={() => onUnsave(item.id)}
                        className="text-[10px] font-bold uppercase tracking-[0.18em] text-haze transition-colors hover:text-ink"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {saved.length > 0 && (
          <div className="border-t border-line bg-cloud px-6 py-6">
            <a
              href={`https://wa.me/${WHATSAPP}?text=${listText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full"
            >
              <MessageCircle className="h-4 w-4" />
              Send this list to us
            </a>
            <p className="mt-3 text-center text-[12px] text-haze">
              We reply with availability, sizes and a quote — usually the same
              working day.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * The only entry point to the shortlist. It does not exist until something is
 * actually saved, so the chrome stays empty until it has something to say.
 */
function SavedFab({ count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-ink py-3 pl-4 pr-5 text-cloud shadow-2xl transition-transform duration-500 hover:-translate-y-1 hover:bg-brand-500"
      aria-label={`Open shortlist, ${count} saved`}
    >
      <Heart className="h-4 w-4 fill-brand-400 text-brand-400" />
      <span className="num text-[12px] font-bold">{count} saved</span>
    </button>
  );
}

function Toast({ message }) {
  return (
    <div className="fade-in-up fixed bottom-8 left-1/2 z-[70] flex max-w-[90vw] items-center gap-3 rounded-full bg-ink px-5 py-3.5 text-sm text-cloud shadow-2xl">
      <Check className="h-4 w-4 flex-shrink-0 text-brand-400" />
      <span className="truncate">{message}</span>
    </div>
  );
}

/* ---------------- Navbar ---------------- */
function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [term, setTerm] = useState("");

  // Guarded so the nav only re-renders on the actual crossing, not on every
  // frame of every scroll.
  const scrolledRef = useRef(false);
  useScrollTick((m) => {
    const next = m.scrollY > 20;
    if (next === scrolledRef.current) return;
    scrolledRef.current = next;
    setScrolled(next);
  });

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (path) => location.pathname === path;
  const closeMenu = () => setMenuOpen(false);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = term.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-colors duration-500 ${
          scrolled ? "nav-blur bg-cloud/85" : "bg-transparent"
        }`}
      >
        <nav className="relative mx-auto flex h-[var(--nav-h)] max-w-[var(--shell)] items-center gap-6 px-5 sm:px-8">
          <Link
            to="/"
            className="flex flex-shrink-0 items-center gap-3"
            aria-label="DECOMERCE home"
          >
            <img src={logo} alt="" className="h-9 w-auto" />
            <span className="display text-[21px] leading-none">
              deco<span className="italic-accent">merce</span>
            </span>
          </Link>

          {/* Search — the one piece of chrome that earns centre stage. */}
          <form
            onSubmit={submitSearch}
            className="hidden max-w-md flex-1 items-center gap-2.5 rounded-full border border-line bg-canvas px-4 py-2.5 shadow-sm transition-colors focus-within:border-brand-300 lg:flex"
            role="search"
          >
            <Search className="h-4 w-4 flex-shrink-0 text-haze" />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search mattresses, curtains, rugs…"
              aria-label="Search the shop"
              className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-haze"
            />
            <button
              type="submit"
              className="flex-shrink-0 rounded-full bg-brand-500 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-600"
            >
              Search
            </button>
          </form>

          <div className="ml-auto hidden items-center gap-8 md:flex">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                data-active={isActive(link.to)}
                className="nav-link text-[11px] uppercase tracking-[0.2em]"
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <Link
              to="/products"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-canvas text-stone transition-colors hover:border-brand-300 hover:text-brand-600 lg:hidden"
              aria-label="Search the shop"
            >
              <Search className="h-[17px] w-[17px]" />
            </Link>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-canvas text-ink md:hidden"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 block h-[1.5px] w-full rounded-full bg-current transition-all duration-500 ${
                    menuOpen ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[1.5px] w-full rounded-full bg-current transition-all duration-500 ${
                    menuOpen ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>

          <ProgressRule />
        </nav>
      </header>

      {/* Mobile overlay.
          Opacity is gated on the container, not on individual children: the
          panel holds a search field, a label and a category grid that have no
          animation of their own, and gating only the animated pieces leaves
          the rest painted over the page at full opacity. `invisible` also
          takes it out of the accessibility tree while closed. */}
      <div
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-[45] transition-[opacity,visibility] duration-500 md:hidden ${
          menuOpen
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-cloud/98"
          onClick={() => setMenuOpen(false)}
        />
        <div className="relative flex h-full flex-col justify-center overflow-y-auto px-7 py-24">
          <form
            onSubmit={submitSearch}
            className="mb-8 flex items-center gap-2.5 rounded-full border border-line bg-canvas px-4 py-3 shadow-sm"
            role="search"
          >
            <Search className="h-4 w-4 flex-shrink-0 text-haze" />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search the shop…"
              aria-label="Search the shop"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-haze"
            />
          </form>

          {LINKS.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className="flex items-baseline gap-5 border-b border-line py-4"
              style={{
                transform: menuOpen ? "translateY(0)" : "translateY(24px)",
                opacity: menuOpen ? 1 : 0,
                transition: `transform .7s var(--ease-out-expo) ${i * 60}ms, opacity .7s var(--ease-out-expo) ${i * 60}ms`,
              }}
            >
              <span className="num text-[10px] font-bold tracking-[0.3em] text-brand-500">
                0{i + 1}
              </span>
              <span
                className={`display text-4xl ${
                  isActive(link.to) ? "text-brand-600" : ""
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}

          <p className="label mt-10">Collections</p>
          <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2.5">
            {CATEGORY_META.map((c) => (
              <Link
                key={c.name}
                to={`/products?category=${encodeURIComponent(c.name)}`}
                onClick={closeMenu}
                className="border-b border-line py-2 text-[13px] text-stone"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------- App ---------------- */
export default function App() {
  const [wishlist, setWishlist] = useState(() => load(SAVED_KEY, []));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(wishlist));
    } catch {
      // Storage full or blocked — the in-memory state still works for this
      // session, which is the part that matters.
    }
  }, [wishlist]);

  const toastTimer = useRef(null);
  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // The toast is decided here rather than inside the updater: StrictMode
  // double-invokes updaters, and a side effect in there fires twice.
  const toggleWishlist = useCallback(
    (id) => {
      const wasSaved = wishlist.includes(id);
      setWishlist((prev) =>
        wasSaved ? prev.filter((i) => i !== id) : [...prev, id]
      );
      const product = PRODUCTS.find((p) => p.id === id);
      if (product) {
        showToast(
          wasSaved ? `${product.name} removed` : `${product.name} saved`
        );
      }
    },
    [wishlist, showToast]
  );

  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  if (isLoading) return <LoadingScreen />;

  const pageProps = {
    wishlist,
    toggleWishlist,
    onQuickView: setQuickView,
  };

  return (
    <BrowserRouter>
      {/* One atmosphere for the entire site — never remounts between routes */}
      <Backdrop />
      <ScrollToTop />
      <Navbar />

      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home {...pageProps} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products {...pageProps} />} />
        </Routes>
      </main>

      <Footer />

      {wishlist.length > 0 && !drawerOpen && (
        <SavedFab
          count={wishlist.length}
          onClick={() => setDrawerOpen(true)}
        />
      )}

      {drawerOpen && (
        <SavedDrawer
          saved={savedProducts}
          onClose={() => setDrawerOpen(false)}
          onUnsave={toggleWishlist}
          onOpen={(product) => {
            setDrawerOpen(false);
            setQuickView(product);
          }}
        />
      )}

      {quickView && (
        <QuickView
          product={quickView}
          onClose={() => setQuickView(null)}
          onWishlistToggle={toggleWishlist}
          isWishlisted={wishlist.includes(quickView.id)}
        />
      )}

      {toast && <Toast message={toast} />}
    </BrowserRouter>
  );
}
