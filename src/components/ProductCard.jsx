import { useState } from "react";
import { Heart, Maximize2 } from "lucide-react";
import { formatPrice } from "../data";

export default function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  onWishlistToggle,
  isWishlisted,
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="card group">
      <div className="card-media">
        <img
          src={
            imgError
              ? `https://picsum.photos/seed/decomerce-${product.id}/800/1000`
              : product.img
          }
          alt={product.name}
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <span className="card-tint" />

        {product.badge && (
          <span
            className={`absolute left-3 top-5 z-10 rounded-[2px] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] ${
              product.badge === "Sale"
                ? "bg-rose-500/90 text-white"
                : "bg-ember-400 text-ink"
            }`}
          >
            {product.badge}
          </span>
        )}

        {onWishlistToggle && (
          <button
            onClick={() => onWishlistToggle(product.id)}
            aria-label={isWishlisted ? "Remove from saved" : "Save product"}
            aria-pressed={isWishlisted}
            className="absolute right-3 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-[2px] border border-white/12 bg-ink/70 text-mist/70 transition-colors duration-500 hover:border-ember-400/60 hover:text-ember-300"
          >
            <Heart
              className={`h-3.5 w-3.5 ${
                isWishlisted ? "fill-ember-400 text-ember-400" : ""
              }`}
            />
          </button>
        )}

        {/* Rises out of the bottom of the arch on hover; always open on touch. */}
        <div className="card-add z-10 flex gap-px bg-ember-400/15 p-px">
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              className="flex-1 bg-ember-400 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-colors duration-300 hover:bg-ember-300"
            >
              Add to cart
            </button>
          )}
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              aria-label={`Quick view ${product.name}`}
              className="flex w-11 items-center justify-center bg-ash-950 text-ember-300 transition-colors duration-300 hover:bg-ash-800"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Meta sits on the page, not on a card — the rule below it is the only
          container the product gets. */}
      <div className="flex flex-1 flex-col pt-5">
        <p className="label">{product.category}</p>
        <h3 className="display-md mt-2.5 text-[17px] leading-snug text-white transition-colors group-hover:text-ember-200">
          {product.name}
        </h3>
        {product.spec && (
          <p className="mt-1.5 line-clamp-1 text-[12px] text-mist/40">
            {product.spec}
          </p>
        )}
        <div className="mt-auto flex items-baseline justify-between gap-3 pt-4">
          <span className="font-mono text-[13px] text-ember-300">
            {formatPrice(product.price)}
          </span>
        </div>
        <div className="mt-3 h-px w-full bg-white/8 transition-colors duration-500 group-hover:bg-ember-400/40" />
      </div>
    </article>
  );
}
