import type { DataSource, Marketplace } from "../types";
import type { RawMarketplaceOffer, RawMarketplaceProduct } from "../normalizers";

export type ExternalSourceKind =
  | "marketplace"
  | "social-commerce"
  | "cross-border"
  | "affiliate-network"
  | "manual-import"
  | "unknown";

export interface ExternalSourceDefinition {
  id: string;
  name: string;
  kind: ExternalSourceKind;
  dataSource: DataSource;
  marketplace?: Marketplace;
  planned: boolean;
  notes?: string;
}

export interface AdapterResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ProductAdapter<TRawProduct> {
  sourceId: string;
  toRawMarketplaceProduct(raw: TRawProduct): AdapterResult<RawMarketplaceProduct>;
}

export interface OfferAdapter<TRawOffer> {
  sourceId: string;
  toRawMarketplaceOffer(raw: TRawOffer): AdapterResult<RawMarketplaceOffer>;
}
