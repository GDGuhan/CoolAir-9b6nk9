import { useNavigate } from "react-router-dom";
import { Wind, Square, Grid3x3, Columns, Star, Users } from "lucide-react";
import { PRODUCTS } from "@/constants/products";

const CATEGORY_META = [
  {
    id: "split",
    name: "Split AC",
    icon: Wind,
    description: "Most popular for home use. Quiet, energy-efficient, and stylish.",
    color: "from-blue-500 to-indigo-600",
    bg: "from-blue-50 to-indigo-50",
    border: "border-blue-200",
  },
  {
    id: "window",
    name: "Window AC",
    icon: Square,
    description: "Cost-effective and easy to install. Perfect for small rooms.",
    color: "from-emerald-500 to-teal-600",
    bg: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
  },
  {
    id: "cassette",
    name: "Cassette AC",
    icon: Grid3x3,
    description: "360° airflow distribution for offices and commercial spaces.",
    color: "from-purple-500 to-violet-600",
    bg: "from-purple-50 to-violet-50",
    border: "border-purple-200",
  },
  {
    id: "tower",
    name: "Tower AC",
    icon: Columns,
    description: "Portable, no installation needed. Stylish floor-standing unit.",
    color: "from-amber-500 to-orange-600",
    bg: "from-amber-50 to-orange-50",
    border: "border-amber-200",
  },
];

export default function CategorySection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-sm font-semibold text-primary uppercase tracking-widest">
          Browse by Type
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-3">
          Shop by Category
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Find the right type of AC for your specific needs and space requirements
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CATEGORY_META.map((cat) => {
          const Icon = cat.icon;
          const count = PRODUCTS.filter((p) => p.categoryId === cat.id).length;
          const avgRating = (
            PRODUCTS.filter((p) => p.categoryId === cat.id).reduce(
              (sum, p) => sum + p.rating,
              0
            ) / (count || 1)
          ).toFixed(1);

          return (
            <button
              key={cat.id}
              onClick={() => navigate(`/products?type=${cat.name.split(" ")[0]}`)}
              className={`group text-left p-6 rounded-2xl border ${cat.border} bg-gradient-to-br ${cat.bg} hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5`}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="font-bold text-foreground text-lg mb-1.5">{cat.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {cat.description}
              </p>

              {/* Mini Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {count} models
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {avgRating} avg
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Brands Row */}
      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground font-medium mb-6 uppercase tracking-wider">
          Authorized Dealer for India's Top Brands
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {["Daikin", "LG", "Samsung", "Voltas", "Carrier", "Hitachi", "Blue Star", "Panasonic"].map((brand) => (
            <button
              key={brand}
              onClick={() => navigate(`/products?brand=${brand}`)}
              className="text-lg font-bold text-muted-foreground/50 hover:text-primary transition-colors"
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
