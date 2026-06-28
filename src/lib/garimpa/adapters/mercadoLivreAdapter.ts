import type { RawMarketplaceOffer } from "../normalizers";
import type { OfferAdapter } from "./adapterTypes";

export interface MercadoLivreRawOffer {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  permalink: string;
  thumbnail?: string;
  condition?: string;
  available_quantity?: number;
  sold_quantity?: number;
  seller?: {
    id?: number | string;
    nickname?: string;
  };
  shipping?: {
    free_shipping?: boolean;
    logistic_type?: string;
  };
  attributes?: Array<{
    id?: string;
    name?: string;
    value_name?: string;
  }>;
}

function normalizeMercadoLivreCondition(value?: string) {
  if (value === "new") return "Novo";
  if (value === "used") return "Usado";
  if (value === "refurbished") return "Recondicionado";

  return "Não informado";
}

function getMercadoLivreAvailability(raw: MercadoLivreRawOffer) {
  if (typeof raw.available_quantity === "number") {
    if (raw.available_quantity <= 0) return "Esgotado";
    if (raw.available_quantity <= 10) return "Estoque baixo";
  }

  return "Em estoque";
}

function getMercadoLivreShipping(raw: MercadoLivreRawOffer) {
  if (raw.shipping?.free_shipping) return "Frete grátis";
  if (raw.shipping?.logistic_type) return `Entrega via ${raw.shipping.logistic_type}`;

  return "Não informado";
}

export const mercadoLivreOfferAdapter: OfferAdapter<MercadoLivreRawOffer> = {
  sourceId: "mercado-livre",

  toRawMarketplaceOffer(raw) {
    try {
      if (!raw.id || !raw.title || typeof raw.price !== "number" || !raw.permalink) {
        return {
          success: false,
          error: "Oferta do Mercado Livre com dados obrigatórios ausentes.",
        };
      }

      const productId = `ml-${raw.id}`;

      const data: RawMarketplaceOffer = {
        source: "api",
        marketplace: "Mercado Livre",
        externalOfferId: raw.id,
        externalProductId: raw.id,
        productId,
        title: raw.title,
        price: raw.price,
        previousPrice: raw.original_price,
        currency: "BRL",
        rating: 0,
        reviews: 0,
        sales: raw.sold_quantity,
        availability: getMercadoLivreAvailability(raw),
        shipping: getMercadoLivreShipping(raw),
        sellerName: raw.seller?.nickname,
        sellerId: raw.seller?.id ? String(raw.seller.id) : undefined,
        storeName: raw.seller?.nickname,
        originalLink: raw.permalink,
        affiliateLink: "",
        image: raw.thumbnail,
        commission: "Não informada",
        condition: normalizeMercadoLivreCondition(raw.condition),
        capturedAt: new Date().toISOString(),
        note: "Dados normalizados a partir de estrutura simulada do Mercado Livre.",
      };

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao adaptar oferta do Mercado Livre.",
      };
    }
  },
};
