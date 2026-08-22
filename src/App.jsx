import { useState, useEffect, useRef, useCallback } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  NavLink,
} from "react-router-dom";
import { ShoppingBag, Heart, Plus, Minus, X, Check } from "lucide-react";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import Products from "./Products";
import Footer from "./components/Footer";
import Backdrop from "./components/Backdrop";
import QuickView from "./components/QuickView";
import { useScrollTick } from "./hooks/useScroll";
import { formatPrice, PRODUCTS, CATEGORY_META } from "./data";

// -------- IMPORT YOUR LOGO HERE ----------
import logo from "./assets/decomerce.svg";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const WHATSAPP = "2347047535828";

// There is no backend, so the basket lives in the browser. Without this a
// refresh — or following a link out to WhatsApp and coming back — silently
// empties someone's cart.
const CART_KEY = "decomerce.cart";
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
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ink">
      <div className="backdrop-lamp absolute inset-0" />
      <div className="relative flex flex-col items-center gap-9">
        <img
          src={logo}
          alt="DECOMERCE"
          className="float-slow h-16 w-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
        />
        <p className="display text-3xl text-white">
          deco<span className="italic-accent">merce</span>
        </p>
        <div className="h-px w-48 overflow-hidden bg-white/10">
          <div className="loader-sweep h-full w-1/3 bg-gradient-to-r from-transparent via-ember-400 to-transparent" />
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
    <div className="absolute inset-x-0 bottom-0 h-px overflow-hidden bg-white/8">
      <div
        ref={ref}
        className="h-full origin-left bg-ember-400"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

