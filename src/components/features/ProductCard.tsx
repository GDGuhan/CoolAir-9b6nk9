import { Link } from "react-router-dom";
import { ShoppingCart, Star, Zap, Check } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const BADGE_STYLES: Record<string, string> = {
  "Best Seller": "bg-amber-500 text-white",
  "New": "bg-emerald-500 text-white",
  "Sale": "bg-red-500 text-white",
};

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product.id);
  const discount = product.originalPrice
    ? getDiscountPercent(product.originalPrice, product.price)
    : 0;

  return (
    <div
      className={cn(
        "group bg-card rounded-2xl border border-border overflow-hidden card-hover",
        !product.inStock && "opacity-75"
      )}
    >
      {/* Image */}
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-gradient-to-br from-[hsl(199,100%,96%)] to-[hsl(210,40%,96%)]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className={cn(
              "w-full object-cover group-hover:scale-105 transition-transform duration-500",
              compact ? "h-40" : "h-52 sm:h-60"
            )}
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && (
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                  BADGE_STYLES[product.badge] || "bg-primary text-white"
                )}
              >
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-foreground text-background">
                -{discount}%
              </span>
            )}
          </div>
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="px-3 py-1.5 bg-foreground/80 text-background text-sm font-semibold rounded-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className={cn("p-4", compact ? "p-3" : "p-4")}>
        {/* Brand & Energy */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            {product.brand}
          </span>
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="text-xs font-semibold text-amber-600">
              {product.energyRating}★
            </span>
          </div>
        </div>

        {/* Name */}
        <Link to={`/products/${product.id}`}>
          <h3 className={cn(
            "font-semibold text-foreground hover:text-primary transition-colors line-clamp-2",
            compact ? "text-sm" : "text-base"
          )}>
            {product.name}
          </h3>
        </Link>

        {/* Specs Tags */}
        {!compact && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md text-xs">
              {product.tonnage} Ton
            </span>
            <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-md text-xs">
              {product.type}
            </span>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3.5 h-3.5",
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted-foreground"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {product.rating} ({product.reviewCount.toLocaleString("en-IN")})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-3">
          <span className={cn("font-bold text-foreground", compact ? "text-lg" : "text-xl")}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* CTA */}
        {!compact && (
          <button
            onClick={() => product.inStock && addToCart(product)}
            disabled={!product.inStock || inCart}
            className={cn(
              "w-full mt-3 py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95",
              inCart
                ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                : product.inStock
                ? "gradient-brand text-white hover:opacity-90 shadow-md shadow-primary/20"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {inCart ? (
              <>
                <Check className="w-4 h-4" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
