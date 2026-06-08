import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/garimpa/AppShell";
import { useProduct, useProductOffers, toggleSaved, useSaved, isSaved } from "@/lib/garimpa/store";
import { CategoryBadge, MarketplaceBadge, ScoreBadge } from "@/components/garimpa/Badges";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, GitCompare, Megaphone } from "lucide-react";

export const Route = createFileRoute("/produto/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Produto — Garimpa AI` },
      { name: "description", content: `Detalhes do produto ${params.id} no Garimpa AI.` },
    ],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const product = useProduct(id);
  const offers = useProductOffers(id);
  const saved = useSaved();
  const fav = isSaved(saved, id);

  if (!product) {
    return (
      <AppShell>
        <div className="rounded-xl border bg-card p-12 text-center">
          <p className="font-medium">Produto não encontrado.</p>
          <Button asChild className="mt-4"><Link to="/dashboard">Voltar ao dashboard</Link></Button>
        </div>
      </AppShell>
    );
  }

  const cheapest = offers.length ? Math.min(...offers.map((o) => o.price)) : null;

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <img src={product.image} alt={product.name} className="aspect-[4/3] w-full object-cover" />
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge>{product.category}</CategoryBadge>
            <ScoreBadge score={product.opportunityScore} />
            <MarketplaceBadge name={product.bestMarketplace} />
          </div>
          <h1 className="text-3xl font-semibold text-brand-navy">{product.name}</h1>
          <p className="text-muted-foreground">{product.shortDescription}</p>

          {cheapest !== null && (
            <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
              A partir de{" "}
              <span className="font-semibold text-brand-navy">
                {cheapest.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
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

          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild variant="outline">
              <Link to="/produto/$id/comparativo" params={{ id: product.id }}>
                <GitCompare className="h-4 w-4" /> Ver comparativo
              </Link>
            </Button>
            <Button asChild className="bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange/90">
              <Link to="/gerador" search={{ produto: product.id }}>
                <Megaphone className="h-4 w-4" /> Gerar anúncio
              </Link>
            </Button>
            <Button variant={fav ? "secondary" : "ghost"} onClick={() => toggleSaved(product.id)}>
              {fav ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              {fav ? "Salvo" : "Salvar"}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Info({
  label, value, accent,
}: { label: string; value: string; accent?: "success" | "warning" }) {
  const tone =
    accent === "success" ? "border-success/40 bg-success/5"
    : accent === "warning" ? "border-warning/40 bg-warning/10"
    : "bg-card";
  return (
    <div className={`rounded-lg border p-3 ${tone}`}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm">{value || "—"}</dd>
    </div>
  );
}