/* ---------------- Drawer ---------------- */
function Drawer({ tab, setTab, cart, saved, onClose, onRemove, onUpdateQty, onAddToCart, onUnsave }) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // The order lands in WhatsApp — the shop has no checkout of its own.
  const orderText = encodeURIComponent(
    [
      "Hello DECOMERCE, I would like to order:",
      "",
      ...cart.map(
        (i) => `• ${i.qty} × ${i.name} — ${formatPrice(i.price * i.qty)}`
      ),
      "",
      `Subtotal: ${formatPrice(subtotal)}`,
    ].join("\n")
  );

  return (
    <div className="fixed inset-0 z-[60] flex">
      <div className="flex-1 bg-ink/85" onClick={onClose} />
      <div className="panel-solid flex w-full max-w-md flex-col border-l border-white/10">
        <div className="flex items-center justify-between px-6 pt-6">
          <p className="label">Your selection</p>
          <button
            onClick={onClose}
            className="text-mist/50 transition-colors hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 flex">
          <DrawerTab active={tab === "cart"} onClick={() => setTab("cart")} label="Cart" n={count} />
          <DrawerTab active={tab === "saved"} onClick={() => setTab("saved")} label="Saved" n={saved.length} />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {tab === "cart" ? (
            cart.length === 0 ? (
              <Empty
                icon={ShoppingBag}
                text="Your cart is empty"
                onClose={onClose}
              />
            ) : (
              <div className="space-y-5">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-white/8 pb-5">
                    <div className="arch-sm h-24 w-20 flex-shrink-0 border border-white/10">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="label">{item.category}</p>
                      <p className="display-md mt-1.5 line-clamp-2 text-[15px] text-white">
                        {item.name}
                      </p>
                      <p className="mt-1.5 font-mono text-[12px] text-ember-300">
                        {formatPrice(item.price * item.qty)}
                      </p>
                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center gap-3 border border-white/12 px-2.5 py-1">
                          <button
                            onClick={() => onUpdateQty(item.id, item.qty - 1)}
                            className="text-mist/50 hover:text-ember-300"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-4 text-center font-mono text-[11px] text-white">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.id, item.qty + 1)}
                            className="text-mist/50 hover:text-ember-300"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist/35 transition-colors hover:text-rose-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : saved.length === 0 ? (
            <Empty icon={Heart} text="Nothing saved yet" onClose={onClose} />
          ) : (
            <div className="space-y-5">
              {saved.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-white/8 pb-5">
                  <div className="arch-sm h-24 w-20 flex-shrink-0 border border-white/10">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="label">{item.category}</p>
                    <p className="display-md mt-1.5 line-clamp-2 text-[15px] text-white">
                      {item.name}
                    </p>
                    <p className="mt-1.5 font-mono text-[12px] text-ember-300">
                      {formatPrice(item.price)}
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                      <button
                        onClick={() => onAddToCart(item)}
                        className="border border-ember-400/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ember-300 transition-colors hover:bg-ember-400 hover:text-ink"
                      >
                        Add to cart
                      </button>
                      <button
                        onClick={() => onUnsave(item.id)}
                        className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist/35 transition-colors hover:text-rose-400"
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

        {tab === "cart" && cart.length > 0 && (
          <div className="border-t border-white/10 px-6 py-6">
            <div className="flex items-baseline justify-between">
              <span className="label">Subtotal</span>
              <span className="font-mono text-lg text-ember-300">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="mt-2 text-[12px] text-mist/35">
              Delivery quoted on confirmation — free within Lagos.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${orderText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-5 w-full"
            >
              Checkout on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function DrawerTab({ active, onClick, label, n }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 border-b px-4 py-5 font-mono text-[10px] uppercase tracking-[0.24em] transition-colors ${
        active
          ? "border-ember-400 text-ember-300"
          : "border-white/8 text-mist/40 hover:text-mist/70"
      }`}
    >
      {label} ({n})
    </button>
  );
}

function Empty({ icon: Icon, text, onClose }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="mb-6 flex h-14 w-14 items-center justify-center border border-white/10">
        <Icon className="h-5 w-5 text-ember-400" />
      </span>
      <p className="text-sm text-mist/50">{text}</p>
      <button
        onClick={onClose}
        className="link-rule mt-5"
      >
        Continue browsing
      </button>
    </div>
  );
}

function Toast({ message }) {
  return (
    <div className="fade-in-up panel-ember fixed bottom-8 left-1/2 z-[70] flex max-w-[90vw] items-center gap-3 px-5 py-3.5 text-sm text-white shadow-2xl">
      <Check className="h-4 w-4 flex-shrink-0 text-ember-400" />
      <span className="truncate">{message}</span>
    </div>
  );
}

/* ---------------- Navbar ---------------- */
function Navbar({ cartCount, savedCount, onOpenCart, onOpenSaved }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <>
      {/* Announcement strip — scrolls away with the page. */}
      <div className="relative z-30 border-b border-white/8 bg-ash-950">
        <div className="mx-auto flex h-9 max-w-[var(--shell)] items-center justify-center gap-6 px-5 sm:px-8">
          <p className="truncate font-mono text-[10px] uppercase tracking-[0.24em] text-mist/45">
            Free delivery &amp; set-up in Lagos
          </p>
          <span className="hidden h-3 w-px bg-white/12 sm:block" />
          <p className="hidden truncate font-mono text-[10px] uppercase tracking-[0.24em] text-mist/45 sm:block">
            100-night mattress trial
          </p>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 transition-colors duration-500 ${
          scrolled ? "nav-blur bg-ink/80" : "bg-transparent"
        }`}
      >
        <nav className="relative mx-auto flex h-[var(--nav-h)] max-w-[var(--shell)] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3.5" aria-label="DECOMERCE home">
            <img src={logo} alt="" className="h-10 w-auto" />
            <span className="display text-[22px] leading-none text-white">
              deco<span className="italic-accent">merce</span>
            </span>
          </Link>

          <div className="hidden items-center gap-10 md:flex">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                data-active={isActive(link.to)}
                className="nav-link font-mono text-[11px] uppercase tracking-[0.24em]"
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenSaved}
              className="relative hidden h-10 items-center gap-2 px-3 text-mist/60 transition-colors hover:text-ember-300 sm:flex"
              aria-label={`Saved items, ${savedCount}`}
            >
              <Heart className="h-[17px] w-[17px]" />
              <span className="font-mono text-[11px]">{savedCount}</span>
            </button>

            <button
              onClick={onOpenCart}
              className="flex h-10 items-center gap-2 border border-white/12 px-3.5 text-mist transition-colors hover:border-ember-400/60 hover:text-ember-300"
              aria-label={`Open cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            >
              <ShoppingBag className="h-[17px] w-[17px]" />
              <span className="font-mono text-[11px]">{cartCount}</span>
            </button>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="ml-1 flex h-10 w-10 items-center justify-center text-white md:hidden"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 block h-px w-full bg-current transition-all duration-500 ${
                    menuOpen ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-full bg-current transition-all duration-500 ${
                    menuOpen ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>

          <ProgressRule />
        </nav>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[45] md:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-ink/98 transition-opacity duration-500 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <div className="relative flex h-full flex-col justify-center overflow-y-auto px-7 py-24">
          {LINKS.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className="flex items-baseline gap-5 border-b border-white/8 py-4"
              style={{
                transform: menuOpen ? "translateY(0)" : "translateY(24px)",
                opacity: menuOpen ? 1 : 0,
                transition: `transform .7s var(--ease-out-expo) ${i * 60}ms, opacity .7s var(--ease-out-expo) ${i * 60}ms`,
              }}
            >
              <span className="font-mono text-[10px] tracking-[0.3em] text-ember-400/70">
                0{i + 1}
              </span>
              <span
                className={`display text-4xl ${
                  isActive(link.to) ? "text-ember-300" : "text-white"
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
                className="border-b border-white/5 py-2 text-[13px] text-mist/55"
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
  const [cart, setCart] = useState(() => load(CART_KEY, []));
  const [wishlist, setWishlist] = useState(() => load(SAVED_KEY, []));
  const [drawer, setDrawer] = useState(null); // null | "cart" | "saved"
  const [quickView, setQuickView] = useState(null);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      localStorage.setItem(SAVED_KEY, JSON.stringify(wishlist));
    } catch {
      // Storage full or blocked — the in-memory state still works for this
      // session, which is the part that matters.
    }
  }, [cart, wishlist]);

  const toastTimer = useRef(null);
  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const addToCart = useCallback(
    (product, qty = 1) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing)
          return prev.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + qty } : i
          );
        return [...prev, { ...product, qty }];
      });
      showToast(`${product.name} added to cart`);
    },
    [showToast]
  );

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const toggleWishlist = useCallback(
    (id) =>
      setWishlist((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      ),
    []
  );

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  if (isLoading) return <LoadingScreen />;

  const pageProps = {
    wishlist,
    addToCart,
    toggleWishlist,
    onQuickView: setQuickView,
  };

  return (
    <BrowserRouter>
      {/* One atmosphere for the entire site — never remounts between routes */}
      <Backdrop />
      <ScrollToTop />
      <Navbar
        cartCount={cartCount}
        savedCount={wishlist.length}
        onOpenCart={() => setDrawer("cart")}
        onOpenSaved={() => setDrawer("saved")}
      />

      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home {...pageProps} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products {...pageProps} />} />
        </Routes>
      </main>

      <Footer />

      {drawer && (
        <Drawer
          tab={drawer}
          setTab={setDrawer}
          cart={cart}
          saved={savedProducts}
          onClose={() => setDrawer(null)}
          onRemove={removeFromCart}
          onUpdateQty={updateQty}
          onAddToCart={addToCart}
          onUnsave={toggleWishlist}
        />
      )}

      {quickView && (
        <QuickView
          product={quickView}
          onAddToCart={addToCart}
          onClose={() => setQuickView(null)}
        />
      )}

      {toast && <Toast message={toast} />}
    </BrowserRouter>
  );
}
