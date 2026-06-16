import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { AppShell } from "@/components/garimpa/AppShell";
import { AdGenerator } from "@/components/garimpa/AdGenerator";
import { useProduct, useEnrichedProductOffers, useProducts } from "@/lib/garimpa/store";
import { Megaphone } from "lucide-react";

const searchSchema = z.object({
  produto: z.string().optional(),
  oferta: z.string().optional(),
});

export const Route = createFileRoute("/gerador")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Gerador de anúncios — Garimpa AI" },
      {
        name: "description",
        content:
          "Gere anúncios prontos para WhatsApp, Telegram, Instagram, Reels, Stories, TikTok e roteiros com IA.",
      },
    ],
  }),
  component: GeradorPage,
});

function GeradorPage() {
  const { produto, oferta } = Route.useSearch();
  const products = useProducts();
  const selectedId = produto ?? products[0]?.id;
  const product = useProduct(selectedId);
  const offers = useEnrichedProductOffers(selectedId);
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange">
            <Megaphone className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold text-brand-navy">
              Central de criação de anúncios
            </h1>
            <p className="text-sm text-muted-foreground">
              Textos e roteiros prontos para WhatsApp, Instagram, Reels, Stories,
              TikTok e formatos premium com IA.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Produto
          </label>
          <select
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            value={selectedId ?? ""}
            onChange={(e) =>
              navigate({
                to: "/gerador",
                search: { produto: e.target.value },
              })
            }
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
