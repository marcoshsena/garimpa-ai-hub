import { Link } from "@tanstack/react-router";
import type { EnrichedOffer } from "@/lib/garimpa/ranking";
import { CommissionBadge, MarketplaceBadge, ScoreBadge } from "./Badges";
import { CopyButton } from "./CopyButton";
import { Button } from "@/components/ui/button";
import { Megaphone, Star, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const availabilityTone: Record<string, string> = {
  "Em estoque": "text-[oklch(0.4_0.12_150)]",
  "Estoque baixo": "text-[oklch(0.45_0.12_60)]",
  Esgotado: "text-destructive",
};

export function MarketplaceComparisonTable({
  productId,
  offers,
}: {
  productId: string;
  offers: EnrichedOffer[];
}) {
  if (offers.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
        Nenhuma oferta cadastrada para este produto nos marketplaces ativos.
      </div>
    );
  }

  // Ordena: melhor opção primeiro, depois por score
  const sorted = offers.slice().sort((a, b) => {
    if (a.computedBest !== b.computedBest) return a.computedBest ? -1 : 1;
    return b.computedScore - a.computedScore;
  });

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-[oklch(0.4_0.08_80)]">
        ⚠️ Preço, disponibilidade e comissão estimada são dados simulados. Revise antes de divulgar.
      </div>
      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full min-w-[1000px] text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2.5">Marketplace</th>
              <th className="px-3 py-2.5">Oferta</th>
              <th className="px-3 py-2.5">Preço</th>
              <th className="px-3 py-2.5">Prova social</th>
              <th className="px-3 py-2.5">Disponibilidade</th>
              <th className="px-3 py-2.5">Comissão</th>
              <th className="px-3 py-2.5">Score</th>
              <th className="px-3 py-2.5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sorted.map((o) => (
              <tr key={o.id} className={cn(o.computedBest && "bg-brand-orange/5")}>
                <td className="px-3 py-3">
                  <div className="flex flex-col gap-1">
                    <MarketplaceBadge name={o.marketplace} />
                    {o.computedBest && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-orange">
                        <Trophy className="h-3 w-3" /> Melhor opção sugerida
                      </span>
                    )}
                    {o.computedBest && (
                      <span className="text-[11px] text-muted-foreground">
                        Motivo: {o.reason}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="font-medium">{o.title}</div>
                  {o.note && <div className="text-xs text-muted-foreground">{o.note}</div>}
                  <div className="mt-1 text-xs text-muted-foreground">{o.shipping}</div>
                </td>
                <td className="px-3 py-3 font-semibold text-brand-navy">
                  {o.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                    {o.rating.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {o.reviews.toLocaleString("pt-BR")} avaliações
                  </div>
                  {o.sales ? (
                    <div className="text-xs text-muted-foreground">
                      ~{o.sales.toLocaleString("pt-BR")} vendas
                    </div>
                  ) : null}
                </td>
                <td className={cn("px-3 py-3 text-xs font-medium", availabilityTone[o.availability])}>
                  {o.availability}
                </td>
                <td className="px-3 py-3"><CommissionBadge value={o.commission} /></td>
                <td className="px-3 py-3"><ScoreBadge score={o.computedScore} /></td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap justify-end gap-1.5">
                    <CopyButton value={o.originalLink} label="Original" />
                    <CopyButton value={o.affiliateLink || "[cole seu link afiliado]"} label="Afiliado" />
                    <Button
                      asChild
                      size="sm"
                      className="bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange/90"
                    >
                      <Link to="/gerador" search={{ produto: productId, oferta: o.id }}>
                        <Megaphone className="h-3.5 w-3.5" /> Anúncio
                      </Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
