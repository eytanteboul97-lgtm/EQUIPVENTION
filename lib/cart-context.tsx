"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProductBySlug } from "@/lib/products";

/**
 * Panier B2B côté client uniquement (localStorage). Pas de paiement en ligne :
 * le site est en phase "front vitrine" (voir CLAUDE.md) et le passage en
 * caisse se fait via une demande de devis groupée, pas un checkout simulé.
 */

interface CartItem {
  slug: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  addItem: (slug: string) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "equipvention-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage indisponible (navigation privée, etc.) — panier vide, pas bloquant.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // idem — on continue sans persistance.
    }
  }, [items, hydrated]);

  const addItem = useCallback((slug: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug);
      if (existing) {
        return prev.map((i) => (i.slug === slug ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { slug, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.slug !== slug)
        : prev.map((i) => (i.slug === slug ? { ...i, quantity } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  const value = useMemo(
    () => ({ items, count, addItem, removeItem, setQuantity, clear }),
    [items, count, addItem, removeItem, setQuantity, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function useCartProducts() {
  const { items } = useCart();
  return items
    .map((item) => ({ item, product: getProductBySlug(item.slug) }))
    .filter((x): x is { item: CartItem; product: NonNullable<ReturnType<typeof getProductBySlug>> } =>
      Boolean(x.product)
    );
}
