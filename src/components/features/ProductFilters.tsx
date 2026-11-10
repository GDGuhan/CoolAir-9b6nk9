import { useState } from "react";
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { ProductFilters as IFilters } from "@/types";
import { BRANDS, TONNAGE_OPTIONS, ENERGY_RATING_OPTIONS, TYPE_OPTIONS, PRICE_RANGE_MIN, PRICE_RANGE_MAX } from "@/constants/products";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  filters: Partial<IFilters>;
  onChange: (filters: Partial<IFilters>) => void;
  totalResults: number;
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        )}
      </button>
      {open && children}
    </div>
  );
}

function CheckboxItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        className={cn(
          "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
          checked
            ? "bg-primary border-primary"
            : "border-border group-hover:border-primary/50"
        )}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
            <path d="M10 3L5 8.5L2 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        )}
      </div>
      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </span>
    </label>
  );
}

export default function ProductFilters({ filters, onChange, totalResults }: ProductFiltersProps) {
  const updateFilter = <K extends keyof IFilters>(key: K, value: IFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const toggleArray = <T,>(arr: T[] | undefined, value: T): T[] => {
    const current = arr || [];
    return current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
  };

  const clearAll = () => {
    onChange({
      sortBy: filters.sortBy || "popular",
    });
  };

  const hasActiveFilters =
    (filters.brands?.length || 0) > 0 ||
    (filters.tonnage?.length || 0) > 0 ||
    (filters.energyRating?.length || 0) > 0 ||
    (filters.type?.length || 0) > 0 ||
    filters.inStockOnly ||
    (filters.priceRange && (filters.priceRange[0] > PRICE_RANGE_MIN || filters.priceRange[1] < PRICE_RANGE_MAX));

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">Filters</span>
          <span className="text-xs text-muted-foreground">({totalResults} results)</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-primary hover:text-primary/70 flex items-center gap-1 font-medium"
          >
            <X className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {/* In Stock */}
      <div className="mb-5">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <div
            className={cn(
              "w-10 h-5 rounded-full transition-all relative",
              filters.inStockOnly ? "bg-primary" : "bg-muted"
            )}
            onClick={() => updateFilter("inStockOnly", !filters.inStockOnly)}
          >
            <div
              className={cn(
                "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
                filters.inStockOnly ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </div>
          <span className="text-sm font-medium text-foreground">In Stock Only</span>
        </label>
      </div>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatPrice(filters.priceRange?.[0] || PRICE_RANGE_MIN)}</span>
            <span>{formatPrice(filters.priceRange?.[1] || PRICE_RANGE_MAX)}</span>
          </div>
          <input
            type="range"
            min={PRICE_RANGE_MIN}
            max={PRICE_RANGE_MAX}
            step={1000}
            value={filters.priceRange?.[1] || PRICE_RANGE_MAX}
            onChange={(e) =>
              updateFilter("priceRange", [
                filters.priceRange?.[0] || PRICE_RANGE_MIN,
                parseInt(e.target.value),
              ])
            }
            className="w-full accent-primary"
          />
          <div className="flex gap-2">
            {[30000, 45000, 60000, 80000].map((price) => (
              <button
                key={price}
                onClick={() =>
                  updateFilter("priceRange", [PRICE_RANGE_MIN, price])
                }
                className={cn(
                  "flex-1 py-1 text-xs rounded-lg border transition-colors",
                  (filters.priceRange?.[1] || PRICE_RANGE_MAX) === price
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border text-muted-foreground hover:border-primary/50"
                )}
              >
                ₹{price / 1000}K
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        <div className="space-y-2.5">
          {BRANDS.map((brand) => (
            <CheckboxItem
              key={brand}
              label={brand}
              checked={(filters.brands || []).includes(brand)}
              onChange={() =>
                updateFilter("brands", toggleArray(filters.brands, brand))
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Tonnage */}
      <FilterSection title="Tonnage (Room Size)">
        <div className="space-y-2">
          {TONNAGE_OPTIONS.map((ton) => (
            <CheckboxItem
              key={ton}
              label={`${ton} Ton`}
              checked={(filters.tonnage || []).includes(ton)}
              onChange={() =>
                updateFilter("tonnage", toggleArray(filters.tonnage, ton))
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Energy Rating */}
      <FilterSection title="Energy Rating (BEE Stars)">
        <div className="space-y-2">
          {[...ENERGY_RATING_OPTIONS].reverse().map((stars) => (
            <CheckboxItem
              key={stars}
              label={`${"★".repeat(stars)} ${stars}-Star`}
              checked={(filters.energyRating || []).includes(stars)}
              onChange={() =>
                updateFilter("energyRating", toggleArray(filters.energyRating, stars))
              }
            />
          ))}
        </div>
      </FilterSection>

      {/* Type */}
      <FilterSection title="AC Type" defaultOpen={false}>
        <div className="space-y-2">
          {TYPE_OPTIONS.map((type) => (
            <CheckboxItem
              key={type}
              label={`${type} AC`}
              checked={(filters.type || []).includes(type)}
              onChange={() =>
                updateFilter("type", toggleArray(filters.type, type))
              }
            />
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
