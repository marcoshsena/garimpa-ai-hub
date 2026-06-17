import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/garimpa/AppShell";
import { useProduct, useProductOffers, toggleSaved, useSaved, isSaved } from "@/lib/garimpa/store";
import { CategoryBadge, MarketplaceBadge, ScoreBadge } from "@/components/garimpa/Badges";
import { ProductImage } from "@/components/garimpa/ProductImage";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, GitCompare, Megaphone, ArrowRight } from "lucide-react";
import { bestOfferOf, enrichOffers } from "@/lib/garimpa/ranking";

export const Route = createFileRoute("/produto/$id/")({
  head: ({ params }) => ({
    meta: [
      { title: "Produto — Garimpa AI" },
      {
        name: "description",
        content: `Detalhes do produto ${params.id} no Garimpa AI.`,
      },
    ],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const product = useProduct(id);
  const offers = useProductOffers(id);
  const saved = useSaved();

  const enrichedOffers = enrichOffers(offers);
  const bestOffer = bestOfferOf(enrichedOffers);

  const fav = product ? isSaved(saved, product.id) : false;

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

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="aspect-[4/3] w-full">
            <ProductImage src={product.image} alt={product.name} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge>{product.category}</CategoryBadge>

            {bestOffer ? (
              <>
                <ScoreBadge score={bestOffer.computedScore} />
                <MarketplaceBadge name={bestOffer.marketplace} />
              </>
            ) : (
              <ScoreBadge score={product.opportunityScore} />
            )}
          </div>

          <h1 className="text-3xl font-semibold text-brand-navy">{product.name}</h1>

          <p className="text-muted-foreground">{product.shortDescription}</p>

          {bestOffer && (
            <div className="rounded-lg border border-brand-navy/15 bg-gradient-to-br from-brand-navy/5 to-transparent p-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Melhor oferta encontrada
              </div>
              <div className="mt-1 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-bold text-brand-navy">
                  {bestOffer.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
                <span className="text-sm text-muted-foreground">
                  em <span className="font-semibold text-foreground">{bestOffer.marketplace}</span>
                </span>
              </div>
            </div>
          )}

          <dl className="grid gap-3 sm:grid-cols-2">
            <Info label="Público ideal" value={product.idealAudience} />
            <Info label="Problema que resolve" value={product.problemSolved} />
            <Info label="Ponto forte" value={product.strongPoint} accent="success" />
            <Info label="Ponto de atenção" value={product.attentionPoint} accent="warning" />
          </dl>

          <p className="text-xs text-muted-foreground">
            Última atualização: {new Date(product.updatedAt).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>

      {/* Próximos passos */}
      <section className="mt-8 rounded-xl border bg-card p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <ArrowRight className="h-4 w-4 text-brand-orange" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-navy">
            Próximos passos
          </h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Compare as ofertas disponíveis, gere conteúdo pronto ou salve para revisitar mais tarde.
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <Button asChild variant="outline" className="justify-start">
            <Link to="/produto/$id/comparativo" params={{ id: product.id }}>
              <GitCompare className="h-4 w-4" />
              Comparar marketplaces
            </Link>
          </Button>
          <Button
            asChild
            className="justify-start bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange/90"
          >
            <Link
              to="/gerador"
              search={{
                produto: product.id,
                ...(bestOffer ? { oferta: bestOffer.id } : {}),
              }}
            >
              <Megaphone className="h-4 w-4" />
              Gerar anúncio da melhor oferta
            </Link>
          </Button>
          <Button
            variant={fav ? "secondary" : "outline"}
            onClick={() => toggleSaved(product.id)}
            className="justify-start"
          >
            {fav ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            {fav ? "Salvo na sua lista" : "Salvar produto"}
          </Button>
        </div>
      </section>
    </AppShell>
  );
}

function Info({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "success" | "warning";
}) {
  const tone =
    accent === "success"
      ? "border-success/40 bg-success/5"
      : accent === "warning"
        ? "border-warning/40 bg-warning/10"
        : "bg-card";

  return (
    <div className={`rounded-lg border p-3 ${tone}`}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm">{value || "—"}</dd>
    </div>
  );
}
