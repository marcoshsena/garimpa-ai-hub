import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/garimpa/AppShell";
import {
  useProduct,
  useEnrichedProductOffers,
  toggleSaved,
  useSaved,
  isSaved,
} from "@/lib/garimpa/store";
import { bestOfferOf, type EnrichedOffer } from "@/lib/garimpa/ranking";
import {
  CategoryBadge,
  CommissionBadge,
  MarketplaceBadge,
  ScoreBadge,
} from "@/components/garimpa/Badges";
import { CopyButton } from "@/components/garimpa/CopyButton";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Megaphone,
  Star,
  Trophy,
} from "lucide-react";
import { MARKETPLACES, type Commission, type Marketplace } from "@/lib/garimpa/types";
import { cn } from "@/lib/utils";
import { getProductDiagnosis } from "@/lib/garimpa/recommendations";

export const Route = createFileRoute("/produto/$id/comparativo")({
  head: () => ({ meta: [{ title: "Comparativo — Garimpa AI" }] }),
  component: Compare,
});

const COMMISSION_RANK: Record<Commission, number> = {
  Alta: 3,
  Média: 2,
  Baixa: 1,
  "Não informada": 0,
};

const AVAIL_RANK: Record<string, number> = {
  "Em estoque": 3,
  "Estoque baixo": 2,
  Esgotado: 0,
};

type WinnerKey =
  | "price"
  | "rating"
  | "social"
  | "shipping"
  | "commission"
  | "best";

const WINNER_LABEL: Record<WinnerKey, string> = {
  price: "Melhor preço",
  rating: "Mais bem avaliado",
  social: "Melhor prova social",
  shipping: "Melhor entrega",
  commission: "Melhor comissão",
  best: "Melhor opção geral",
};

