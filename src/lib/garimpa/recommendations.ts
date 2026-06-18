import type { Offer, Product } from "./types";

export type RecommendationTag =
  | "Melhor preço"
  | "Melhor avaliação"
  | "Alta prova social"
  | "Boa comissão"
  | "Bom para vídeo curto"
  | "Bom para WhatsApp"
  | "Bom para Reels/TikTok"
  | "Revisar antes de divulgar";

export type SuggestedChannel =
  | "WhatsApp"
  | "Telegram"
  | "Instagram Feed"
  | "Instagram Carrossel"
  | "Stories"
  | "Reels"
  | "TikTok"
  | "Vídeo IA Premium";

export type DiagnosisLevel = "Baixo" | "Médio" | "Alto";

export interface ProductDiagnosis {
  potential: DiagnosisLevel;
  visualPotential: DiagnosisLevel;
  disclosureRisk: DiagnosisLevel;
  bestChannels: SuggestedChannel[];
  bestApproach: string;
  attention: string;
  reasons: string[];
  tags: RecommendationTag[];
}

type OfferWithComputed = Offer & {
  computedScore?: number;
  computedBest?: boolean;
  reason?: string;
};

function getCommissionWeight(offer: Offer) {
  switch (offer.commission) {
    case "Alta":
      return 3;
    case "Média":
      return 2;
    case "Baixa":
      return 1;
    case "Não informada":
    default:
      return 0;
  }
}

function hasHighProof(offer: Offer) {
  return offer.reviews >= 1000 || (offer.sales ?? 0) >= 1000;
}

function hasGreatRating(offer: Offer) {
  return offer.rating >= 4.6;
}

function hasGoodRating(offer: Offer) {
  return offer.rating >= 4.3;
}

function isAvailable(offer: Offer) {
  return offer.availability !== "Esgotado";
}

function isVisualCategory(product: Product) {
  return [
    "Casa e Organização",
    "Bebê e Família",
    "Tecnologia",
    "Games",
    "Cozinha",
    "Beleza e Cuidados",
  ].includes(product.category);
}

function isGoodForShortVideo(product: Product, offer: Offer) {
  return (
    isVisualCategory(product) && isAvailable(offer) && (hasGoodRating(offer) || hasHighProof(offer))
  );
}

function getPotential(product: Product, offer: OfferWithComputed): DiagnosisLevel {
  const score = offer.computedScore ?? product.opportunityScore;

  if (score >= 8.5 && isAvailable(offer)) return "Alto";
  if (score >= 7 && isAvailable(offer)) return "Médio";

  return "Baixo";
}

function getVisualPotential(product: Product, offer: Offer): DiagnosisLevel {
  if (isGoodForShortVideo(product, offer)) return "Alto";
  if (isVisualCategory(product)) return "Médio";
  return "Baixo";
}

function getDisclosureRisk(product: Product, offer: Offer): DiagnosisLevel {
  if (offer.availability === "Esgotado") return "Alto";
  if (offer.availability === "Estoque baixo") return "Médio";
  if (product.attentionPoint && product.attentionPoint.length > 80) return "Médio";
  return "Baixo";
}

function getBestChannels(product: Product, offer: Offer): SuggestedChannel[] {
  const channels: SuggestedChannel[] = [];

  if (isGoodForShortVideo(product, offer)) {
    channels.push("TikTok", "Reels", "Vídeo IA Premium");
  }

  if (["Casa e Organização", "Bebê e Família", "Cozinha"].includes(product.category)) {
    channels.push("WhatsApp", "Instagram Carrossel", "Stories");
  }

  if (["Tecnologia", "Games"].includes(product.category)) {
    channels.push("TikTok", "Reels", "Telegram");
  }

  if (!channels.length) {
    channels.push("WhatsApp", "Instagram Feed");
  }

  return Array.from(new Set(channels)).slice(0, 4);
}

