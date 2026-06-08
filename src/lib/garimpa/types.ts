export type Marketplace = "Amazon" | "Mercado Livre" | "Shopee" | "Magalu";

export type Commission = "Alta" | "Média" | "Baixa" | "Não informada";

export type ProductStatus = "Ativo" | "Rascunho" | "Pausado";

export const CATEGORIES = [
  "Casa e Organização",
  "Bebê e Família",
  "Tecnologia",
  "Games",
  "Beleza e Cuidados",
  "Ferramentas",
  "Cozinha",
  "Achados até R$ 50",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const MARKETPLACES: Marketplace[] = [
  "Amazon",
  "Mercado Livre",
  "Shopee",
  "Magalu",
];

export interface Offer {
  id: string;
  productId: string;
  marketplace: Marketplace;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  shipping: string;
  originalLink: string;
  affiliateLink: string;
  commission: Commission;
  note?: string;
  offerScore: number;
  bestOption: boolean;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  niche?: string;
  image: string;
  shortDescription: string;
  idealAudience: string;
  problemSolved: string;
  strongPoint: string;
  attentionPoint: string;
  opportunityScore: number;
  bestMarketplace: Marketplace;
  status: ProductStatus;
  featured: boolean;
  updatedAt: string;
}
