import { useMemo } from "react";
import { PRODUCTS } from "@/constants/products";
import { Product, ProductFilters } from "@/types";

export function useProducts(filters?: Partial<ProductFilters>) {
  const filtered = useMemo(() => {
    let result = [...PRODUCTS];

    if (!filters) return result;

    // Brand filter
    if (filters.brands && filters.brands.length > 0) {
      result = result.filter((p) => filters.brands!.includes(p.brand));
    }

    // Tonnage filter
    if (filters.tonnage && filters.tonnage.length > 0) {
      result = result.filter((p) => filters.tonnage!.includes(p.tonnage));
    }

    // Energy rating filter
    if (filters.energyRating && filters.energyRating.length > 0) {
      result = result.filter((p) => filters.energyRating!.includes(p.energyRating));
    }

    // Type filter
    if (filters.type && filters.type.length > 0) {
      result = result.filter((p) => filters.type!.includes(p.type));
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter((p) => p.price >= min && p.price <= max);
    }

    // In stock filter
    if (filters.inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price_asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
        case "popular":
          result.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        case "newest":
          // Already newest-first by default in our mock data
          break;
      }
    }

    return result;
  }, [filters]);

  const getById = (id: string): Product | undefined => {
    return PRODUCTS.find((p) => p.id === id);
  };

  const getFeatured = (): Product[] => {
    return PRODUCTS.filter((p) => p.badge && p.inStock).slice(0, 4);
  };

  const getRelated = (product: Product): Product[] => {
    return PRODUCTS.filter(
      (p) =>
        p.id !== product.id &&
        (p.tonnage === product.tonnage || p.brand === product.brand) &&
        p.inStock
    ).slice(0, 4);
  };

  return { products: filtered, getById, getFeatured, getRelated };
}
