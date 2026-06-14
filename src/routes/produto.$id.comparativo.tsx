import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/garimpa/AppShell";
import { MarketplaceComparisonTable } from "@/components/garimpa/MarketplaceComparisonTable";
import { useProduct, useEnrichedProductOffers } from "@/lib/garimpa/store";
import { bestOfferOf } from "@/lib/garimpa/ranking";
import { MarketplaceBadge } from "@/components/garimpa/Badges";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy } from "lucide-react";

export const Route = createFileRoute("/produto/$id/comparativo")({
  head: () => ({ meta: [{ title: "Comparativo — Garimpa AI" }] }),
  component: Compare,
});

function Compare() {
  const { id } = Route.useParams();
  const product = useProduct(id);
  const offers = useEnrichedProductOffers(id);

  if (!product) {
    return (
      <AppShell>
        <p>Produto não encontrado.</p>
      </AppShell>
    );
  }

  const best = bestOfferOf(offers);
  const single = offers.length === 1;

  return (
    <AppShell>
      <div className="mb-4 flex items-center gap-3">
        <Button asChild size="sm" variant="ghost">
          <Link to="/produto/$id" params={{ id }}>
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
        </Button>
      </div>
      <h1 className="text-2xl font-semibold text-brand-navy">{product.name}</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Comparar marketplaces · {offers.length}{" "}
        {offers.length === 1 ? "oferta cadastrada" : "ofertas cadastradas"}
      </p>

      {offers.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
          Nenhuma oferta cadastrada para este produto.
        </div>
      ) : (
        <>
          {best && (
            <div className="mb-4 rounded-xl border border-brand-orange/40 bg-brand-orange/5 p-4 shadow-sm">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-orange">
                  <Trophy className="h-4 w-4" /> Melhor opção sugerida:
                </span>
                <MarketplaceBadge name={best.marketplace} />
                <span className="text-sm font-semibold text-brand-navy">
                  {best.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Motivos: {best.reason}.
              </p>
              <ul className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                <li>Avaliação: {best.rating ? best.rating.toFixed(1) : "Não informado"}</li>
                <li>
                  Avaliações:{" "}
                  {best.reviews ? best.reviews.toLocaleString("pt-BR") : "Não informado"}
                </li>
                <li>
                  Vendas aproximadas:{" "}
                  {best.sales ? `~${best.sales.toLocaleString("pt-BR")}` : "Não informado"}
                </li>
                <li>Comissão estimada: {best.commission}</li>
                <li>Disponibilidade: {best.availability}</li>
                <li>Frete/entrega: {best.shipping || "Não informado"}</li>
              </ul>
            </div>
          )}

          {single && (
            <div className="mb-4 rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              Este produto possui apenas uma oferta cadastrada no momento.
            </div>
          )}

          <MarketplaceComparisonTable productId={id} offers={offers} />
        </>
      )}
    </AppShell>
  );
}
