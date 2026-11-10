import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Grid3x3, List, SlidersHorizontal, X } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { ProductFilters as IFilters } from "@/types";
import { PRICE_RANGE_MIN, PRICE_RANGE_MAX } from "@/constants/products";
import ProductCard from "@/components/features/ProductCard";
import ProductFilters from "@/components/features/ProductFilters";
import { cn } from "@/lib/utils";

const SORT_OPTIONS: { value: IFilters["sortBy"]; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

export default function Products() {
  const [searchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [filters, setFilters] = useState<Partial<IFilters>>(() => {
    const initial: Partial<IFilters> = { sortBy: "popular" };

    const type = searchParams.get("type");
    if (type) initial.type = [type];

    const brand = searchParams.get("brand");
    if (brand) initial.brands = [brand];

    const energyRating = searchParams.get("energyRating");
    if (energyRating) initial.energyRating = [parseInt(energyRating)];

    return initial;
  });

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  const { products } = useProducts(filters);

  // Apply search filter on top of other filters
  const displayProducts = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Air Conditioners</h1>
          <p className="text-muted-foreground mt-1">
            {displayProducts.length} products available
          </p>
        </div>

        {/* Search Bar */}
        {searchQuery && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Search results for:
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {searchQuery}
              <button onClick={() => setSearchQuery("")}>
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar Filters — Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters
              filters={filters}
              onChange={setFilters}
              totalResults={displayProducts.length}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-6">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>

              <div className="flex items-center gap-2 ml-auto">
                {/* Sort */}
                <select
                  value={filters.sortBy || "popular"}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value as IFilters["sortBy"],
                    }))
                  }
                  className="text-sm border border-border rounded-xl px-3 py-2 bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === "grid" ? "bg-primary text-white" : "bg-card text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === "list" ? "bg-primary text-white" : "bg-card text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {displayProducts.length > 0 ? (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                    : "flex flex-col gap-4"
                )}
              >
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={() => {
                    setFilters({ sortBy: "popular" });
                    setSearchQuery("");
                  }}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[90vw] bg-background overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">Filters</h2>
              <button
                onClick={() => setFiltersOpen(false)}
                className="p-2 hover:bg-muted rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ProductFilters
              filters={filters}
              onChange={(f) => {
                setFilters(f);
                setFiltersOpen(false);
              }}
              totalResults={displayProducts.length}
            />
          </div>
        </div>
      )}
    </div>
  );
}
