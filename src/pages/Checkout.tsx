import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Smartphone, Building2, Check, Shield, ChevronRight, Lock } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice, generateId } from "@/lib/utils";
import { Order } from "@/types";
import { cn } from "@/lib/utils";

type PaymentMethod = "card" | "upi" | "netbanking" | "cod";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, subtotal, tax, discount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState<"address" | "payment" | "success">("address");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const [address, setAddress] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const [orderId] = useState(() => `CA${Date.now().toString().slice(-8)}`);

  if (items.length === 0 && step !== "success") {
    navigate("/cart");
    return null;
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing (Stripe mock)
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Save order to localStorage
    const order: Order = {
      id: orderId,
      userId: user?.id || "guest",
      items: [...items],
      status: "confirmed",
      total,
      address: {
        id: generateId(),
        label: "Shipping Address",
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: false,
      },
      paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment",
      paymentStatus: "paid",
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        .toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    };

    const existingOrders = JSON.parse(localStorage.getItem("coolair_orders") || "[]");
    localStorage.setItem("coolair_orders", JSON.stringify([order, ...existingOrders]));

    clearCart();
    setIsProcessing(false);
    setStep("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const PAYMENT_METHODS = [
    { id: "card" as PaymentMethod, label: "Credit / Debit Card", icon: CreditCard },
    { id: "upi" as PaymentMethod, label: "UPI Payment", icon: Smartphone },
    { id: "netbanking" as PaymentMethod, label: "Net Banking", icon: Building2 },
    { id: "cod" as PaymentMethod, label: "Cash on Delivery", icon: Check },
  ];

  // ==============================
  // SUCCESS STATE
  // ==============================
  if (step === "success") {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-background">
        <div className="text-center max-w-lg px-4 py-12">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Order Confirmed! 🎉</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your purchase! Your order has been placed successfully.
          </p>
          <div className="bg-secondary rounded-xl p-4 my-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-semibold text-foreground">{orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="font-semibold text-emerald-600">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Delivery</span>
              <span className="font-semibold text-foreground">
                {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-8">
            A confirmation email has been sent to {user?.email || address.phone}. Our team will contact you to schedule installation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/")}
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate("/products")}
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {["address", "payment"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                  step === s
                    ? "gradient-brand text-white"
                    : i < (step === "payment" ? 1 : 0)
                    ? "bg-emerald-500 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {i < (step === "payment" ? 1 : 0) ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-sm font-medium capitalize",
                  step === s ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {s === "address" ? "Delivery Address" : "Payment"}
              </span>
              {i < 1 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            {/* STEP 1: ADDRESS */}
            {step === "address" && (
              <form onSubmit={handleAddressSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-bold text-foreground mb-2">Delivery Address</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Full Name *</label>
                    <input
                      required
                      type="text"
                      value={address.name}
                      onChange={(e) => setAddress({ ...address, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                      placeholder="Rahul Kumar"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Street Address *</label>
                  <textarea
                    required
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background resize-none"
                    placeholder="House No, Street, Locality, Landmark"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">City *</label>
                    <input
                      required
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">State *</label>
                    <input
                      required
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">PIN Code *</label>
                    <input
                      required
                      type="text"
                      maxLength={6}
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                      placeholder="400001"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full gradient-brand text-white font-semibold py-3.5 rounded-xl hover:opacity-90 active:scale-95 transition-all mt-2 shadow-lg shadow-primary/25"
                >
                  Continue to Payment
                </button>
              </form>
            )}

            {/* STEP 2: PAYMENT */}
            {step === "payment" && (
              <form onSubmit={handlePayment} className="bg-card border border-border rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">Payment Method</h2>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    Secured by SSL
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-2.5">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                          paymentMethod === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-border/70"
                        )}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="accent-primary"
                        />
                        <Icon className={cn("w-5 h-5", paymentMethod === method.id ? "text-primary" : "text-muted-foreground")} />
                        <span className="font-medium text-sm text-foreground">{method.label}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Card Details */}
                {paymentMethod === "card" && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Card Number</label>
                      <input
                        type="text"
                        maxLength={19}
                        value={cardDetails.number}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                          setCardDetails({ ...cardDetails, number: val.replace(/(.{4})/g, "$1 ").trim() });
                        }}
                        className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                        placeholder="4242 4242 4242 4242"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-1.5">Expiry Date</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardDetails.expiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, "");
                            if (val.length >= 2) val = val.slice(0, 2) + "/" + val.slice(2, 4);
                            setCardDetails({ ...cardDetails, expiry: val });
                          }}
                          className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-1.5">CVV</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "") })}
                          className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                          placeholder="•••"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Name on Card</label>
                      <input
                        type="text"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                        placeholder="RAHUL KUMAR"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      💡 Demo: Use card number <strong>4242 4242 4242 4242</strong>, any future expiry, any CVV
                    </p>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="pt-2">
                    <label className="text-sm font-medium text-foreground block mb-1.5">UPI ID</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                      placeholder="yourname@upi"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep("address")}
                    className="flex-1 btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-2 flex-1 gradient-brand text-white font-semibold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-70 shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Pay {formatPrice(total)}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right: Order Summary */}
          <div>
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-24">
              <h3 className="font-bold text-foreground mb-4">Order Summary</h3>

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-secondary"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>GST (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-foreground pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>100% secure & encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
