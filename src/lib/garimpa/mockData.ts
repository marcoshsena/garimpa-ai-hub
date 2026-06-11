import type { Product, Offer, Availability, Commission, Marketplace } from "./types";

const today = new Date().toISOString();

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Maleta de ferramentas 129 peças",
    category: "Ferramentas",
    niche: "Reparos domésticos",
    image: "https://images.unsplash.com/photo-1581147036324-c47a03a81d48?w=600&q=70",
    shortDescription:
      "Kit completo com chaves, alicate, soquetes e maleta organizadora para pequenos reparos em casa.",
    idealAudience: "Quem mora sozinho, casais novos, fim de obra leve em casa.",
    problemSolved: "Não ter ferramenta na hora do reparo simples.",
    strongPoint: "Maleta organizadora e variedade de peças por um preço acessível.",
    attentionPoint: "Uso doméstico leve — não substitui ferramenta profissional.",
    opportunityScore: 8.6,
    bestMarketplace: "Amazon",
    status: "Ativo",
    featured: true,
    trending: true,
    updatedAt: today,
  },
  {
    id: "p2",
    name: "Organizador de pia compacto",
    category: "Casa e Organização",
    image: "https://images.unsplash.com/photo-1556909114-44e3e9399a2c?w=600&q=70",
    shortDescription: "Suporte para esponja, detergente e bucha que libera espaço na pia.",
    idealAudience: "Apartamentos pequenos e quem mora de aluguel.",
    problemSolved: "Pia bagunçada e produtos espalhados.",
    strongPoint: "Ocupa pouco espaço e tem boa avaliação.",
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
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=70",
    shortDescription: "Pacote com vários lenços umedecidos para o dia a dia do bebê.",
    idealAudience: "Mães e pais de primeira viagem que buscam economia.",
    problemSolved: "Gasto recorrente com lencinhos avulsos.",
    strongPoint: "Preço por unidade abaixo da média do mercado.",
    attentionPoint: "Confira sempre composição e dermatologicamente testado.",
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
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=70",
    shortDescription:
      "Suporte dobrável com regulagem de altura para melhorar postura no home office.",
    idealAudience: "Quem trabalha em home office e sente dor no pescoço.",
    problemSolved: "Postura ruim e calor no notebook.",
    strongPoint: "Dobrável, leve e melhora a ventilação.",
    attentionPoint: "Confira o tamanho compatível com seu notebook.",
    opportunityScore: 8.1,
    bestMarketplace: "Amazon",
    status: "Ativo",
    featured: true,
    trending: true,
    updatedAt: today,
  },
  {
    id: "p5",
    name: "Mouse gamer custo-benefício",
    category: "Games",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=70",
    shortDescription: "Mouse com DPI ajustável e iluminação RGB para quem está começando.",
    idealAudience: "Gamers iniciantes e setup básico.",
    problemSolved: "Mouse comum que trava em jogos.",
    strongPoint: "Preço baixo com sensor decente para o público iniciante.",
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
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=70",
    shortDescription: "Divisória para cômoda que separa fraldas, lencinhos e pomada.",
    idealAudience: "Famílias com bebês pequenos.",
    problemSolved: "Gaveta bagunçada na hora da troca.",
    strongPoint: "Aproveita o espaço da cômoda existente.",
    attentionPoint: "Mede a gaveta antes de comprar.",
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
    image: "https://images.unsplash.com/photo-1584990347449-a3a8a1f50c2a?w=600&q=70",
    shortDescription: "Kit de potes com tampa de pressão para mantimentos secos.",
    idealAudience: "Quem quer organizar despensa e armário.",
    problemSolved: "Alimentos ressecando e bagunça no armário.",
    strongPoint: "Visual organizado e fechamento que conserva melhor.",
    attentionPoint: "Confira se o kit é livre de BPA.",
    opportunityScore: 8.3,
    bestMarketplace: "Magalu",
    status: "Ativo",
    featured: true,
    trending: true,
    updatedAt: today,
  },
  {
    id: "p8",
    name: "Luminária LED para setup",
    category: "Tecnologia",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=70",
    shortDescription: "Barra de LED com controle de cor para iluminar mesa de trabalho.",
    idealAudience: "Quem cria conteúdo e quer melhorar o setup.",
    problemSolved: "Iluminação fraca em vídeos e lives.",
    strongPoint: "Instalação simples e várias cores.",
    attentionPoint: "Não substitui iluminação profissional para vídeo.",
    opportunityScore: 7.7,
    bestMarketplace: "Amazon",
    status: "Ativo",
    featured: false,
    updatedAt: today,
  },
];

// Variação realista por marketplace para gerar ofertas diferentes do mesmo produto base.
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
}

const variantPool: Record<string, MarketplaceVariant[]> = {
  default: [
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
      note: "Boa para parcelamento.",
    },
  ],
};

function buildOffers(productId: string, base: number): Offer[] {
  const variants = variantPool.default;
  return variants.map((v, i) => ({
    id: `${productId}-o${i + 1}`,
    productId,
    marketplace: v.marketplace,
    title: `${productId.toUpperCase()} - ${v.titleSuffix}`,
    price: +(base * v.priceMul).toFixed(2),
    rating: v.rating,
    reviews: v.reviews,
    sales: v.sales,
    availability: v.availability,
    shipping: v.shipping,
    originalLink: v.originalLink,
    affiliateLink: "",
    commission: v.commission,
    note: v.note,
    // `offerScore` e `bestOption` são apenas dicas iniciais — a ranking real
    // é calculada em tempo de execução por `enrichOffers` (lib/garimpa/ranking).
    offerScore: 7.5,
    bestOption: false,
    updatedAt: today,
  }));
}

export const mockOffers: Offer[] = [
  ...buildOffers("p1", 78.9),
  ...buildOffers("p2", 24.9),
  ...buildOffers("p3", 39.9),
  ...buildOffers("p4", 89.9),
  ...buildOffers("p5", 59.9),
  ...buildOffers("p6", 49.9),
  ...buildOffers("p7", 69.9),
  ...buildOffers("p8", 99.9),
];
