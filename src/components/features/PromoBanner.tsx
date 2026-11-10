import { useNavigate } from "react-router-dom";
import { Tag, Zap, ShieldCheck, PhoneCall } from "lucide-react";

const PROMOS = [
  {
    icon: Tag,
    title: "Summer Sale",
    subtitle: "Up to 25% off on 5-star inverter ACs",
    cta: "Shop Sale",
    href: "/products?badge=Sale",
    gradient: "from-amber-500 to-orange-600",
    bg: "from-amber-50 to-orange-50",
    border: "border-amber-200",
  },
  {
    icon: Zap,
    title: "Free Installation",
    subtitle: "On all orders above ₹30,000 this month",
    cta: "Learn More",
    href: "/products",
    gradient: "from-primary to-indigo-600",
    bg: "from-blue-50 to-indigo-50",
    border: "border-blue-200",
  },
  {
    icon: ShieldCheck,
    title: "Extended Warranty",
    subtitle: "Get 2 extra years on select Daikin & LG models",
    cta: "View Offer",
    href: "/products?brand=Daikin",
    gradient: "from-emerald-500 to-teal-600",
    bg: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
  },
];

export default function PromoBanner() {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 sm:px-6 bg-secondary/40">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-10">
          Exclusive Deals & Offers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROMOS.map((promo) => {
            const Icon = promo.icon;
            return (
              <div
                key={promo.title}
                className={`relative overflow-hidden rounded-2xl border ${promo.border} bg-gradient-to-br ${promo.bg} p-6 card-hover`}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${promo.gradient} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-lg font-bold text-foreground mb-1">{promo.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{promo.subtitle}</p>

                <button
                  onClick={() => navigate(promo.href)}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r ${promo.gradient} bg-clip-text text-transparent`}
                >
                  {promo.cta} →
                </button>

                {/* Decorative */}
                <div
                  className={`absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br ${promo.gradient} opacity-10 rounded-full`}
                />
              </div>
            );
          })}
        </div>

        {/* Support Banner */}
        <div className="mt-8 bg-foreground text-background rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <PhoneCall className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-bold text-background">Need Help Choosing?</p>
              <p className="text-sm text-background/60">
                Our AC experts are available Mon–Sat, 9 AM – 8 PM
              </p>
            </div>
          </div>
          <a
            href="tel:18001232665"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors whitespace-nowrap"
          >
            1800-123-2665
          </a>
        </div>
      </div>
    </section>
  );
}
