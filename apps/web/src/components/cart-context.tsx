import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/catalog";

export type CartLine = { product: Product; size: string; qty: number };
type CartContextValue = {
  lines: CartLine[]; count: number; add: (product: Product, size: string) => boolean;
  remove: (slug: string) => void; clear: () => void;
};
const CartContext = createContext<CartContextValue | undefined>(undefined);
const KEY = "thift_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const saved = window.localStorage.getItem(KEY); if (saved) setLines(JSON.parse(saved) as CartLine[]); } catch { /* ignore damaged local cart */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) window.localStorage.setItem(KEY, JSON.stringify(lines)); }, [lines, ready]);
  const value = useMemo<CartContextValue>(() => ({
    lines,
    count: lines.reduce((sum, line) => sum + line.qty, 0),
    add: (product, size) => {
      if (lines.some((line) => line.product.slug === product.slug)) return false;
      setLines((current) => [...current, { product, size, qty: 1 }]); return true;
    },
    remove: (slug) => setLines((current) => current.filter((line) => line.product.slug !== slug)),
    clear: () => setLines([]),
  }), [lines]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
