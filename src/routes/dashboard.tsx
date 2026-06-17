import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/garimpa/AppShell";
import { ProductCard } from "@/components/garimpa/ProductCard";
import {
  ProductFilters,
  defaultFilters,
  type Filters,
} from "@/components/garimpa/ProductFilters";
import { MarketplaceBadge } from "@/components/garimpa/Badges";
import {
  useEnrichedOffers,
  useProducts,
  useActiveMarketplaces,
  toggleActiveMarketplace,
  setActiveMarketplaces,
} from "@/lib/garimpa/store";
import { MARKETPLACES, type Marketplace } from "@/lib/garimpa/types";
import { rankProducts, bestOfferOf, groupByProduct } from "@/lib/garimpa/ranking";
import { cn } from "@/lib/utils";
import { Package, Store, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Garimpa AI" },
      {
        name: "description",
        content: "Central de oportunidades: produtos sugeridos para sua curadoria.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const products = useProducts();
  const enriched = useEnrichedOffers();
  const active = useActiveMarketplaces();
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const visibleOffers = useMemo(
    () => (active.length ? enriched.filter((o) => active.includes(o.marketplace)) : enriched),
    [enriched, active],
  );

  const offerGroups = useMemo(() => groupByProduct(visibleOffers), [visibleOffers]);

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      if (p.status !== "Ativo") return false;
      if (filters.query && !p.name.toLowerCase().includes(filters.query.toLowerCase())) return false;
      if (filters.category !== "all" && p.category !== filters.category) return false;

      const peers = offerGroups.get(p.id) ?? [];
      if (!peers.length) return false;

      if (filters.minScore > 0) {
        const best = bestOfferOf(peers);
        if (!best || best.computedScore < filters.minScore) return false;
      }
      if (filters.commission !== "all") {
        if (!peers.some((o) => o.commission === filters.commission)) return false;
      }
      return true;
    });

    return rankProducts(list, visibleOffers, filters.opportunityType);
  }, [products, offerGroups, visibleOffers, filters]);

  // Summary stats
  const stats = useMemo(() => {
    const totalOpps = filtered.length;
    const bestList = filtered
      .map((p) => bestOfferOf(offerGroups.get(p.id) ?? []))
      .filter((o): o is NonNullable<typeof o> => Boolean(o));
    const bestScore = bestList.length
      ? Math.max(...bestList.map((o) => o.computedScore))
      : 0;
    const topSocial = bestList.length
      ? Math.max(...bestList.map((o) => o.reviews ?? 0))
      : 0;
    const activeCount = active.length;
    return { totalOpps, bestScore, topSocial, activeCount };
  }, [filtered, offerGroups, active]);

  const singleMode = active.length === 1;

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy sm:text-3xl">
            Central de oportunidades
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {singleMode
              ? `Mostrando oportunidades em ${active[0]}.`
              : "Produtos sugeridos a partir dos marketplaces selecionados."}
          </p>
        </div>
        <div className="rounded-md border border-warning/40 bg-warning/10 px-2.5 py-1 text-[11px] font-medium text-[oklch(0.4_0.08_80)]">
          Dados simulados — MVP
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Package}
          label="Produtos encontrados"
          value={String(stats.totalOpps)}
          hint="após filtros aplicados"
        />
        <StatCard
          icon={Store}
          label="Marketplaces ativos"
          value={`${stats.activeCount}/${MARKETPLACES.length}`}
          hint="selecionados para curadoria"
          tone="navy"
        />
        <StatCard
          icon={Sparkles}
          label="Melhor nota"
          value={stats.bestScore ? stats.bestScore.toFixed(1) : "—"}
          hint="entre as oportunidades"
          tone="orange"
        />
        <StatCard
          icon={Users}
          label="Maior prova social"
          value={
            stats.topSocial >= 1000
              ? `${(stats.topSocial / 1000).toFixed(1)}k`
              : String(stats.topSocial || "—")
          }
          hint="avaliações no top produto"
          tone="success"
        />
      </div>

      <MarketplaceSelector active={active} />

      <div className="mb-4">
        <ProductFilters value={filters} onChange={setFilters} />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <div>
          <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "produto encontrado" : "produtos encontrados"} ·{" "}
          ordenado por{" "}
          <span className="font-medium text-foreground">
            {filters.opportunityType.toLowerCase()}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <span>Ativos:</span>
          {active.length === 0 ? (
            <span className="italic">nenhum selecionado</span>
          ) : (
            active.map((m) => <MarketplaceBadge key={m} name={m} />)
          )}
        </div>
      </div>

      {active.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center">
          <p className="text-sm font-medium">Selecione ao menos um marketplace</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Use os chips acima para escolher onde você quer encontrar oportunidades.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center">
          <p className="text-sm font-medium text-foreground">Nenhum produto encontrado</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Ajuste os filtros, troque o tipo de oportunidade ou inclua mais marketplaces.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <p className="mt-8 rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-[oklch(0.4_0.08_80)]">
        ⚠️ Preço, comissão e disponibilidade são simulados nesta versão. Revise as informações antes de divulgar.
      </p>
    </AppShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
  tone?: "default" | "navy" | "orange" | "success";
}) {
  const toneCls =
    tone === "orange"
      ? "bg-brand-orange/15 text-brand-orange"
      : tone === "navy"
      ? "bg-brand-navy/10 text-brand-navy"
      : tone === "success"
      ? "bg-success/15 text-[oklch(0.4_0.12_150)]"
      : "bg-muted text-muted-foreground";
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            toneCls,
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </div>
          <div className="text-2xl font-bold text-brand-navy leading-tight">{value}</div>
          <div className="text-[11px] text-muted-foreground">{hint}</div>
        </div>
      </div>
    </div>
  );
}

function MarketplaceSelector({ active }: { active: Marketplace[] }) {
  const allOn = active.length === MARKETPLACES.length;
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border bg-card p-3 shadow-sm">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Marketplaces
      </span>
      {MARKETPLACES.map((m) => {
        const on = active.includes(m);
        return (
          <button
            key={m}
            type="button"
            onClick={() => toggleActiveMarketplace(m)}
            aria-pressed={on}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              on
                ? "border-brand-navy bg-brand-navy text-white shadow-sm"
                : "border-input bg-background text-muted-foreground hover:bg-muted",
            )}
          >
            {m}
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => setActiveMarketplaces(allOn ? [] : MARKETPLACES)}
        className="ml-auto text-xs font-medium text-brand-orange hover:underline"
      >
        {allOn ? "Limpar seleção" : "Selecionar todos"}
      </button>
    </div>
  );
}