function Compare() {
  const { id } = Route.useParams();
  const product = useProduct(id);
  const allOffers = useEnrichedProductOffers(id);
  const saved = useSaved();
  const fav = product ? isSaved(saved, product.id) : false;

  const [selected, setSelected] = useState<Marketplace[]>(MARKETPLACES);

  const offerByMarketplace = useMemo(() => {
    const map = new Map<Marketplace, EnrichedOffer | undefined>();
    for (const m of MARKETPLACES) {
      map.set(m, allOffers.find((o) => o.marketplace === m));
    }
    return map;
  }, [allOffers]);

  const visibleMarketplaces = useMemo(
    () => MARKETPLACES.filter((m) => selected.includes(m)),
    [selected],
  );

  const visibleOffers = useMemo(
    () =>
      visibleMarketplaces
        .map((m) => offerByMarketplace.get(m))
        .filter((o): o is EnrichedOffer => Boolean(o)),
    [visibleMarketplaces, offerByMarketplace],
  );

  const winners = useMemo(() => computeWinners(visibleOffers), [visibleOffers]);
  const bestOverall = useMemo(() => bestOfferOf(visibleOffers), [visibleOffers]);

  if (!product) {
    return (
      <AppShell>
        <div className="rounded-xl border bg-card p-12 text-center">
          <p className="font-medium">Produto não encontrado.</p>
          <Button asChild className="mt-4">
            <Link to="/dashboard">Voltar ao dashboard</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const diagnosis = bestOverall ? getProductDiagnosis(product, bestOverall, allOffers) : null;

  const toggle = (m: Marketplace) =>
    setSelected((cur) =>
      cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m],
    );

  return (
    <AppShell>
      <div className="mb-3 flex items-center gap-2">
        <Button asChild size="sm" variant="ghost">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4" /> Voltar para produtos
          </Link>
        </Button>
      </div>

      {/* CABEÇALHO RESUMIDO */}
      <section className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[140px_1fr_auto]">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-square w-full max-w-[140px] rounded-lg border object-cover"
          />
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge>{product.category}</CategoryBadge>

              {bestOverall ? (
                <>
                  <ScoreBadge score={bestOverall.computedScore} />
                  <MarketplaceBadge name={bestOverall.marketplace} />
                </>
              ) : (
                <ScoreBadge score={product.opportunityScore} />
              )}
              {product.trending && (
                <span className="inline-flex items-center rounded-md border border-brand-orange/40 bg-brand-orange/10 px-2 py-0.5 text-xs font-semibold text-brand-orange">
                  Em alta
                </span>
              )}
            </div>
            <h1 className="text-xl font-semibold text-brand-navy sm:text-2xl">{product.name}</h1>
            <p className="text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {bestOverall && (
                <span>
                  Melhor oferta{" "}
                  <span className="font-semibold text-brand-navy">
                    {bestOverall.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </span>
              )}

              {bestOverall && (
                <span>
                  Melhor plataforma:{" "}
                  <strong className="text-brand-navy">{bestOverall.marketplace}</strong>
                </span>
              )}
              <span>Atualizado em {new Date(product.updatedAt).toLocaleDateString("pt-BR")}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
            <Button
              asChild
              size="sm"
              className="bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange/90"
            >
              <Link
                to="/gerador"
                search={{
                  produto: product.id,
                  ...(bestOverall ? { oferta: bestOverall.id } : {}),
                }}
              >
                <Megaphone className="h-4 w-4" /> Gerar anúncio
              </Link>
            </Button>
            <Button
              size="sm"
              variant={fav ? "secondary" : "outline"}
              onClick={() => toggleSaved(product.id)}
            >
              {fav ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              {fav ? "Salvo" : "Salvar produto"}
            </Button>
          </div>
        </div>

        <dl className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <MiniInfo label="Público ideal" value={product.idealAudience} />
          <MiniInfo label="Problema que resolve" value={product.problemSolved} />
          <MiniInfo label="Ponto forte" value={product.strongPoint} tone="success" />
          <MiniInfo label="Ponto de atenção" value={product.attentionPoint} tone="warning" />
        </dl>
      </section>

      {/* SELETOR DE MARKETPLACES */}
      <section className="mt-5 rounded-xl border bg-card p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-brand-navy">
            Selecionar marketplaces para comparar
          </h2>
          <span className="text-xs text-muted-foreground">
            {selected.length}/{MARKETPLACES.length} selecionados
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {MARKETPLACES.map((m) => {
            const active = selected.includes(m);
            const has = Boolean(offerByMarketplace.get(m));
            return (
              <button
                key={m}
                type="button"
                onClick={() => toggle(m)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  active
                    ? "border-brand-navy bg-brand-navy text-white"
                    : "border-border bg-card text-muted-foreground hover:bg-muted",
                )}
              >
                <span>{m}</span>
                {!has && (
                  <span
                    className={cn(
                      "rounded px-1 text-[10px]",
                      active ? "bg-white/15 text-white/80" : "bg-muted text-muted-foreground",
                    )}
                  >
                    sem oferta
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* COMPARATIVO VERTICAL */}
      <section className="mt-5">
        <h2 className="mb-2 text-lg font-semibold text-brand-navy">
          Comparativo entre marketplaces
        </h2>
        {visibleMarketplaces.length === 0 ? (
          <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
            Selecione ao menos um marketplace para comparar.
          </div>
        ) : (
          <VerticalComparison
            productId={product.id}
            marketplaces={visibleMarketplaces}
            offerByMarketplace={offerByMarketplace}
            winners={winners}
          />
        )}

        <p className="mt-3 text-xs text-muted-foreground">
          Preço, disponibilidade, frete e comissão podem mudar. Revise os dados antes de divulgar.
        </p>
      </section>

      {/* RESUMO INTELIGENTE */}
      {visibleOffers.length > 0 && (
        <section className="mt-5 rounded-xl border border-brand-orange/30 bg-brand-orange/5 p-4 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-brand-navy">
            <Trophy className="h-4 w-4 text-brand-orange" /> Resumo da análise
          </h2>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <SummaryItem
              label="Melhor opção sugerida"
              offer={bestOverall}
              offerByMarketplace={offerByMarketplace}
              winnerId={bestOverall?.id}
            />
            <SummaryItem
              label="Melhor preço"
              winnerId={winners.price}
              offerByMarketplace={offerByMarketplace}
              format={(o) =>
                o.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }
            />
            <SummaryItem
              label="Melhor avaliação"
              winnerId={winners.rating}
              offerByMarketplace={offerByMarketplace}
              format={(o) => `${o.rating.toFixed(1)} ★`}
            />
            <SummaryItem
              label="Melhor entrega"
              winnerId={winners.shipping}
              offerByMarketplace={offerByMarketplace}
              format={(o) => o.shipping || "—"}
            />
            <SummaryItem
              label="Melhor comissão"
              winnerId={winners.commission}
              offerByMarketplace={offerByMarketplace}
              format={(o) => o.commission}
            />
          </div>

          {bestOverall && (
            <p className="mt-4 rounded-md border bg-card/60 p-3 text-sm text-brand-navy">
              <strong>Melhor opção sugerida: {bestOverall.marketplace}.</strong>{" "}
              {bestOverall.reason
                ? `Motivos: ${bestOverall.reason}. `
                : "Apresenta o melhor equilíbrio entre os critérios analisados. "}
              <span className="text-muted-foreground">
                Esta é uma sugestão automática — você decide qual oferta divulgar com base nos
                dados.
              </span>
            </p>
          )}

          {diagnosis && (
            <div className="mt-4 rounded-xl border bg-card p-4">
              <div className="mb-3">
                <h3 className="text-base font-semibold text-brand-navy">Diagnóstico Garimpa AI</h3>
                <p className="text-sm text-muted-foreground">
                  Uma leitura rápida sobre o potencial desta oferta para divulgação.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Potencial
                  </div>
                  <div className="mt-1 text-sm font-semibold text-brand-navy">
                    {diagnosis.potential}
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Potencial visual
                  </div>
                  <div className="mt-1 text-sm font-semibold text-brand-navy">
                    {diagnosis.visualPotential}
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Risco de divulgação
                  </div>
                  <div className="mt-1 text-sm font-semibold text-brand-navy">
                    {diagnosis.disclosureRisk}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div>
                  <h4 className="text-sm font-semibold text-brand-navy">
                    Por que essa oferta foi sugerida?
                  </h4>

                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {diagnosis.reasons.map((reason) => (
                      <li key={reason}>✓ {reason}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-brand-navy">Canais recomendados</h4>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {diagnosis.bestChannels.map((channel) => (
                      <span
                        key={channel}
                        className="rounded-full border bg-muted px-2.5 py-1 text-xs font-medium"
                      >
                        {channel}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-brand-navy">Abordagem sugerida</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{diagnosis.bestApproach}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold text-brand-navy">Tags inteligentes</h4>

                <div className="mt-2 flex flex-wrap gap-2">
                  {diagnosis.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-brand-orange/10 px-2.5 py-1 text-xs font-medium text-brand-navy"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {bestOverall && (
              <Button
                asChild
                className="bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange/90"
              >
                <Link to="/gerador" search={{ produto: product.id, oferta: bestOverall.id }}>
                  <Megaphone className="h-4 w-4" /> Gerar anúncio da melhor opção
                </Link>
              </Button>
            )}

            <Button variant={fav ? "secondary" : "outline"} onClick={() => toggleSaved(product.id)}>
              {fav ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              {fav ? "Salvo" : "Salvar produto"}
            </Button>

            <Button asChild variant="ghost">
              <Link to="/dashboard">Voltar para produtos</Link>
            </Button>
          </div>
        </section>
      )}
    </AppShell>
  );
}

function computeWinners(offers: EnrichedOffer[]) {
  if (offers.length === 0) {
    return {
      price: null,
      rating: null,
      social: null,
      shipping: null,
      commission: null,
      best: null,
    } as Record<WinnerKey, string | null>;
  }
  const inStock = offers.filter((o) => o.availability !== "Esgotado");
  const pricePool = inStock.length ? inStock : offers;
  const price = pricePool.reduce((a, b) => (a.price <= b.price ? a : b));
  const rating = offers.reduce((a, b) => (a.rating >= b.rating ? a : b));
  const social = offers.reduce((a, b) =>
    (a.sales ?? 0) + a.reviews >= (b.sales ?? 0) + b.reviews ? a : b,
  );
  const shipping = offers.reduce((a, b) =>
    AVAIL_RANK[a.availability] >= AVAIL_RANK[b.availability] ? a : b,
  );
  const commission = offers.reduce((a, b) =>
    COMMISSION_RANK[a.commission] >= COMMISSION_RANK[b.commission] ? a : b,
  );
  const best = bestOfferOf(offers);
  return {
    price: price.id,
    rating: rating.id,
    social: social.id,
    shipping: shipping.id,
    commission: commission.id,
    best: best?.id ?? null,
  };
}

function formatOptionalPrice(value?: number, currency = "BRL") {
  if (typeof value !== "number") return "—";

  const safeCurrency = currency === "unknown" ? "BRL" : currency;

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: safeCurrency,
  });
}

function formatOptionalDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDataSource(value?: string) {
  const labels: Record<string, string> = {
    mock: "Mock",
    manual: "Manual",
    api: "API",
    import: "Importação",
    affiliate: "Afiliado",
    unknown: "Desconhecida",
  };

  return value ? (labels[value] ?? value) : "—";
}

function formatSyncStatus(value?: string) {
  const labels: Record<string, string> = {
    updated: "Atualizado",
    pending: "Pendente",
    error: "Erro",
    manual: "Manual",
    stale: "Desatualizado",
  };

  return value ? (labels[value] ?? value) : "—";
}

function OfferMetadata({ offer }: { offer: EnrichedOffer }) {
  const metadata = [
    {
      label: "Vendedor",
      value: offer.sellerName || offer.storeName || "—",
    },
    {
      label: "Preço anterior",
      value: formatOptionalPrice(offer.previousPrice, offer.currency),
    },
    {
      label: "Parcelamento",
      value: offer.installmentInfo || "—",
    },
    {
      label: "Atualizado em",
      value: formatOptionalDate(offer.lastCheckedAt ?? offer.lastSyncedAt),
    },
  ];

  return (
    <div className="space-y-2 text-xs">
      {metadata.map((item) => (
        <div key={item.label}>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {item.label}
          </div>
          <div className="mt-0.5 line-clamp-2 font-medium text-brand-navy">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function VerticalComparison({
  productId,
  marketplaces,
  offerByMarketplace,
  winners,
}: {
  productId: string;
  marketplaces: Marketplace[];
  offerByMarketplace: Map<Marketplace, EnrichedOffer | undefined>;
  winners: Record<WinnerKey, string | null>;
}) {
  const cols = marketplaces.length;
  const gridTemplate = `200px repeat(${cols}, minmax(220px, 1fr))`;

  const rows: {
    label: string;
    render: (o: EnrichedOffer | undefined) => React.ReactNode;
    winner?: WinnerKey;
  }[] = [
    {
      label: "Título da oferta",
      render: (o) =>
        o ? (
          <div className="space-y-1">
            <div className="text-sm font-medium text-brand-navy line-clamp-2">{o.title}</div>
            {o.note && <div className="text-xs text-muted-foreground">{o.note}</div>}
          </div>
        ) : (
          <Empty />
        ),
    },
    {
      label: "Preço",
      winner: "price",
      render: (o) =>
        o ? (
          <span className="text-base font-semibold text-brand-navy">
            {o.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
        ) : (
          <Empty />
        ),
    },
    {
      label: "Avaliação",
      winner: "rating",
      render: (o) =>
        o ? (
          <div className="inline-flex items-center gap-1 text-sm">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            <span className="font-medium">{o.rating.toFixed(1)}</span>
          </div>
        ) : (
          <Empty />
        ),
    },
    {
      label: "Vendidos / avaliações",
      winner: "social",
      render: (o) =>
        o ? (
          <div className="text-xs text-muted-foreground">
            {o.sales ? <div>~{o.sales.toLocaleString("pt-BR")} vendas</div> : null}
            <div>{o.reviews.toLocaleString("pt-BR")} avaliações</div>
          </div>
        ) : (
          <Empty />
        ),
    },
    {
      label: "Frete / entrega",
      winner: "shipping",
      render: (o) =>
        o ? (
          <div className="text-xs">
            <div className="font-medium text-brand-navy">{o.availability}</div>
            <div className="text-muted-foreground">{o.shipping || "—"}</div>
          </div>
        ) : (
          <Empty />
        ),
    },
    {
      label: "Comissão provável",
      winner: "commission",
      render: (o) => (o ? <CommissionBadge value={o.commission} /> : <Empty />),
    },
    {
      label: "Nota da oferta",
      render: (o) => (o ? <ScoreBadge score={o.computedScore} /> : <Empty />),
    },
    {
      label: "Melhor opção?",
      render: (o) =>
        o ? (
          winners.best === o.id ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-brand-orange/15 px-2 py-1 text-xs font-semibold text-brand-orange">
              <Trophy className="h-3 w-3" /> Sim
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Não</span>
          )
        ) : (
          <Empty />
        ),
    },
    {
      label: "Resumo da oferta",
      render: (o) => (o ? <OfferMetadata offer={o} /> : <Empty />),
    },
    {
      label: "Links e ações",
      render: (o) =>
        o ? (
          <div className="flex flex-col gap-1.5">
            <Button asChild size="sm" variant="outline" className="justify-start">
              <a href={o.originalLink} target="_blank" rel="noreferrer">
                <ExternalLink className="h-3.5 w-3.5" /> Abrir
              </a>
            </Button>
            <CopyButton
              value={o.affiliateLink || o.originalLink}
              label="Copiar link afiliado"
              className="justify-start"
            />
            <Button
              asChild
              size="sm"
              className="justify-start bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange/90"
            >
              <Link to="/gerador" search={{ produto: productId, oferta: o.id }}>
                <Megaphone className="h-3.5 w-3.5" /> Gerar anúncio
              </Link>
            </Button>
          </div>
        ) : (
          <Empty />
        ),
    },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
      <div className="min-w-[760px]">
        {/* Header row: marketplace columns */}
        <div
          className="grid items-stretch border-b bg-muted/40"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          <div className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Atributo
          </div>
          {marketplaces.map((m) => {
            const o = offerByMarketplace.get(m);
            const isBest = o && winners.best === o.id;
            return (
              <div
                key={m}
                className={cn(
                  "border-l px-3 py-3",
                  isBest && "bg-brand-orange/5",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <MarketplaceBadge name={m} />
                  {isBest && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-brand-orange px-1.5 py-0.5 text-[10px] font-semibold text-brand-orange-foreground">
                      <Trophy className="h-3 w-3" /> Melhor
                    </span>
                  )}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {o ? o.marketplace : "Sem oferta cadastrada"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Attribute rows */}
        {rows.map((row, idx) => (
          <div
            key={row.label}
            className={cn(
              "grid items-stretch border-b last:border-b-0",
              idx % 2 === 1 && "bg-muted/20",
            )}
            style={{ gridTemplateColumns: gridTemplate }}
          >
            <div className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {row.label}
            </div>
            {marketplaces.map((m) => {
              const o = offerByMarketplace.get(m);
              const isWinner =
                row.winner && o && winners[row.winner] === o.id;
              return (
                <div
                  key={m}
                  className={cn(
                    "border-l px-3 py-3",
                    isWinner && "bg-success/10",
                  )}
                >
                  {row.render(o)}
                  {isWinner && row.winner && (
                    <div className="mt-1 inline-flex items-center rounded bg-success/20 px-1.5 py-0.5 text-[10px] font-semibold text-[oklch(0.4_0.12_150)]">
                      {WINNER_LABEL[row.winner]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function Empty() {
  return (
    <span className="text-xs italic text-muted-foreground">
      Sem oferta cadastrada
    </span>
  );
}

function MiniInfo({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success" | "warning";
}) {
  const cls =
    tone === "success"
      ? "border-success/40 bg-success/5"
      : tone === "warning"
      ? "border-warning/40 bg-warning/10"
      : "bg-muted/30";
  return (
    <div className={cn("rounded-md border p-2", cls)}>
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-xs">{value || "—"}</dd>
    </div>
  );
}

function SummaryItem({
  label,
  offer,
  winnerId,
  offerByMarketplace,
  format,
}: {
  label: string;
  offer?: EnrichedOffer;
  winnerId?: string | null;
  offerByMarketplace: Map<Marketplace, EnrichedOffer | undefined>;
  format?: (o: EnrichedOffer) => string;
}) {
  const resolved =
    offer ??
    (winnerId
      ? Array.from(offerByMarketplace.values()).find((o) => o?.id === winnerId)
      : undefined);
  return (
    <div className="rounded-md border bg-card p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      {resolved ? (
        <div className="mt-1 space-y-1">
          <MarketplaceBadge name={resolved.marketplace} />
          {format && (
            <div className="text-xs font-medium text-brand-navy">
              {format(resolved)}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-1 text-xs text-muted-foreground">—</div>
      )}
    </div>
  );
}
