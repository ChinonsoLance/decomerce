// QuickView.jsx — the product sheet. Opens over the grid so browsing is never
// interrupted by a page load, which matters on a catalogue this visual.
//
// There is no price and no cart: the sheet ends in a conversation, because
// every quote here depends on size, drop and delivery address anyway.

import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  X,
  Truck,
  ShieldCheck,
  Undo2,
  MessageCircle,
  Heart,
  ArrowUpRight,
} from "lucide-react";
import { CATEGORY_META } from "../data";
import { WHATSAPP } from "../contactInfo";

const PROMISES = [
  { icon: Truck, text: "Free delivery and set-up within Lagos" },
  { icon: ShieldCheck, text: "Two-year guarantee, in writing" },
  { icon: Undo2, text: "100-night trial on every mattress" },
];

export default function QuickView({
  product,
  onClose,
  onWishlistToggle,
  isWishlisted,
}) {
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

  const blurb = CATEGORY_META.find((c) => c.name === product.category)?.blurb;

  const enquiry = encodeURIComponent(
    `Hello Joyce Interiors, I would like to ask about the ${product.name}${
      product.spec ? ` (${product.spec})` : ""
    }.`
  );

  return (
    <div
      className="fixed inset-0 z-[65] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div className="absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={onClose} />

      <div className="scale-in panel-solid relative m-0 flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-y-auto rounded-b-none sm:m-6 sm:rounded-b-[20px] md:flex-row">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-canvas/90 text-stone shadow-sm backdrop-blur transition-colors hover:border-brand-300 hover:text-brand-600"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Plate */}
        <div className="p-3 md:w-1/2 md:flex-shrink-0 md:p-4">
          <div className="arch-flat h-64 bg-sand md:h-full md:min-h-[520px]">
            <img
              src={product.img}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Sheet */}
        <div className="flex flex-1 flex-col p-7 md:p-10">
          <div className="flex items-center gap-3">
            <p className="label">{product.category}</p>
            {product.badge && (
              <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-brand-700">
                {product.badge}
              </span>
            )}
          </div>

          <h2 className="display mt-4 text-[clamp(1.7rem,3.4vw,2.4rem)]">
            {product.name}
          </h2>

          {product.spec && (
            <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-600">
              {product.spec}
            </p>
          )}

          {blurb && (
            <p className="mt-5 text-[14px] leading-[1.85] text-stone">{blurb}</p>
          )}

          <div className="my-7 rule" />

          <ul className="space-y-3.5">
            {PROMISES.map((p) => (
              <li key={p.text} className="flex items-center gap-3.5">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-50">
                  <p.icon className="h-4 w-4 text-brand-600" />
                </span>
                <span className="text-[13px] text-stone">{p.text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href={`https://wa.me/${WHATSAPP}?text=${enquiry}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary flex-1"
            >
              <MessageCircle className="h-4 w-4" />
              Ask about this piece
            </a>

            {onWishlistToggle && (
              <button
                onClick={() => onWishlistToggle(product.id)}
                aria-pressed={isWishlisted}
                className="btn btn-outline"
              >
                <Heart
                  className={`h-4 w-4 ${
                    isWishlisted ? "fill-brand-500 text-brand-500" : ""
                  }`}
                />
                {isWishlisted ? "Saved" : "Save"}
              </button>
            )}
          </div>

          <Link
            to={`/products?category=${encodeURIComponent(product.category)}`}
            onClick={onClose}
            className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink transition-colors hover:text-brand-600"
          >
            See more {product.category.toLowerCase()}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          <p className="mt-5 text-[12px] leading-relaxed text-haze">
            In stock in Lagos. We confirm the size, the delivery window and the
            total before anything is agreed.
          </p>
        </div>
      </div>
    </div>
  );
}
