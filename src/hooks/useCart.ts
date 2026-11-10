import { useState, useEffect, useCallback } from "react";
import { CartItem, Product } from "@/types";
import { toast } from "sonner";

const CART_STORAGE_KEY = "coolair_cart";

const TAX_RATE = 0.18; // 18% GST

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const updated = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast.success(`Updated quantity in cart`, {
          description: product.name,
        });
        return updated;
      }
      toast.success(`Added to cart!`, {
        description: product.name,
      });
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (item) {
        toast.info(`Removed from cart`, { description: item.product.name });
      }
      return prev.filter((item) => item.product.id !== productId);
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const isInCart = useCallback(
    (productId: string) => items.some((item) => item.product.id === productId),
    [items]
  );

  const getItemQuantity = useCallback(
    (productId: string) =>
      items.find((item) => item.product.id === productId)?.quantity || 0,
    [items]
  );

  // Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discount = items.reduce((sum, item) => {
    const original = item.product.originalPrice || item.product.price;
    return sum + (original - item.product.price) * item.quantity;
  }, 0);

  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    subtotal,
    discount,
    tax,
    total,
    itemCount,
  };
}
