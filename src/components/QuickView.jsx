// QuickView.jsx — the product sheet. Opens over the grid so browsing is never
// interrupted by a page load, which matters on a catalogue this visual.

import { useEffect, useState } from "react";
import { X, Minus, Plus, Truck, ShieldCheck, Undo2 } from "lucide-react";
import { formatPrice } from "../data";

const PROMISES = [
  { icon: Truck, text: "Free delivery and set-up within Lagos" },
  { icon: ShieldCheck, text: "Two-year guarantee, in writing" },
  { icon: Undo2, text: "100-night trial on every mattress" },
];

export default function QuickView({ product, onAddToCart, onClose }) {
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-[65] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div className="absolute inset-0 bg-ink/88" onClick={onClose} />

      <div className="scale-in panel-solid relative m-0 flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-y-auto sm:m-6 md:flex-row">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-[2px] border border-white/12 bg-ink/70 text-mist/70 transition-colors hover:border-ember-400/60 hover:text-ember-300"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Plate */}
        <div className="md:w-1/2 md:flex-shrink-0">
          <div className="arch-flat h-64 border-b border-white/8 md:h-full md:min-h-[520px] md:border-b-0 md:border-r">
            <img
              src={product.img}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Sheet */}
        <div className="flex flex-1 flex-col p-7 md:p-10">
          <p className="label">{product.category}</p>
          <h2 className="display-md mt-4 text-[clamp(1.7rem,3.4vw,2.4rem)] text-white">
            {product.name}
          </h2>
          {product.spec && (
            <p className="mt-3 font-mono text-[11px] tracking-[0.14em] text-mist/45">
              {product.spec}
            </p>
          )}

          <p className="mt-6 font-mono text-2xl text-ember-300">
            {formatPrice(product.price)}
          </p>

          <div className="my-7 rule" />

          <ul className="space-y-3.5">
            {PROMISES.map((p) => (
              <li key={p.text} className="flex items-center gap-3.5">
                <p.icon className="h-4 w-4 flex-shrink-0 text-ember-400" />
                <span className="text-[13px] text-mist/60">{p.text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center justify-between gap-4 border border-white/12 px-4 py-3 sm:justify-start">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="text-mist/60 transition-colors hover:text-ember-300"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center font-mono text-sm text-white">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="text-mist/60 transition-colors hover:text-ember-300"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => {
                onAddToCart(product, qty);
                onClose();
              }}
              className="btn btn-primary flex-1"
            >
              Add {qty > 1 ? `${qty} ` : ""}to cart
            </button>
          </div>

          <p className="mt-5 text-[12px] leading-relaxed text-mist/35">
            Checkout is completed over WhatsApp — we confirm stock, delivery
            window and total before you pay anything.
          </p>
        </div>
      </div>
    </div>
  );
}
