import { useState } from "react";
import { Heart, ArrowUpRight } from "lucide-react";

/**
 * A piece, as a paper card.
 *
 * There is no price and no cart on this site — the card's job is to make you
 * want to open the sheet, so the only affordances are "look closer" and
 * "keep this for later".
 */
export default function ProductCard({
  product,
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
            className={`absolute left-3 top-4 z-10 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] shadow-sm ${
              product.badge === "New"
                ? "bg-ink text-cloud"
                : "bg-brand-500 text-white"
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
            className="absolute right-3 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-canvas/90 text-stone shadow-sm backdrop-blur transition-colors duration-500 hover:border-brand-300 hover:text-brand-600"
          >
            <Heart
              className={`h-4 w-4 ${
                isWishlisted ? "fill-brand-500 text-brand-500" : ""
              }`}
            />
          </button>
        )}

        {/* Rises out of the bottom of the arch on hover; always open on touch. */}
        {onQuickView && (
          <div className="card-add z-10">
            <button
              onClick={() => onQuickView(product)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ink/92 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-cloud backdrop-blur transition-colors duration-300 hover:bg-brand-500"
            >
              View details
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-2 pb-3 pt-4">
        <p className="label">{product.category}</p>
        <h3 className="display-md mt-2 text-[15px] leading-snug transition-colors group-hover:text-brand-600">
          {product.name}
        </h3>
        {product.spec && (
          <p className="mt-1.5 line-clamp-1 text-[12px] text-haze">
            {product.spec}
          </p>
        )}

        <div className="mt-auto pt-4">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600">
            In stock
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
          </span>
        </div>
      </div>
    </article>
  );
}
