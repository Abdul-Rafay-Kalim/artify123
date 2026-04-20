import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Artwork } from "@/data/artworks";
import { useInventory } from "@/contexts/InventoryContext";

interface CartItem {
  artwork: Artwork;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (artwork: Artwork) => void;
  removeFromCart: (artworkId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isInCart: (artworkId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { isPurchasable } = useInventory();

  useEffect(() => {
    setItems((prev) => {
      const next = prev.filter((item) => isPurchasable(item.artwork.id, item.quantity));
      return next.length === prev.length ? prev : next;
    });
  }, [isPurchasable]);

  const addToCart = (artwork: Artwork) => {
    if (!isPurchasable(artwork.id, 1)) {
      return;
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.artwork.id === artwork.id);
      if (existing) return prev;
      return [...prev, { artwork, quantity: 1 }];
    });
  };

  const removeFromCart = (artworkId: string) => {
    setItems((prev) => prev.filter((i) => i.artwork.id !== artworkId));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.length;
  const totalPrice = items.reduce((sum, i) => sum + i.artwork.price * i.quantity, 0);
  const isInCart = (artworkId: string) => items.some((i) => i.artwork.id === artworkId);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, totalItems, totalPrice, isInCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
