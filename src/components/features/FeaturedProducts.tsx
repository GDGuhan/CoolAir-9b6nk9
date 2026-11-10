import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const { getFeatured } = useProducts();
  const featured = getFeatured();
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">
            Handpicked for You
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
            Featured Products
          </h2>
          <p className="text-muted-foreground mt-2">
            Top-rated ACs chosen by our experts and loved by customers
          </p>
        </div>
        <button
          onClick={() => navigate("/products")}
          className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/70 transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Mobile: View All */}
      <div className="mt-8 sm:hidden text-center">
        <button
          onClick={() => navigate("/products")}
          className="btn-primary inline-flex items-center gap-2"
        >
          View All Products
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
