import { useMemo, useState } from "react";
import type { Offer, Product } from "@/lib/garimpa/types";
import { AD_FORMATS, generateAd, type AdFormat } from "@/lib/garimpa/adTemplates";
import { CommissionBadge, MarketplaceBadge, ScoreBadge } from "./Badges";
import { CopyButton } from "./CopyButton";
import { cn } from "@/lib/utils";

type OfferWithComputed = Offer & {
  computedBest?: boolean;
  computedScore?: number;
  reason?: string;
};

export function AdGenerator({
  product,
  offers,
  initialOfferId,
}: {
  product: Product;
  offers: OfferWithComputed[];
  initialOfferId?: string;
}) {
  const defaultOffer =
    offers.find((offer) => offer.id === initialOfferId) ??
    offers.find((offer) => offer.computedBest) ??
    offers.find((offer) => offer.bestOption) ??
    offers[0];

  const [offerId, setOfferId] = useState<string>(defaultOffer?.id ?? "");
  const [format, setFormat] = useState<AdFormat>("whatsapp_completo");

  const offer = useMemo(
    () => offers.find((item) => item.id === offerId) ?? defaultOffer,
    [offers, offerId, defaultOffer],
  );

  const result = offer ? generateAd(format, product, offer) : null;

  const fullText =
    result?.blocks.map((block) => `## ${block.title}\n\n${block.content}`).join("\n\n---\n\n") ??
    "";

  const groupedFormats = AD_FORMATS.reduce<Record<string, typeof AD_FORMATS>>((acc, item) => {
    acc[item.category] = acc[item.category] ?? [];
    acc[item.category].push(item);
    return acc;
  }, {});

  if (!offer || !result) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
        Cadastre uma oferta para este produto para gerar anúncios.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      <aside className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Oferta
          </label>

          <select
            value={offerId}
            onChange={(event) => setOfferId(event.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
          >
            {offers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.marketplace} —{" "}
                {item.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Formato
          </div>

          <div className="space-y-4">
            {Object.entries(groupedFormats).map(([category, items]) => (
              <div key={category}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {category}
                </div>

                <div className="grid gap-1.5">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormat(item.id)}
                      className={cn(
                        "rounded-md border px-3 py-2 text-left text-sm transition-colors",
                        format === item.id
                          ? "border-brand-orange bg-brand-orange/10"
                          : "border-input hover:bg-muted",
                      )}
                    >
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border bg-muted/30 p-3 text-xs">
          <div className="mb-2 font-semibold text-foreground">Resumo da oferta</div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MarketplaceBadge name={offer.marketplace} />
              <span className="font-semibold text-brand-navy">
                {offer.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <div className="grid gap-1 text-muted-foreground">
              <span>Avaliação: {offer.rating.toFixed(1)} de 5</span>
              <span>Avaliações: {offer.reviews.toLocaleString("pt-BR")}</span>
              {offer.sales && <span>Vendas aprox.: {offer.sales.toLocaleString("pt-BR")}</span>}
              <span>Disponibilidade: {offer.availability}</span>
              <span>Frete: {offer.shipping}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <CommissionBadge value={offer.commission} />
              {offer.computedScore && <ScoreBadge score={offer.computedScore} />}
            </div>

            {offer.reason && (
              <p className="rounded-md bg-background p-2 text-muted-foreground">{offer.reason}</p>
            )}
          </div>
        </div>
      </aside>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
          <div>
            <div className="text-sm font-semibold">{result.label}</div>
            <p className="text-xs text-muted-foreground">
              Conteúdo gerado com base em {product.name} na {offer.marketplace}.
            </p>
          </div>

          <CopyButton value={fullText} label="Copiar tudo" />
        </div>

        <div className="space-y-4 p-4">
          {result.blocks.map((block) => (
            <section key={block.title} className="rounded-lg border bg-background">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
                <h3 className="text-sm font-semibold text-brand-navy">{block.title}</h3>

                <CopyButton value={block.content} label="Copiar" />
              </div>

              <pre className="whitespace-pre-wrap p-3 font-sans text-sm leading-relaxed text-foreground">
                {block.content}
              </pre>
            </section>
          ))}
        </div>

        <div className="border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
          Substitua <span className="font-mono">[cole seu link afiliado]</span> antes de publicar.
          Revise sempre preço, frete, avaliações e disponibilidade.
        </div>
      </div>
    </div>
  );
}
