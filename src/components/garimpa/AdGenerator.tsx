import { useMemo, useState } from "react";
import type { Offer, Product } from "@/lib/garimpa/types";
import {
  AD_FORMATS,
  generateAd,
  type AdFormat,
  type AdFormatCategory,
} from "@/lib/garimpa/adTemplates";
import { CommissionBadge, MarketplaceBadge, ScoreBadge } from "./Badges";
import { CopyButton } from "./CopyButton";
import { cn } from "@/lib/utils";
import { MessageCircle, Instagram, Video, Sparkles, Star } from "lucide-react";

const CATEGORY_ORDER: AdFormatCategory[] = [
  "Mensageria",
  "Instagram",
  "Vídeo curto",
  "Premium IA",
];

const CATEGORY_META: Record<
  AdFormatCategory,
  { icon: React.ComponentType<{ className?: string }>; hint: string }
> = {
  Mensageria: { icon: MessageCircle, hint: "WhatsApp e Telegram" },
  Instagram: { icon: Instagram, hint: "Feed, Carrossel e Stories" },
  "Vídeo curto": { icon: Video, hint: "Reels e TikTok" },
  "Premium IA": { icon: Sparkles, hint: "Roteiros com IA generativa" },
};

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
    offers.find((o) => o.id === initialOfferId) ??
    offers.find((o) => (o as Offer & { computedBest?: boolean }).computedBest) ??
    offers.find((o) => o.bestOption) ??
    offers[0];
  const [offerId, setOfferId] = useState<string>(defaultOffer?.id ?? "");
  const [format, setFormat] = useState<AdFormat>("whatsapp_completo");
  const offer = useMemo(
    () => offers.find((o) => o.id === offerId) ?? defaultOffer,
    [offers, offerId, defaultOffer],
  );

  if (!offer) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
        Cadastre uma oferta para este produto para gerar anúncios.
      </div>
    );
  }

  const text = generateAd(format, product, offer);
  const enriched = offer as Offer & { computedScore?: number };

  const groups = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: AD_FORMATS.filter((f) => f.category === cat),
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      <aside className="space-y-4">
        {/* Resumo da oferta */}
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Oferta selecionada
          </div>
          <div className="flex items-start gap-3">
            <img
              src={product.image}
              alt={product.name}
              onError={imgFallback}
              className="h-14 w-14 shrink-0 rounded-md border object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="line-clamp-2 text-sm font-semibold text-brand-navy">
                {product.name}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <MarketplaceBadge name={offer.marketplace} />
                {typeof enriched.computedScore === "number" && (
                  <ScoreBadge score={enriched.computedScore} />
                )}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t pt-3">
            <span className="text-xl font-bold text-brand-navy">
              {offer.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-warning text-warning" />
              {offer.rating.toFixed(1)} · {offer.reviews.toLocaleString("pt-BR")}
            </span>
          </div>
          <div className="mt-2">
            <CommissionBadge value={offer.commission} />
          </div>

          {offers.length > 1 && (
            <div className="mt-3">
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Trocar oferta
              </label>
              <select
                value={offerId}
                onChange={(e) => setOfferId(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              >
                {offers.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.marketplace} —{" "}
                    {o.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Formatos */}
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Formato do anúncio
          </div>
          <div className="space-y-4">
            {groups.map(({ category, items }) => {
              const Meta = CATEGORY_META[category];
              const Icon = Meta.icon;
              return (
                <div key={category}>
                  <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-brand-navy">
                    <Icon className="h-3.5 w-3.5 text-brand-orange" />
                    {category}
                    <span className="text-muted-foreground/70 font-normal normal-case tracking-normal">
                      · {Meta.hint}
                    </span>
                  </div>
                  <div className="grid gap-1.5">
                    {items.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFormat(f.id)}
                        className={cn(
                          "rounded-md border px-3 py-2 text-left text-sm transition-colors",
                          format === f.id
                            ? "border-brand-orange bg-brand-orange/10 ring-1 ring-brand-orange/30"
                            : "border-input hover:bg-muted",
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{f.label}</span>
                          {f.premium && (
                            <span className="rounded bg-brand-navy px-1.5 py-0.5 text-[10px] font-semibold text-white">
                              IA
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {f.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <div className="text-sm font-semibold text-brand-navy">
              Anúncio gerado
            </div>
            <div className="text-xs text-muted-foreground">
              {AD_FORMATS.find((f) => f.id === format)?.label}
            </div>
          </div>
          <CopyButton value={text} label="Copiar texto" />
        </div>
        <pre className="whitespace-pre-wrap p-4 font-sans text-sm leading-relaxed text-foreground">
{text}
        </pre>
        <div className="border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
          Substitua{" "}
          <span className="font-mono">[cole seu link afiliado]</span> antes de
          publicar. Revise sempre o preço e a disponibilidade.
        </div>
      </div>
    </div>
  );
}

function imgFallback(e: React.SyntheticEvent<HTMLImageElement>) {
  const t = e.currentTarget;
  if (t.dataset.fallback) return;
  t.dataset.fallback = "1";
  t.src =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><rect width='80' height='80' fill='%23e2e8f0'/><text x='50%' y='52%' font-family='sans-serif' font-size='10' fill='%2364748b' text-anchor='middle'>sem imagem</text></svg>`,
    );
}
