import type {
  Availability,
  Commission,
  Marketplace,
  Offer,
  Product,
  ProductCondition,
} from "./types";

const today = new Date().toISOString();

const marketplaceCodes: Record<Marketplace, string> = {
  Amazon: "amazon",
  "Mercado Livre": "mercado-livre",
  Shopee: "shopee",
  Magalu: "magalu",
};

const sellerNames: Record<Marketplace, string> = {
  Amazon: "Loja parceira Amazon",
  "Mercado Livre": "Vendedor Mercado Livre",
  Shopee: "Loja oficial Shopee",
  Magalu: "Parceiro Magalu",
};

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Maleta de ferramentas 129 peças",
    category: "Ferramentas",
    niche: "Reparos domésticos",
    image: "https://images.unsplash.com/photo-1581147036324-c47a03a81d48?w=600&q=70",
    shortDescription:
      "Kit completo com chaves, alicate, soquetes e maleta organizadora para pequenos reparos em casa.",
    idealAudience: "Quem mora sozinho, casais novos e pessoas fazendo pequenos reparos em casa.",
    problemSolved: "Não ter ferramenta na hora de resolver um reparo simples.",
    strongPoint: "Maleta organizadora e variedade de peças por um preço acessível.",
    attentionPoint: "Uso doméstico leve — não substitui ferramenta profissional.",
    opportunityScore: 8.6,
    bestMarketplace: "Amazon",
    status: "Ativo",
    featured: true,
    trending: true,
    brand: "Sparta",
    model: "Kit doméstico 129 peças",
    longDescription:
      "Kit de ferramentas voltado para pequenos reparos domésticos, organização de ferramentas básicas e uso eventual em casa.",
    keywords: ["ferramentas", "maleta", "kit doméstico", "reparos", "casa"],
    attributes: [
      { name: "Quantidade de peças", value: "129" },
      { name: "Uso recomendado", value: "Doméstico leve" },
      { name: "Acompanha maleta", value: "Sim" },
    ],
    imageGallery: [
      {
        url: "https://images.unsplash.com/photo-1581147036324-c47a03a81d48?w=600&q=70",
        alt: "Maleta de ferramentas",
        source: "mock",
        primary: true,
      },
    ],
    externalProductId: "mock-product-p1",
    externalCatalogId: "mock-catalog-tools",
    dataSource: "mock",
    syncStatus: "updated",
    lastSyncedAt: today,
    dataQuality: {
      source: "mock",
      syncStatus: "updated",
      lastSyncedAt: today,
      confidence: 0.85,
    },
    updatedAt: today,
  },
  {
    id: "p2",
    name: "Organizador de pia compacto",
    category: "Casa e Organização",
    niche: "Organização de cozinha",
    image: "https://images.unsplash.com/photo-1556909114-44e3e9399a2c?w=600&q=70",
    shortDescription: "Suporte para esponja, detergente e bucha que ajuda a liberar espaço na pia.",
    idealAudience: "Apartamentos pequenos e pessoas que querem organizar melhor a cozinha.",
    problemSolved: "Pia bagunçada e produtos espalhados.",
    strongPoint: "Ocupa pouco espaço e tem boa utilidade no dia a dia.",
    attentionPoint: "Material plástico — não indicado para peso elevado.",
    opportunityScore: 7.9,
    bestMarketplace: "Shopee",
    status: "Ativo",
    featured: true,
    updatedAt: today,
  },
  {
    id: "p3",
    name: "Kit lenço umedecido econômico",
    category: "Bebê e Família",
    niche: "Higiene do bebê",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=70",
    shortDescription: "Pacote econômico de lenços umedecidos para a rotina diária do bebê.",
    idealAudience: "Mães, pais e cuidadores que buscam economia em itens recorrentes.",
    problemSolved: "Gasto frequente com lenços avulsos.",
    strongPoint: "Ajuda a reduzir custo por unidade em produto de uso diário.",
    attentionPoint: "Conferir composição e indicação dermatológica antes de comprar.",
    opportunityScore: 7.2,
    bestMarketplace: "Mercado Livre",
    status: "Ativo",
    featured: false,
    updatedAt: today,
  },
  {
    id: "p4",
    name: "Suporte para notebook ajustável",
    category: "Tecnologia",
    niche: "Home office",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=70",
    shortDescription:
      "Suporte dobrável com regulagem de altura para melhorar postura e ventilação do notebook.",
    idealAudience: "Quem trabalha ou estuda em home office.",
    problemSolved: "Postura ruim, notebook baixo e pouca ventilação.",
    strongPoint: "Dobrável, leve e fácil de transportar.",
    attentionPoint: "Conferir compatibilidade com o tamanho do notebook.",
    opportunityScore: 8.1,
    bestMarketplace: "Amazon",
    status: "Ativo",
    featured: true,
    trending: true,
    brand: "Genérico",
    model: "Suporte ajustável dobrável",
    longDescription:
      "Suporte dobrável para notebook, pensado para melhorar ergonomia, circulação de ar e organização da mesa de trabalho.",
    keywords: ["notebook", "home office", "ergonomia", "suporte", "setup"],
    attributes: [
      { name: "Tipo", value: "Dobrável" },
      { name: "Altura", value: "Ajustável" },
      { name: "Uso recomendado", value: "Home office e estudos" },
    ],
    imageGallery: [
      {
        url: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=70",
        alt: "Suporte para notebook em mesa de trabalho",
        source: "mock",
        primary: true,
      },
    ],
    externalProductId: "mock-product-p4",
    externalCatalogId: "mock-catalog-home-office",
    dataSource: "mock",
    syncStatus: "updated",
    lastSyncedAt: today,
    dataQuality: {
      source: "mock",
      syncStatus: "updated",
      lastSyncedAt: today,
      confidence: 0.82,
    },
    updatedAt: today,
  },
  {
    id: "p5",
    name: "Mouse gamer custo-benefício",
    category: "Games",
    niche: "Setup gamer",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=70",
    shortDescription:
      "Mouse com DPI ajustável e iluminação RGB para quem está montando um setup básico.",
    idealAudience: "Gamers iniciantes e pessoas montando o primeiro setup.",
    problemSolved: "Mouse comum que não atende bem em jogos.",
    strongPoint: "Preço baixo com recursos interessantes para iniciantes.",
    attentionPoint: "Não é indicado para uso competitivo profissional.",
    opportunityScore: 7.5,
    bestMarketplace: "Shopee",
    status: "Ativo",
    featured: false,
    updatedAt: today,
  },
  {
    id: "p6",
    name: "Organizador de fraldas para cômoda",
    category: "Bebê e Família",
    niche: "Organização do bebê",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=70",
    shortDescription:
      "Divisória para cômoda que separa fraldas, lencinhos, pomada e itens de troca.",
    idealAudience: "Famílias com bebês pequenos.",
    problemSolved: "Gaveta bagunçada na hora da troca.",
    strongPoint: "Aproveita melhor o espaço da cômoda existente.",
    attentionPoint: "Medir a gaveta antes de comprar.",
    opportunityScore: 7.0,
    bestMarketplace: "Mercado Livre",
    status: "Ativo",
    featured: false,
    updatedAt: today,
  },
  {
    id: "p7",
    name: "Potes herméticos para cozinha",
    category: "Cozinha",
    niche: "Organização de despensa",
    image: "https://images.unsplash.com/photo-1584990347449-a3a8a1f50c2a?w=600&q=70",
    shortDescription: "Kit de potes com tampa de pressão para organizar mantimentos secos.",
    idealAudience: "Quem quer organizar despensa, armário e cozinha.",
    problemSolved: "Alimentos ressecando e bagunça no armário.",
    strongPoint: "Visual organizado e fechamento que conserva melhor.",
    attentionPoint: "Conferir capacidade dos potes e se o material é livre de BPA.",
    opportunityScore: 8.3,
    bestMarketplace: "Magalu",
    status: "Ativo",
    featured: true,
    trending: true,
    brand: "Genérico",
    model: "Kit potes herméticos",
    longDescription:
      "Conjunto de potes herméticos para organizar mantimentos secos, melhorar a visualização da despensa e conservar alimentos por mais tempo.",
    keywords: ["potes", "cozinha", "organização", "despensa", "mantimentos"],
    attributes: [
      { name: "Tipo", value: "Potes herméticos" },
      { name: "Uso recomendado", value: "Mantimentos secos" },
      { name: "Ambiente", value: "Cozinha e despensa" },
    ],
    imageGallery: [
      {
        url: "https://images.unsplash.com/photo-1584990347449-a3a8a1f50c2a?w=600&q=70",
        alt: "Potes organizadores para cozinha",
        source: "mock",
        primary: true,
      },
    ],
    externalProductId: "mock-product-p7",
    externalCatalogId: "mock-catalog-kitchen",
    dataSource: "mock",
    syncStatus: "updated",
    lastSyncedAt: today,
    dataQuality: {
      source: "mock",
      syncStatus: "updated",
      lastSyncedAt: today,
      confidence: 0.84,
    },
    updatedAt: today,
  },
  {
    id: "p8",
    name: "Luminária LED para setup",
    category: "Tecnologia",
    niche: "Setup e iluminação",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=70",
    shortDescription:
      "Barra de LED com controle de cor para iluminar mesa de trabalho ou setup gamer.",
    idealAudience: "Quem cria conteúdo, estuda, trabalha ou joga no computador.",
    problemSolved: "Iluminação fraca em vídeos, chamadas e lives.",
    strongPoint: "Instalação simples e várias opções de cor.",
    attentionPoint: "Não substitui iluminação profissional para gravações.",
    opportunityScore: 7.7,
    bestMarketplace: "Amazon",
    status: "Ativo",
    featured: false,
    updatedAt: today,
  },
];

