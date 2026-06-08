import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import type { Product, Offer } from "./types";
import { mockProducts, mockOffers } from "./mockData";

const LS_PRODUCTS = "garimpa:products";
const LS_OFFERS = "garimpa:offers";
const LS_SAVED = "garimpa:saved";

type Listener = () => void;
const listeners = new Set<Listener>();
const notify = () => listeners.forEach((l) => l());

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLS<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
  notify();
}

function subscribe(l: Listener) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useProducts(): Product[] {
  return useSyncExternalStore(
    subscribe,
    () => readLS<Product[]>(LS_PRODUCTS, mockProducts),
    () => mockProducts,
  );
}

export function useOffers(): Offer[] {
  return useSyncExternalStore(
    subscribe,
    () => readLS<Offer[]>(LS_OFFERS, mockOffers),
    () => mockOffers,
  );
}

export function useProduct(id: string | undefined): Product | undefined {
  const products = useProducts();
  return products.find((p) => p.id === id);
}

export function useProductOffers(id: string | undefined): Offer[] {
  const offers = useOffers();
  return offers.filter((o) => o.productId === id);
}

export function addProduct(p: Product) {
  const list = readLS<Product[]>(LS_PRODUCTS, mockProducts);
  writeLS(LS_PRODUCTS, [p, ...list]);
}

export function addOffer(o: Offer) {
  const list = readLS<Offer[]>(LS_OFFERS, mockOffers);
  writeLS(LS_OFFERS, [o, ...list]);
}

interface SavedEntry {
  productId: string;
  savedAt: string;
}

export function useSaved(): SavedEntry[] {
  return useSyncExternalStore(
    subscribe,
    () => readLS<SavedEntry[]>(LS_SAVED, []),
    () => [],
  );
}

export function toggleSaved(productId: string) {
  const list = readLS<SavedEntry[]>(LS_SAVED, []);
  const exists = list.find((s) => s.productId === productId);
  if (exists) {
    writeLS(
      LS_SAVED,
      list.filter((s) => s.productId !== productId),
    );
  } else {
    writeLS(LS_SAVED, [{ productId, savedAt: new Date().toISOString() }, ...list]);
  }
}

export function isSaved(list: SavedEntry[], productId: string) {
  return list.some((s) => s.productId === productId);
}

export function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, []);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);
  return { copied, copy };
}
