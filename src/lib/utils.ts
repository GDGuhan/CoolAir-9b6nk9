import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in Indian Rupees
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format large numbers with Indian numbering system
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercent(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100);
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

/**
 * Generate star array for rating display
 */
export function generateStars(rating: number): ("full" | "half" | "empty")[] {
  const stars: ("full" | "half" | "empty")[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push("full");
    else if (rating >= i - 0.5) stars.push("half");
    else stars.push("empty");
  }
  return stars;
}

/**
 * Get energy rating label
 */
export function getEnergyLabel(stars: number): string {
  const labels: Record<number, string> = {
    2: "2★ — Standard",
    3: "3★ — Good",
    4: "4★ — Very Good",
    5: "5★ — Excellent",
  };
  return labels[stars] || `${stars}★`;
}

/**
 * Get recommended room size for tonnage
 */
export function getRoomSizeForTonnage(tonnage: number): string {
  const sizes: Record<number, string> = {
    1: "Up to 120 sq ft",
    1.5: "120–180 sq ft",
    2: "180–240 sq ft",
    2.5: "240–320 sq ft",
    3: "320+ sq ft",
  };
  return sizes[tonnage] || "Varies";
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
