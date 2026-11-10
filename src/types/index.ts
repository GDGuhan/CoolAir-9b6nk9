// ============================
// Core Data Types
// ============================

export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  originalPrice?: number;
  tonnage: 1 | 1.5 | 2 | 2.5 | 3;
  energyRating: 2 | 3 | 4 | 5;
  type: "Split" | "Window" | "Cassette" | "Tower";
  features: string[];
  description: string;
  imageUrl: string;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  badge?: string; // "Best Seller" | "New" | "Sale"
  specs: ProductSpecs;
  categoryId: string;
}

export interface ProductSpecs {
  cooling_capacity: string;
  power_input: string;
  cop: string;        // Coefficient of Performance
  compressor: string;
  refrigerant: string;
  indoor_noise: string;
  outdoor_noise: string;
  air_flow: string;
  dimensions_indoor: string;
  dimensions_outdoor: string;
  weight_indoor: string;
  weight_outdoor: string;
  warranty: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
}

// ============================
// Cart Types
// ============================

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  discount: number;
  tax: number;
}

// ============================
// Auth Types
// ============================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============================
// Order Types
// ============================

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  address: Address;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
  estimatedDelivery: string;
}

// ============================
// Filter Types
// ============================

export interface ProductFilters {
  brands: string[];
  tonnage: number[];
  energyRating: number[];
  priceRange: [number, number];
  type: string[];
  inStockOnly: boolean;
  sortBy: "price_asc" | "price_desc" | "rating" | "popular" | "newest";
}

// ============================
// AI Assistant Types
// ============================

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  products?: Product[]; // Recommended products
}

export interface AIRecommendationContext {
  roomSize?: string;
  climate?: string;
  budget?: string;
  energyPreference?: string;
  brand?: string;
}