interface MarketplaceVariant {
  marketplace: Marketplace;
  priceMul: number;
  rating: number;
  reviews: number;
  sales: number;
  shipping: string;
  originalLink: string;
  commission: Commission;
  availability: Availability;
  note?: string;
  titleSuffix: string;

  sellerName?: string;
  previousPriceMul?: number;
  installmentInfo?: string;
  estimatedDelivery?: string;
  condition?: ProductCondition;
  shippingCost?: number;
}

const marketplaceVariants: MarketplaceVariant[] = [
  {
    marketplace: "Amazon",
    priceMul: 1.0,
    rating: 4.6,
    reviews: 1248,
    sales: 3200,
    shipping: "Frete grátis Prime",
    originalLink: "https://amazon.com.br/exemplo",
    commission: "Média",
    availability: "Em estoque",
    titleSuffix: "Versão Prime",
    note: "Entrega rápida via Prime.",
  },
  {
    marketplace: "Mercado Livre",
    priceMul: 0.95,
    rating: 4.5,
    reviews: 3120,
    sales: 8800,
    shipping: "Mercado Envios Full",
    originalLink: "https://mercadolivre.com.br/exemplo",
    commission: "Alta",
    availability: "Em estoque",
    titleSuffix: "Full",
    note: "Muito vendido na categoria.",
  },
  {
    marketplace: "Shopee",
    priceMul: 0.88,
    rating: 4.7,
    reviews: 8420,
    sales: 15400,
    shipping: "Frete grátis acima de R$ 19",
    originalLink: "https://shopee.com.br/exemplo",
    commission: "Alta",
    availability: "Estoque baixo",
    titleSuffix: "Promo",
    note: "Preço mais baixo — combine com cupom.",
  },
  {
    marketplace: "Magalu",
    priceMul: 1.05,
    rating: 4.4,
    reviews: 540,
    sales: 1100,
    shipping: "Entrega rápida em capitais",
    originalLink: "https://magazineluiza.com.br/exemplo",
    commission: "Média",
    availability: "Em estoque",
    titleSuffix: "Magalu",
    note: "Boa opção para parcelamento.",
  },
];

