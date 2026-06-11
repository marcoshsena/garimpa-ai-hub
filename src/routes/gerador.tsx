import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { AppShell } from "@/components/garimpa/AppShell";
import { AdGenerator } from "@/components/garimpa/AdGenerator";
import { useProduct, useEnrichedProductOffers, useProducts } from "@/lib/garimpa/store";

const searchSchema = z.object({
  produto: z.string().optional(),
  oferta: z.string().optional(),
});

export const Route = createFileRoute("/gerador")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Gerador de anúncios — Garimpa AI" },
      { name: "description", content: "Gere anúncios para WhatsApp, Instagram, Reels e Stories." },
    ],
  }),
  component: GeradorPage,
});

function GeradorPage() {
  const { produto, oferta } = Route.useSearch();
  const products = useProducts();
  const selectedId = produto ?? products[0]?.id;
  const product = useProduct(selectedId);
  const offers = useProductOffers(selectedId);

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy">Gerador de anúncios</h1>
          <p className="text-sm text-muted-foreground">Textos prontos com tom anti-spam, prontos para copiar.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Produto</label>
          <select
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            value={selectedId ?? ""}
            onChange={(e) => {
              const url = new URL(window.location.href);
              url.searchParams.set("produto", e.target.value);
              url.searchParams.delete("oferta");
              window.location.assign(url.toString());
            }}
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>
      {product ? (
        <AdGenerator product={product} offers={offers} initialOfferId={oferta} />
      ) : (
        <div className="rounded-xl border bg-card p-12 text-center text-sm">
          Nenhum produto disponível.{" "}
          <Link to="/admin/produtos" className="font-medium text-brand-orange hover:underline">
            Cadastrar produto
          </Link>
        </div>
      )}
    </AppShell>
  );
}
