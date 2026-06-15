export type Marketplace = "Amazon" | "Mercado Livre" | "Shopee" | "Magalu";

export type Commission = "Alta" | "Média" | "Baixa" | "Não informada";

export type ProductStatus = "Ativo" | "Rascunho" | "Pausado";

export type Availability = "Em estoque" | "Estoque baixo" | "Esgotado";

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

export const MARKETPLACES: Marketplace[] = ["Amazon", "Mercado Livre", "Shopee", "Magalu"];

export const AVAILABILITIES: Availability[] = ["Em estoque", "Estoque baixo", "Esgotado"];

export const COMMISSIONS: Commission[] = ["Alta", "Média", "Baixa", "Não informada"];

export const OPPORTUNITY_TYPES = [
  "Melhores oportunidades",
  "Mais vendidos",
  "Melhor avaliados",
  "Melhor custo-benefício",
  "Maior comissão estimada",
  "Produtos em alta",
] as const;

export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number];

export interface Product {
  /**
   * Produto base.
   *
   * Exemplo:
   * "Maleta de ferramentas 129 peças"
   *
   * O produto base representa a ideia central do item.
   * As ofertas reais por marketplace ficam em `Offer`.
   */
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
  status: ProductStatus;
  featured: boolean;
  trending?: boolean;
  updatedAt: string;

  /**
   * Campo legado do mock.
   *
   * Evitar usar esse campo para definir a tag principal do card.
   * A melhor oferta deve ser calculada em runtime a partir das ofertas filtradas.
   */
  bestMarketplace?: Marketplace;
}

export interface Offer {
  /**
   * Oferta específica de um produto em um marketplace.
   *
   * Exemplo:
   * Produto base: Maleta de ferramentas 129 peças
   * Oferta 1: Amazon
   * Oferta 2: Mercado Livre
   * Oferta 3: Shopee
   */
  id: string;
  productId: string;
  marketplace: Marketplace;
  title: string;
  price: number;
  rating: number;
  reviews: number;

  /**
   * Vendas aproximadas no marketplace.
   * Em APIs reais, esse dado pode não existir em todos os marketplaces.
   */
  sales?: number;

  availability: Availability;
  shipping: string;
  originalLink: string;
  affiliateLink: string;
  commission: Commission;
  note?: string;

  /**
   * Score informado no mock.
   * A pontuação final pode ser recalculada em runtime pelo ranking.ts.
   */
  offerScore: number;

  /**
   * Indicação mockada.
   * A melhor opção real deve ser calculada em runtime.
   */
  bestOption: boolean;

  updatedAt: string;
}