const basePrices: Record<Product["id"], number> = {
  p1: 78.9,
  p2: 24.9,
  p3: 39.9,
  p4: 89.9,
  p5: 59.9,
  p6: 49.9,
  p7: 69.9,
  p8: 99.9,
};

const productMarketplaceOverrides: Partial<
  Record<Product["id"], Partial<Record<Marketplace, Partial<MarketplaceVariant>>>>
> = {
  p1: {
    Amazon: {
      rating: 4.7,
      reviews: 19914,
      sales: 900,
      commission: "Média",
      note: "Maior volume de avaliações e boa confiança para divulgação.",
    },
    "Mercado Livre": {
      rating: 4.8,
      reviews: 3250,
      sales: 1100,
      commission: "Não informada",
      note: "Boa avaliação e vendas relevantes no marketplace.",
    },
    Shopee: {
      rating: 4.6,
      reviews: 8500,
      sales: 2300,
      commission: "Baixa",
      note: "Menor preço, mas exige atenção ao vendedor e ao prazo.",
    },
  },
  p2: {
    Shopee: {
      rating: 4.8,
      reviews: 7200,
      sales: 12000,
      commission: "Alta",
      note: "Produto barato com boa saída em canais de achadinhos.",
    },
  },
  p3: {
    "Mercado Livre": {
      rating: 4.7,
      reviews: 6400,
      sales: 9700,
      commission: "Média",
      note: "Boa prova social para produto recorrente de bebê.",
    },
  },
  p4: {
    Amazon: {
      rating: 4.8,
      reviews: 5400,
      sales: 6100,
      commission: "Média",
      note: "Boa opção para público de home office.",
    },
  },
  p5: {
    Shopee: {
      rating: 4.7,
      reviews: 9300,
      sales: 18000,
      commission: "Alta",
      note: "Preço atrativo para público gamer iniciante.",
    },
  },
  p6: {
    "Mercado Livre": {
      rating: 4.6,
      reviews: 2100,
      sales: 3900,
      commission: "Média",
      note: "Boa opção para público de bebê e organização.",
    },
  },
  p7: {
    Magalu: {
      rating: 4.8,
      reviews: 1800,
      sales: 2200,
      commission: "Média",
      note: "Boa opção para quem valoriza parcelamento e loja conhecida.",
    },
  },
  p8: {
    Amazon: {
      rating: 4.5,
      reviews: 2900,
      sales: 4300,
      commission: "Média",
      note: "Boa opção para setup e iluminação de mesa.",
    },
  },
};
function getOfferScore(variant: MarketplaceVariant): number {
  const ratingScore = variant.rating * 1.4;
  const reviewsScore = Math.min(variant.reviews / 3000, 2);
  const salesScore = Math.min(variant.sales / 5000, 2);
  const commissionScore =
    variant.commission === "Alta"
      ? 1.5
      : variant.commission === "Média"
        ? 1
        : variant.commission === "Baixa"
          ? 0.5
          : 0.2;
  const availabilityScore =
    variant.availability === "Em estoque"
      ? 1
      : variant.availability === "Estoque baixo"
        ? 0.6
        : 0;

  return Number(
    (
      ratingScore +
      reviewsScore +
      salesScore +
      commissionScore +
      availabilityScore
    ).toFixed(1),
  );
}

