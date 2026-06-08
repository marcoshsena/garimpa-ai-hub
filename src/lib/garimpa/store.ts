import { useEffect, useState, useCallback } from "react";
import type { Product, Offer } from "./types";
import { mockProducts, mockOffers } from "./mockData";

const LS_PRODUCTS = "garimpa:products";
const LS_OFFERS = "garimpa:offers";
const LS_SAVED = "garimpa:saved";

type Listener = () => void;

interface SavedEntry {
  productId: string;
  savedAt: string;
}

const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

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

function useLocalStorageValue<T>(key: string, fallback: T): T {
  const [value, setValue] = useState<T>(() => readLS<T>(key, fallback));

  useEffect(() => {
    const handleChange = () => {
      setValue(readLS<T>(key, fallback));
    };

    const unsubscribe = subscribe(handleChange);

    window.addEventListener("storage", handleChange);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", handleChange);
    };
  }, [key, fallback]);

  return value;
}

export function useProducts(): Product[] {
  return useLocalStorageValue<Product[]>(LS_PRODUCTS, mockProducts);
}

export function useOffers(): Offer[] {
  return useLocalStorageValue<Offer[]>(LS_OFFERS, mockOffers);
}

export function useProduct(id: string | undefined): Product | undefined {
  const products = useProducts();

  return products.find((product) => product.id === id);
}

export function useProductOffers(id: string | undefined): Offer[] {
  const offers = useOffers();

  return offers.filter((offer) => offer.productId === id);
}

export function addProduct(product: Product) {
  const list = readLS<Product[]>(LS_PRODUCTS, mockProducts);

  writeLS(LS_PRODUCTS, [product, ...list]);
}

export function addOffer(offer: Offer) {
  const list = readLS<Offer[]>(LS_OFFERS, mockOffers);

  writeLS(LS_OFFERS, [offer, ...list]);
}

export function useSaved(): SavedEntry[] {
  return useLocalStorageValue<SavedEntry[]>(LS_SAVED, []);
}

export function toggleSaved(productId: string) {
  const list = readLS<SavedEntry[]>(LS_SAVED, []);
  const exists = list.some((savedProduct) => savedProduct.productId === productId);

  if (exists) {
    writeLS(
      LS_SAVED,
      list.filter((savedProduct) => savedProduct.productId !== productId),
    );

    return;
  }

  writeLS(LS_SAVED, [
    {
      productId,
      savedAt: new Date().toISOString(),
    },
    ...list,
  ]);
}

export function isSaved(list: SavedEntry[], productId: string) {
  return list.some((savedProduct) => savedProduct.productId === productId);
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

    const timeout = setTimeout(() => {
      setCopied(false);
    }, 1800);

    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  return { copied, copy };
}
