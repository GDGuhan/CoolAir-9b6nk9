import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag, Shield } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, subtotal, discount, tax, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any ACs yet. Browse our collection to find the perfect cooling solution.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="btn-primary inline-flex items-center gap-2"
          >
            Browse Products
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Shopping Cart
          <span className="ml-2 text-lg font-normal text-muted-foreground">
            ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4"
              >
                {/* Image */}
                <div
                  className="w-full sm:w-32 h-32 sm:h-28 rounded-xl overflow-hidden bg-secondary cursor-pointer flex-shrink-0"
                  onClick={() => navigate(`/products/${item.product.id}`)}
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-primary uppercase">
                        {item.product.brand}
                      </p>
                      <h3
                        className="font-semibold text-foreground mt-0.5 cursor-pointer hover:text-primary transition-colors line-clamp-2"
                        onClick={() => navigate(`/products/${item.product.id}`)}
                      >
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.product.tonnage} Ton · {item.product.type} AC · {item.product.energyRating}★ Energy
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3 gap-3 flex-wrap">
                    {/* Quantity */}
                    <div className="flex items-center border border-border rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold border-x border-border">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-lg text-foreground">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(item.product.price)} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Coupon */}
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
              <p className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                Apply Coupon Code
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code (e.g. COOL20)"
                  className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                />
                <button className="px-5 py-2.5 gradient-brand text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                  Apply
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Try <span className="font-semibold text-primary">COOL20</span> for 20% off or{" "}
                <span className="font-semibold text-primary">FIRSTBUY</span> for ₹2,000 off
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-24">
              <h2 className="font-bold text-lg text-foreground mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Product Discount</span>
                    <span className="font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-foreground">
                  <span>GST (18%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Delivery</span>
                  <span className="font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Installation</span>
                  <span className="font-semibold">FREE</span>
                </div>

                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between text-foreground font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 text-right">
                    Inclusive of all taxes
                  </p>
                </div>
              </div>

              {discount > 0 && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <p className="text-sm text-emerald-700 font-semibold">
                    🎉 You save {formatPrice(discount)} on this order!
                  </p>
                </div>
              )}

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-5 gradient-brand text-white font-semibold py-3.5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate("/products")}
                className="w-full mt-3 text-primary text-sm font-medium py-2 hover:underline"
              >
                Continue Shopping
              </button>

              {/* Trust */}
              <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Secured by 256-bit SSL encryption. Your data is safe.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