function getBestApproach(product: Product, offer: Offer): string {
  if (isGoodForShortVideo(product, offer)) {
    return "Demonstração rápida mostrando o problema antes e o benefício depois.";
  }

  if (hasHighProof(offer)) {
    return "Oferta com foco em prova social, avaliações e confiança.";
  }

  if (product.category === "Bebê e Família") {
    return "Comunicação prática e cuidadosa, mostrando como o produto facilita a rotina da família.";
  }

  if (product.category === "Games" || product.category === "Tecnologia") {
    return "Conteúdo visual e direto, destacando uso prático, setup e benefício imediato.";
  }

  return "Divulgação direta, destacando benefício principal, preço e ponto de atenção.";
}

function getReasons(product: Product, offer: OfferWithComputed, allOffers: Offer[]): string[] {
  const reasons: string[] = [];

  const availableOffers = allOffers.filter((item) => item.availability !== "Esgotado");
  const minPrice = availableOffers.length
    ? Math.min(...availableOffers.map((item) => item.price))
    : offer.price;

  if (offer.price === minPrice && isAvailable(offer)) {
    reasons.push("Possui o melhor preço entre as ofertas disponíveis.");
  }

  if (hasGreatRating(offer)) {
    reasons.push("Tem avaliação média alta para divulgação.");
  }

  if (hasHighProof(offer)) {
    reasons.push("Apresenta boa prova social em avaliações ou vendas aproximadas.");
  }

  if (getCommissionWeight(offer) >= 3) {
    reasons.push("Possui comissão estimada alta.");
  }

  if (isGoodForShortVideo(product, offer)) {
    reasons.push("Tem bom potencial para conteúdo curto, como TikTok e Reels.");
  }

  if (offer.reason) {
    reasons.push(offer.reason);
  }

  if (!reasons.length) {
    reasons.push("Apresenta uma combinação razoável entre preço, avaliação e disponibilidade.");
  }

  return Array.from(new Set(reasons)).slice(0, 5);
}

function getTags(
  product: Product,
  offer: OfferWithComputed,
  allOffers: Offer[],
): RecommendationTag[] {
  const tags: RecommendationTag[] = [];

  const availableOffers = allOffers.filter((item) => item.availability !== "Esgotado");
  const minPrice = availableOffers.length
    ? Math.min(...availableOffers.map((item) => item.price))
    : offer.price;

  if (offer.price === minPrice && isAvailable(offer)) {
    tags.push("Melhor preço");
  }

  if (hasGreatRating(offer)) {
    tags.push("Melhor avaliação");
  }

  if (hasHighProof(offer)) {
    tags.push("Alta prova social");
  }

  if (getCommissionWeight(offer) >= 3) {
    tags.push("Boa comissão");
  }

  if (isGoodForShortVideo(product, offer)) {
    tags.push("Bom para vídeo curto", "Bom para Reels/TikTok");
  }

  if (["Casa e Organização", "Bebê e Família", "Cozinha"].includes(product.category)) {
    tags.push("Bom para WhatsApp");
  }

  if (offer.availability === "Estoque baixo" || offer.availability === "Esgotado") {
    tags.push("Revisar antes de divulgar");
  }

  return Array.from(new Set(tags)).slice(0, 6);
}

export function getProductDiagnosis(
  product: Product,
  offer: OfferWithComputed,
  allOffers: Offer[] = [offer],
): ProductDiagnosis {
  return {
    potential: getPotential(product, offer),
    visualPotential: getVisualPotential(product, offer),
    disclosureRisk: getDisclosureRisk(product, offer),
    bestChannels: getBestChannels(product, offer),
    bestApproach: getBestApproach(product, offer),
    attention:
      product.attentionPoint ||
      "Revise preço, frete, avaliações e disponibilidade antes de divulgar.",
    reasons: getReasons(product, offer, allOffers),
    tags: getTags(product, offer, allOffers),
  };
}
