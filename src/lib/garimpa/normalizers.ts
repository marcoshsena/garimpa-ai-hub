import type {
  Availability,
  Commission,
  Currency,
  DataSource,
  Marketplace,
  Offer,
  Product,
  ProductCondition,
  SyncStatus,
} from "./types";

export interface RawMarketplaceProduct {
  source: DataSource;
  externalProductId?: string;
  externalCatalogId?: string;
  name: string;
  category: Product["category"];
  niche?: string;
  image: string;
  shortDescription?: string;
  longDescription?: string;
  brand?: string;
  model?: string;
  keywords?: string[];
  capturedAt?: string;
}

export interface RawMarketplaceOffer {
  source: DataSource;
  marketplace: Marketplace;
  externalOfferId?: string;
  externalProductId?: string;
  productId: string;
  title: string;
  price: number;
  previousPrice?: number;
  currency?: Currency;
  rating?: number;
  reviews?: number;
  sales?: number;
  availability?: Availability | string;
  shipping?: string;
  shippingCost?: number;
  estimatedDelivery?: string;
  sellerName?: string;
  sellerId?: string;
  storeName?: string;
  originalLink: string;
  affiliateLink?: string;
  image?: string;
  commission?: Commission;
  condition?: ProductCondition;
  capturedAt?: string;
  note?: string;
}

export function normalizeMarketplaceProduct(raw: RawMarketplaceProduct): Product {
  const now = raw.capturedAt ?? new Date().toISOString();

  return {
    id: raw.externalProductId ?? createSafeId(raw.name),
    name: raw.name,
    category: raw.category,
    niche: raw.niche,
    image: raw.image,
    shortDescription:
      raw.shortDescription ??
      "Produto importado de fonte externa. Revise os dados antes de divulgar.",
    idealAudience: "Público a definir após análise do produto.",
    problemSolved: "Problema a definir após curadoria.",
    strongPoint: "Ponto forte a validar com base nos dados da oferta.",
    attentionPoint:
      "Dados importados automaticamente. Revise preço, frete, descrição e disponibilidade.",
    opportunityScore: 0,
    status: "Rascunho",
    featured: false,
    trending: false,
    updatedAt: now,

    brand: raw.brand,
    model: raw.model,
    longDescription: raw.longDescription,
    keywords: raw.keywords,
    externalProductId: raw.externalProductId,
    externalCatalogId: raw.externalCatalogId,
    dataSource: raw.source,
    syncStatus: "updated",
    lastSyncedAt: now,
    dataQuality: {
      source: raw.source,
      syncStatus: "updated",
      lastSyncedAt: now,
      confidence: getDefaultConfidence(raw.source),
    },
  };
}

export function normalizeMarketplaceOffer(raw: RawMarketplaceOffer): Offer {
  const now = raw.capturedAt ?? new Date().toISOString();
  const availability = normalizeAvailability(raw.availability);
  const currency = raw.currency ?? "BRL";
  const source = raw.source;
  const syncStatus: SyncStatus = "updated";

  return {
    id: raw.externalOfferId ?? `${raw.productId}-${slugMarketplace(raw.marketplace)}-${Date.now()}`,
    productId: raw.productId,
    marketplace: raw.marketplace,
    title: raw.title,
    price: raw.price,
    rating: raw.rating ?? 0,
    reviews: raw.reviews ?? 0,
    sales: raw.sales,
    availability,
    shipping: raw.shipping ?? "Não informado",
    originalLink: raw.originalLink,
    affiliateLink: raw.affiliateLink ?? "",
    commission: raw.commission ?? "Não informada",
    note: raw.note,
    offerScore: 0,
    bestOption: false,
    updatedAt: now,

    externalOfferId: raw.externalOfferId,
    externalProductId: raw.externalProductId,
    sellerName: raw.sellerName,
    sellerId: raw.sellerId,
    storeName: raw.storeName,
    image: raw.image,
    currency,
    previousPrice: raw.previousPrice,
    shippingCost: raw.shippingCost,
    estimatedDelivery: raw.estimatedDelivery,
    condition: raw.condition ?? "Não informado",
    lastCheckedAt: now,
    lastSyncedAt: now,
    dataSource: source,
    syncStatus,
    dataQuality: {
      source,
      syncStatus,
      lastSyncedAt: now,
      confidence: getDefaultConfidence(source),
    },
    priceHistory:
      typeof raw.previousPrice === "number"
        ? [
            {
              offerId:
                raw.externalOfferId ??
                `${raw.productId}-${slugMarketplace(raw.marketplace)}-previous`,
              marketplace: raw.marketplace,
              price: raw.previousPrice,
              currency,
              capturedAt: new Date(new Date(now).getTime() - 1000 * 60 * 60 * 24 * 7).toISOString(),
              source,
            },
            {
              offerId:
                raw.externalOfferId ??
                `${raw.productId}-${slugMarketplace(raw.marketplace)}-current`,
              marketplace: raw.marketplace,
              price: raw.price,
              currency,
              capturedAt: now,
              source,
            },
          ]
        : [
            {
              offerId:
                raw.externalOfferId ??
                `${raw.productId}-${slugMarketplace(raw.marketplace)}-current`,
              marketplace: raw.marketplace,
              price: raw.price,
              currency,
              capturedAt: now,
              source,
            },
          ],
  };
}

export function normalizeAvailability(value?: Availability | string): Availability {
  if (value === "Em estoque" || value === "Estoque baixo" || value === "Esgotado") {
    return value;
  }

  const normalized = value?.toLowerCase().trim();

  if (!normalized) return "Em estoque";

  if (
    normalized.includes("esgotado") ||
    normalized.includes("indisponível") ||
    normalized.includes("indisponivel") ||
    normalized.includes("unavailable")
  ) {
    return "Esgotado";
  }

  if (
    normalized.includes("baixo") ||
    normalized.includes("últimas") ||
    normalized.includes("ultimas") ||
    normalized.includes("limited")
  ) {
    return "Estoque baixo";
  }

  return "Em estoque";
}

function getDefaultConfidence(source: DataSource) {
  switch (source) {
    case "api":
      return 0.9;
    case "affiliate":
      return 0.8;
    case "manual":
      return 0.7;
    case "import":
      return 0.65;
    case "mock":
      return 0.6;
    case "unknown":
    default:
      return 0.4;
  }
}

function slugMarketplace(marketplace: Marketplace) {
  return marketplace
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

function createSafeId(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}