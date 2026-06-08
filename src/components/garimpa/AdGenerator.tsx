import { useMemo, useState } from "react";
import type { Offer, Product } from "@/lib/garimpa/types";
import { AD_FORMATS, generateAd, type AdFormat } from "@/lib/garimpa/adTemplates";
import { MarketplaceBadge } from "./Badges";
import { CopyButton } from "./CopyButton";
import { cn } from "@/lib/utils";

export function AdGenerator({
  product,
  offers,
  initialOfferId,
}: {
  product: Product;
  offers: Offer[];
  initialOfferId?: string;
}) {
  const defaultOffer =
    offers.find((o) => o.id === initialOfferId) ?? offers.find((o) => o.bestOption) ?? offers[0];
  const [offerId, setOfferId] = useState<string>(defaultOffer?.id ?? "");
  const [format, setFormat] = useState<AdFormat>("whatsapp_completo");
  const offer = useMemo(() => offers.find((o) => o.id === offerId) ?? defaultOffer, [offers, offerId, defaultOffer]);

  if (!offer) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
        Cadastre uma oferta para este produto para gerar anúncios.
      </div>
    );
  }

  const text = generateAd(format, product, offer);

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Oferta
          </label>
          <select
            value={offerId}
            onChange={(e) => setOfferId(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
          >
            {offers.map((o) => (
              <option key={o.id} value={o.id}>
                {o.marketplace} — {o.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Formato
          </div>
          <div className="grid gap-1.5">
            {AD_FORMATS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormat(f.id)}
                className={cn(
                  "rounded-md border px-3 py-2 text-left text-sm transition-colors",
                  format === f.id
                    ? "border-brand-orange bg-brand-orange/10"
                    : "border-input hover:bg-muted",
                )}
              >
                <div className="font-medium">{f.label}</div>
                <div className="text-xs text-muted-foreground">{f.description}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-md border bg-muted/30 p-3 text-xs">
          <div className="mb-1 font-semibold text-foreground">Resumo da oferta</div>
          <div className="flex items-center gap-2">
            <MarketplaceBadge name={offer.marketplace} />
            <span className="font-semibold text-brand-navy">
              {offer.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          </div>
        </div>
      </aside>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-sm font-semibold">Anúncio gerado</div>
          <CopyButton value={text} label="Copiar texto" />
        </div>
        <pre className="whitespace-pre-wrap p-4 font-sans text-sm leading-relaxed text-foreground">
{text}
        </pre>
        <div className="border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
          Substitua <span className="font-mono">[cole seu link afiliado]</span> antes de publicar. Revise sempre o preço e a disponibilidade.
        </div>
      </div>
    </div>
  );
}
