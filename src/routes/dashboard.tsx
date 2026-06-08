import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/garimpa/AppShell";
import { ProductCard } from "@/components/garimpa/ProductCard";
import { ProductFilters, defaultFilters, type Filters } from "@/components/garimpa/ProductFilters";
import { useOffers, useProducts } from "@/lib/garimpa/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Garimpa AI" },
      { name: "description", content: "Produtos sugeridos para curadoria de ofertas." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const products = useProducts();
  const offers = useOffers();
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (p.status !== "Ativo") return false;
      if (filters.query && !p.name.toLowerCase().includes(filters.query.toLowerCase())) return false;
      if (filters.category !== "all" && p.category !== filters.category) return false;
      if (filters.minScore > 0 && p.opportunityScore < filters.minScore) return false;
      const productOffers = offers.filter((o) => o.productId === p.id);
      if (filters.marketplace !== "all" && !productOffers.some((o) => o.marketplace === filters.marketplace)) {
        return false;
      }
      if (filters.commission !== "all") {
        const best = productOffers.find((o) => o.bestOption) ?? productOffers[0];
        if (!best || best.commission !== filters.commission) return false;
      }
      return true;
    });
  }, [products, offers, filters]);

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy">Produtos sugeridos</h1>
          <p className="text-sm text-muted-foreground">
            Curadoria para você decidir o que vale divulgar.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "produto" : "produtos"}
        </div>
      </div>
      <div className="mb-6">
        <ProductFilters value={filters} onChange={setFilters} />
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center">
          <p className="text-sm font-medium text-foreground">Nenhum produto encontrado</p>
          <p className="mt-1 text-xs text-muted-foreground">Tente limpar os filtros ou pesquisar outro termo.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
