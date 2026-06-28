import type { ExternalSourceDefinition } from "./adapterTypes";

export const EXTERNAL_SOURCES: ExternalSourceDefinition[] = [
  {
    id: "mercado-livre",
    name: "Mercado Livre",
    kind: "marketplace",
    dataSource: "api",
    marketplace: "Mercado Livre",
    planned: false,
    notes: "Primeira API planejada para integração real.",
  },
  {
    id: "amazon",
    name: "Amazon",
    kind: "marketplace",
    dataSource: "api",
    marketplace: "Amazon",
    planned: true,
    notes: "Integração futura via fonte autorizada.",
  },
  {
    id: "shopee",
    name: "Shopee",
    kind: "marketplace",
    dataSource: "api",
    marketplace: "Shopee",
    planned: true,
  },
  {
    id: "magalu",
    name: "Magalu",
    kind: "marketplace",
    dataSource: "api",
    marketplace: "Magalu",
    planned: true,
  },
  {
    id: "tiktok-shop",
    name: "TikTok Shop",
    kind: "social-commerce",
    dataSource: "api",
    planned: true,
    notes: "Fonte futura de social commerce.",
  },
  {
    id: "pinterest-shop",
    name: "Pinterest Shop",
    kind: "social-commerce",
    dataSource: "api",
    planned: true,
    notes: "Fonte futura voltada a descoberta visual de produtos.",
  },
  {
    id: "aliexpress",
    name: "AliExpress",
    kind: "cross-border",
    dataSource: "api",
    planned: true,
  },
  {
    id: "temu",
    name: "Temu",
    kind: "cross-border",
    dataSource: "api",
    planned: true,
  },
  {
    id: "shein",
    name: "Shein",
    kind: "cross-border",
    dataSource: "api",
    planned: true,
  },
  {
    id: "manual-import",
    name: "Importação manual",
    kind: "manual-import",
    dataSource: "import",
    planned: true,
    notes: "Importação futura via CSV, planilha ou formulário.",
  },
];

export const ACTIVE_EXTERNAL_SOURCES = EXTERNAL_SOURCES.filter((source) => !source.planned);

export const PLANNED_EXTERNAL_SOURCES = EXTERNAL_SOURCES.filter((source) => source.planned);
