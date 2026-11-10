import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap, Truck } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "5-Year Warranty" },
  { icon: Zap, label: "5-Star Rated ACs" },
  { icon: Truck, label: "Free Installation" },
];

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden gradient-hero">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="CoolAir Premium AC"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 gradient-hero opacity-80" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-20">
        <div className="max-w-2xl">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm text-white/80 font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            AI-Powered Smart Recommendations
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Cool Your Space,{" "}
            <span className="text-gradient bg-gradient-to-r from-[hsl(199,89%,68%)] to-[hsl(226,71%,75%)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
              Smart Way
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/70 leading-relaxed mb-8 max-w-xl">
            Browse India's finest collection of inverter ACs. Our AI assistant recommends the perfect unit for your room size, climate, and budget — instantly.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center justify-center gap-2.5 gradient-brand text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/30 text-base"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/products?ai=true")}
              className="inline-flex items-center justify-center gap-2.5 bg-white/10 border border-white/25 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 active:scale-95 transition-all backdrop-blur-sm text-base"
            >
              <span className="w-4 h-4">✨</span>
              Get AI Recommendation
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-6">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-white/70">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 glass-dark border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: "50,000+", label: "Happy Customers" },
              { value: "12+", label: "Premium Brands" },
              { value: "4.8★", label: "Avg. Rating" },
              { value: "24hr", label: "Quick Delivery" },
            ].map(({ value, label }) => (
              <div key={label} className="text-white">
                <div className="text-xl font-bold text-gradient">{value}</div>
                <div className="text-xs text-white/50 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
