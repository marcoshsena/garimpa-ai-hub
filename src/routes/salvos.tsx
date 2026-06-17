import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/garimpa/AppShell";
import { toggleSaved, useProducts, useSaved } from "@/lib/garimpa/store";
import { CategoryBadge, MarketplaceBadge, ScoreBadge } from "@/components/garimpa/Badges";
import { Button } from "@/components/ui/button";
import { Bookmark, GitCompare, Megaphone, Trash2 } from "lucide-react";

export const Route = createFileRoute("/salvos")({
  head: () => ({ meta: [{ title: "Produtos salvos — Garimpa AI" }] }),
  component: Saved,
});

function Saved() {
  const saved = useSaved();
  const products = useProducts();
  const rows = saved
    .map((s) => ({ entry: s, product: products.find((p) => p.id === s.productId) }))
    .filter(
      (r): r is { entry: typeof saved[number]; product: NonNullable<typeof r.product> } =>
        !!r.product,
    );

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy sm:text-3xl">Produtos salvos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sua seleção pessoal para revisitar e divulgar.
          </p>
        </div>
        {rows.length > 0 && (
          <span className="rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            {rows.length} {rows.length === 1 ? "item" : "itens"}
          </span>
        )}
      </div>

      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Mobile: cards */}
          <div className="grid gap-3 md:hidden">
            {rows.map(({ entry, product }) => (
              <div key={product.id} className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  <CategoryBadge>{product.category}</CategoryBadge>
                  {product.bestMarketplace && (
                    <MarketplaceBadge name={product.bestMarketplace} />
                  )}
                  <ScoreBadge score={product.opportunityScore} />
                </div>
                <Link
                  to="/produto/$id"
                  params={{ id: product.id }}
                  className="block font-semibold leading-snug text-foreground hover:text-brand-navy"
                >
                  {product.name}
                </Link>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Salvo em {new Date(entry.savedAt).toLocaleDateString("pt-BR")}
                </p>
                <div className="mt-3 grid grid-cols-3 gap-1.5">
                  <Button asChild size="sm" variant="outline">
                    <Link to="/produto/$id/comparativo" params={{ id: product.id }}>
                      <GitCompare className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange/90"
                  >
                    <Link to="/gerador" search={{ produto: product.id }}>
                      <Megaphone className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toggleSaved(product.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden overflow-hidden rounded-xl border bg-card shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Produto</th>
                    <th className="px-4 py-3 font-semibold">Categoria</th>
                    <th className="px-4 py-3 font-semibold">Melhor marketplace</th>
                    <th className="px-4 py-3 font-semibold">Nota</th>
                    <th className="px-4 py-3 font-semibold">Salvo em</th>
                    <th className="px-4 py-3 text-right font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map(({ entry, product }) => (
                    <tr key={product.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <Link
                          to="/produto/$id"
                          params={{ id: product.id }}
                          className="font-medium hover:text-brand-navy"
                        >
                          {product.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <CategoryBadge>{product.category}</CategoryBadge>
                      </td>
                      <td className="px-4 py-3">
                        {product.bestMarketplace ? (
                          <MarketplaceBadge name={product.bestMarketplace} />
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <ScoreBadge score={product.opportunityScore} />
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(entry.savedAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap justify-end gap-1.5">
                          <Button asChild size="sm" variant="outline">
                            <Link to="/produto/$id/comparativo" params={{ id: product.id }}>
                              <GitCompare className="h-3.5 w-3.5" /> Comparar
                            </Link>
                          </Button>
                          <Button
                            asChild
                            size="sm"
                            className="bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange/90"
                          >
                            <Link to="/gerador" search={{ produto: product.id }}>
                              <Megaphone className="h-3.5 w-3.5" /> Anúncio
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleSaved(product.id)}
                            aria-label="Remover dos salvos"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed bg-gradient-to-br from-card via-card to-muted/30 p-12 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange/10 ring-1 ring-brand-orange/20">
        <Bookmark className="h-6 w-6 text-brand-orange" />
      </div>
      <h2 className="text-lg font-semibold text-brand-navy">Sua lista está vazia</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
        Salve produtos do dashboard para acompanhar suas oportunidades favoritas em um só lugar.
      </p>
      <Button
        asChild
        className="mt-5 bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange/90"
      >
        <Link to="/dashboard">Explorar oportunidades</Link>
      </Button>
    </div>
  );
}
