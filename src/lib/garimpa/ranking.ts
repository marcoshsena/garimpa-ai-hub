import type { Commission, Marketplace, Offer, OpportunityType } from "./types";

/**
 * Ranking de ofertas (MVP — dados simulados).
 *
 * A pontuação de cada oferta combina, com pesos:
 *  - Preço relativo ao mais barato do mesmo produto base (25%)
 *  - Avaliação média do produto (20%)
 *  - Volume de avaliações (15%)
 *  - Volume aproximado de vendas (15%)
 *  - Comissão estimada (15%)
 *  - Disponibilidade (10%)
 *
 * Resultado normalizado para 0–10.
 */

const COMMISSION_WEIGHT: Record<Commission, number> = {
  Alta: 1,
  Média: 0.65,
  Baixa: 0.35,
  "Não informada": 0.25,
};

export interface EnrichedOffer extends Offer {
  computedScore: number;
  computedBest: boolean;
  reason: string;
}

function logNorm(n: number, max = 4) {
  return Math.min(1, Math.log10(Math.max(n, 1) + 1) / max);
}

function scoreSingle(offer: Offer, peers: Offer[]) {
  const minPrice = Math.min(...peers.map((p) => p.price));
  const priceRatio = offer.availability === "Esgotado" ? 0 : minPrice / offer.price;
  const ratingNorm = Math.max(0, Math.min(1, offer.rating / 5));
  const reviewsNorm = logNorm(offer.reviews);
  const salesNorm = logNorm(offer.sales ?? 0);
  const commissionW = COMMISSION_WEIGHT[offer.commission];
  const availW =
    offer.availability === "Em estoque" ? 1 : offer.availability === "Estoque baixo" ? 0.7 : 0;

  const raw =
    priceRatio * 0.25 +
    ratingNorm * 0.2 +
    reviewsNorm * 0.15 +
    salesNorm * 0.15 +
    commissionW * 0.15 +
    availW * 0.1;

  const score = +(raw * 10).toFixed(1);

  const reasons: string[] = [];
  if (priceRatio >= 0.98 && offer.availability !== "Esgotado") reasons.push("preço mais competitivo");
  if (ratingNorm >= 0.9) reasons.push("ótima avaliação");
  if (reviewsNorm >= 0.7 || salesNorm >= 0.7) reasons.push("forte prova social");
  if (commissionW >= 0.9) reasons.push("comissão estimada alta");
  if (offer.availability === "Estoque baixo") reasons.push("estoque baixo — divulgue com cautela");
  if (offer.availability === "Esgotado") reasons.push("indisponível no momento");

  return {
    score,
    reason: reasons.slice(0, 2).join(" + ") || "boa combinação geral",
  };
}

/**
 * Recebe a lista bruta de ofertas e devolve cada oferta acrescida de
 * `computedScore`, `computedBest` (melhor do grupo do mesmo produto) e
 * `reason` (motivo textual da sugestão).
 */
export function enrichOffers(offers: Offer[]): EnrichedOffer[] {
  const byProduct = new Map<string, Offer[]>();
  for (const o of offers) {
    const arr = byProduct.get(o.productId) ?? [];
    arr.push(o);
    byProduct.set(o.productId, arr);
  }

  const enriched: EnrichedOffer[] = offers.map((o) => {
    const peers = byProduct.get(o.productId) ?? [o];
    const { score, reason } = scoreSingle(o, peers);
    return { ...o, computedScore: score, computedBest: false, reason };
  });

  // Marca melhor oferta por productId
  const grouped = new Map<string, EnrichedOffer[]>();
  for (const o of enriched) {
    const arr = grouped.get(o.productId) ?? [];
    arr.push(o);
    grouped.set(o.productId, arr);
  }
  grouped.forEach((arr) => {
    const eligible = arr.filter((a) => a.availability !== "Esgotado");
    const ranked = (eligible.length ? eligible : arr).slice().sort(
      (a, b) => b.computedScore - a.computedScore,
    );
    if (ranked[0]) ranked[0].computedBest = true;
  });

  return enriched;
}

/** Agrupa ofertas enriquecidas pelo produto base. */
export function groupByProduct(offers: EnrichedOffer[]) {
  const map = new Map<string, EnrichedOffer[]>();
  for (const o of offers) {
    const arr = map.get(o.productId) ?? [];
    arr.push(o);
    map.set(o.productId, arr);
  }
  return map;
}

export function bestOfferOf(offers: EnrichedOffer[]): EnrichedOffer | undefined {
  return offers.find((o) => o.computedBest) ?? offers[0];
}

/**
 * Ordena produtos de acordo com o tipo de oportunidade escolhido.
 * Usa as ofertas enriquecidas para extrair sinais (vendas, avaliação, etc.).
 */
export function rankProducts<P extends { id: string; opportunityScore: number; trending?: boolean }>(
  products: P[],
  enriched: EnrichedOffer[],
  type: OpportunityType,
): P[] {
  const groups = groupByProduct(enriched);

  const metric = (p: P) => {
    const peers = groups.get(p.id) ?? [];
    const best = bestOfferOf(peers);
    switch (type) {
      case "Mais vendidos":
        return Math.max(0, ...peers.map((o) => o.sales ?? 0));
      case "Melhor avaliados":
        return Math.max(0, ...peers.map((o) => o.rating));
      case "Melhor custo-benefício": {
        if (!peers.length) return 0;
        const minPrice = Math.min(...peers.map((o) => o.price));
        const topRating = Math.max(...peers.map((o) => o.rating));
        return (topRating / Math.max(minPrice, 1)) * 100;
      }
      case "Maior comissão estimada":
        return Math.max(0, ...peers.map((o) => COMMISSION_WEIGHT[o.commission]));
      case "Produtos em alta":
        return (p.trending ? 5 : 0) + (best?.computedScore ?? 0);
      case "Melhores oportunidades":
      default:
        return best?.computedScore ?? p.opportunityScore;
    }
  };

  return products.slice().sort((a, b) => metric(b) - metric(a));
}

export function filterOffersByMarketplaces(
  offers: Offer[],
  active: Marketplace[],
): Offer[] {
  if (!active.length) return offers;
  return offers.filter((o) => active.includes(o.marketplace));
}
