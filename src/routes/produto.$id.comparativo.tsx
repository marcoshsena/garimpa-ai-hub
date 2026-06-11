import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/garimpa/AppShell";
import { MarketplaceComparisonTable } from "@/components/garimpa/MarketplaceComparisonTable";
import { useProduct, useEnrichedProductOffers, useActiveMarketplaces } from "@/lib/garimpa/store";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/produto/$id/comparativo")({
  head: () => ({ meta: [{ title: "Comparativo — Garimpa AI" }] }),
  component: Compare,
});

function Compare() {
  const { id } = Route.useParams();
  const product = useProduct(id);
  const allOffers = useEnrichedProductOffers(id);
  const active = useActiveMarketplaces();
  const offers = active.length
    ? allOffers.filter((o) => active.includes(o.marketplace))
    : allOffers;

  if (!product) {
    return (
      <AppShell>
        <p>Produto não encontrado.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-4 flex items-center gap-3">
        <Button asChild size="sm" variant="ghost">
          <Link to="/produto/$id" params={{ id }}><ArrowLeft className="h-4 w-4" /> Voltar</Link>
        </Button>
      </div>
      <h1 className="text-2xl font-semibold text-brand-navy">{product.name}</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Comparativo entre marketplaces ativos · {offers.length}{" "}
        {offers.length === 1 ? "oferta" : "ofertas"}
      </p>
      <MarketplaceComparisonTable productId={id} offers={offers} />
    </AppShell>
  );
}
