import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/garimpa/AppShell";
import { toggleSaved, useProducts, useSaved } from "@/lib/garimpa/store";
import { CategoryBadge, MarketplaceBadge, ScoreBadge } from "@/components/garimpa/Badges";
import { Button } from "@/components/ui/button";
import { GitCompare, Megaphone, Trash2 } from "lucide-react";

export const Route = createFileRoute("/salvos")({
  head: () => ({ meta: [{ title: "Produtos salvos — Garimpa AI" }] }),
  component: Saved,
});

function Saved() {
  const saved = useSaved();
  const products = useProducts();
  const rows = saved
    .map((s) => ({ entry: s, product: products.find((p) => p.id === s.productId) }))
    .filter((r): r is { entry: typeof saved[number]; product: NonNullable<typeof r.product> } => !!r.product);

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold text-brand-navy">Produtos salvos</h1>
      <p className="mb-6 text-sm text-muted-foreground">Sua seleção pessoal para revisitar mais tarde.</p>
      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center">
          <p className="text-sm font-medium">Nenhum produto salvo ainda.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Toque em "Salvar" em qualquer produto para vê-lo aqui.
          </p>
          <Button asChild className="mt-4 bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange/90">
            <Link to="/dashboard">Explorar produtos</Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5">Produto</th>
                <th className="px-3 py-2.5">Categoria</th>
                <th className="px-3 py-2.5">Melhor marketplace</th>
                <th className="px-3 py-2.5">Nota</th>
                <th className="px-3 py-2.5">Salvo em</th>
                <th className="px-3 py-2.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map(({ entry, product }) => (
                <tr key={product.id}>
                  <td className="px-3 py-3">
                    <Link to="/produto/$id" params={{ id: product.id }} className="font-medium hover:text-brand-navy">
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-3 py-3"><CategoryBadge>{product.category}</CategoryBadge></td>
                  <td className="px-3 py-3"><MarketplaceBadge name={product.bestMarketplace} /></td>
                  <td className="px-3 py-3"><ScoreBadge score={product.opportunityScore} /></td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">
                    {new Date(entry.savedAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      <Button asChild size="sm" variant="outline">
                        <Link to="/produto/$id/comparativo" params={{ id: product.id }}>
                          <GitCompare className="h-3.5 w-3.5" /> Comparar
                        </Link>
                      </Button>
                      <Button asChild size="sm" className="bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange/90">
                        <Link to="/gerador" search={{ produto: product.id }}>
                          <Megaphone className="h-3.5 w-3.5" /> Anúncio
                        </Link>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => toggleSaved(product.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