function buildOffers(product: Product, basePrice: number): Offer[] {
  return marketplaceVariants.map((variant, index) => {
    const override = productMarketplaceOverrides[product.id]?.[variant.marketplace] ?? {};

    const merged: MarketplaceVariant = {
      ...variant,
      ...override,
    };

    const offerId = `${product.id}-o${index + 1}`;
    const marketplaceCode = marketplaceCodes[merged.marketplace];
    const price = Number((basePrice * merged.priceMul).toFixed(2));
    const previousPrice = Number(
      (basePrice * (merged.previousPriceMul ?? merged.priceMul * 1.12)).toFixed(2),
    );

    return {
      id: offerId,
      productId: product.id,
      marketplace: merged.marketplace,
      title: `${product.name} - ${merged.titleSuffix}`,
      price,
      rating: merged.rating,
      reviews: merged.reviews,
      sales: merged.sales,
      availability: merged.availability,
      shipping: merged.shipping,
      originalLink: merged.originalLink,
      affiliateLink: "",
      commission: merged.commission,
      note: merged.note,
      offerScore: getOfferScore(merged),
      bestOption: false,
      updatedAt: today,

      externalOfferId: `${marketplaceCode}-${offerId}`,
      externalProductId: product.externalProductId ?? `mock-product-${product.id}`,
      sellerName: merged.sellerName ?? sellerNames[merged.marketplace],
      sellerId: `${marketplaceCode}-seller-${product.id}`,
      storeName: merged.sellerName ?? sellerNames[merged.marketplace],
      image: product.image,
      imageGallery: product.imageGallery,
      currency: "BRL",
      previousPrice,
      installmentInfo:
        merged.installmentInfo ??
        `em até 10x de ${(price / 10).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}`,
      shippingCost: merged.shippingCost ?? 0,
      estimatedDelivery: merged.estimatedDelivery ?? "Prazo estimado não informado",
      condition: merged.condition ?? "Novo",
      stockQuantity:
        merged.availability === "Esgotado" ? 0 : merged.availability === "Estoque baixo" ? 8 : 42,
      lastCheckedAt: today,
      lastPriceChangeAt: today,
      priceHistory: [
        {
          offerId,
          marketplace: merged.marketplace,
          price: previousPrice,
          currency: "BRL",
          capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
          source: "mock",
        },
        {
          offerId,
          marketplace: merged.marketplace,
          price,
          currency: "BRL",
          capturedAt: today,
          source: "mock",
        },
      ],
      dataSource: "mock",
      syncStatus: "updated",
      lastSyncedAt: today,
      dataQuality: {
        source: "mock",
        syncStatus: "updated",
        lastSyncedAt: today,
        confidence: 0.8,
      },
    };
  });
}

export const mockOffers: Offer[] = mockProducts.flatMap((product) =>
  buildOffers(product, basePrices[product.id]),
);