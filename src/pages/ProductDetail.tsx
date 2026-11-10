import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart, ArrowLeft, Star, Shield, Truck, RotateCcw,
  Check, Zap, Thermometer, ChevronRight, Heart
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { REVIEWS } from "@/constants/products";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import StarRating from "@/components/features/StarRating";
import ProductCard from "@/components/features/ProductCard";
import { cn } from "@/lib/utils";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getById, getRelated } = useProducts();
  const { addToCart, isInCart } = useCart();

  const product = getById(id || "");
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "reviews">("overview");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <button onClick={() => navigate("/products")} className="btn-primary mt-4">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const related = getRelated(product);
  const productReviews = REVIEWS.filter((r) => r.productId === product.id);
  const discount = product.originalPrice
    ? getDiscountPercent(product.originalPrice, product.price)
    : 0;
  const inCart = isInCart(product.id);

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <button onClick={() => navigate("/")} className="hover:text-foreground transition-colors">
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => navigate("/products")} className="hover:text-foreground transition-colors">
            Products
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative bg-gradient-to-br from-[hsl(199,100%,96%)] to-[hsl(210,40%,96%)] rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-sm font-semibold rounded-full">
                  {product.badge}
                </span>
              )}
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                <Heart className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all",
                    activeImage === i ? "border-primary" : "border-transparent hover:border-border"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            {/* Brand & Model */}
            <div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                {product.brand}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-1 leading-tight">
                {product.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Model: {product.model}</p>
            </div>

            {/* Rating */}
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                    -{discount}%
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Inclusive of all taxes (18% GST)</p>

            {/* Quick Specs */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-secondary rounded-xl">
                <Thermometer className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs font-medium text-foreground">{product.tonnage} Ton</p>
                <p className="text-xs text-muted-foreground">Capacity</p>
              </div>
              <div className="text-center p-3 bg-secondary rounded-xl">
                <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <p className="text-xs font-medium text-foreground">{product.energyRating}-Star</p>
                <p className="text-xs text-muted-foreground">Energy Rating</p>
              </div>
              <div className="text-center p-3 bg-secondary rounded-xl">
                <Star className="w-5 h-5 text-amber-400 mx-auto mb-1 fill-amber-400" />
                <p className="text-xs font-medium text-foreground">{product.rating}/5</p>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-11 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors text-lg font-medium"
                >
                  −
                </button>
                <span className="w-10 h-11 flex items-center justify-center text-sm font-semibold border-x border-border">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-11 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors text-lg font-medium"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => product.inStock && addToCart(product, quantity)}
                disabled={!product.inStock || inCart}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95",
                  inCart
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    : product.inStock
                    ? "gradient-brand text-white hover:opacity-90 shadow-lg shadow-primary/25"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                {inCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </>
                )}
              </button>
            </div>

            {inCart && (
              <button
                onClick={() => navigate("/cart")}
                className="w-full py-3 rounded-xl font-semibold border-2 border-primary text-primary hover:bg-primary/5 transition-colors"
              >
                View Cart & Checkout
              </button>
            )}

            {/* Assurance */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Shield, label: "Secure Payment" },
                { icon: Truck, label: "Free Delivery" },
                { icon: RotateCcw, label: "7-Day Returns" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-xs text-muted-foreground font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Overview / Specs / Reviews */}
        <div className="mb-6 border-b border-border">
          <div className="flex gap-1">
            {(["overview", "specs", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-5 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-[1px]",
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab} {tab === "reviews" && `(${productReviews.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-16">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-3">Key Features</h3>
                <ul className="space-y-2.5">
                  {product.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-sm text-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-2xl">
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {Object.entries(product.specs).map(([key, value], i) => (
                  <div
                    key={key}
                    className={cn(
                      "flex items-center py-3 px-5 text-sm",
                      i % 2 === 0 ? "bg-secondary/40" : "bg-card"
                    )}
                  >
                    <span className="w-1/2 font-medium text-foreground capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="w-1/2 text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-5 max-w-2xl">
              {productReviews.length > 0 ? (
                productReviews.map((review) => (
                  <div key={review.id} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{review.userName}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                      <StarRating rating={review.rating} size="sm" reviewCount={undefined} />
                    </div>
                    <h4 className="font-medium text-foreground mb-1.5">{review.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">
                      {review.helpful} people found this helpful
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Star className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No reviews yet for this product.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
