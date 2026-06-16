import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import type { Product } from "@/lib/garimpa/types";
import { Button } from "@/components/ui/button";
import { CategoryBadge, CommissionBadge, MarketplaceBadge, ScoreBadge } from "./Badges";
import {
  isSaved,
  toggleSaved,
  useEnrichedOffers,
  useActiveMarketplaces,
  useSaved,
} from "@/lib/garimpa/store";
import { bestOfferOf } from "@/lib/garimpa/ranking";
import { Bookmark, BookmarkCheck, GitCompare, Megaphone, Star } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const allOffers = useEnrichedOffers();
  const active = useActiveMarketplaces();
  const savedProducts = useSaved();

  const offers = useMemo(() => {
    const list = allOffers.filter((o) => o.productId === product.id);
    return active.length ? list.filter((o) => active.includes(o.marketplace)) : list;
  }, [allOffers, active, product.id]);

  const bestOffer = useMemo(() => bestOfferOf(offers), [offers]);

  const isFav = useMemo(
    () => isSaved(savedProducts, product.id),
    [savedProducts, product.id]
  );

  if (!bestOffer) return null;

  const marketplaceCount = offers.length;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      <Link
        to="/produto/$id"
        params={{ id: product.id }}
        className="relative aspect-[4/3] overflow-hidden bg-muted"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            const t = e.currentTarget;
            if (t.dataset.fallback) return;
            t.dataset.fallback = "1";
            t.src =
              "data:image/svg+xml;utf8," +
              encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 150'><rect width='200' height='150' fill='%23e2e8f0'/><text x='50%' y='52%' font-family='sans-serif' font-size='14' fill='%2364748b' text-anchor='middle'>sem imagem</text></svg>`,
              );
          }}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute left-2 top-2">
          <ScoreBadge score={bestOffer.computedScore} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <CategoryBadge>{product.category}</CategoryBadge>
          <MarketplaceBadge name={bestOffer.marketplace} />
          <CommissionBadge value={bestOffer.commission} />
        </div>

        <Link
          to="/produto/$id"
          params={{ id: product.id }}
          className="line-clamp-2 text-base font-semibold text-foreground hover:text-brand-navy"
        >
          {product.name}
        </Link>

        <div className="rounded-md border bg-muted/30 p-2.5 text-sm">
          <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-wide text-muted-foreground">
            <span>Melhor oferta encontrada</span>
            <span>em {bestOffer.marketplace}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-semibold text-brand-navy">
              {bestOffer.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-warning text-warning" />
              {bestOffer.rating.toFixed(1)} · {bestOffer.reviews.toLocaleString("pt-BR")} aval.
            </span>
          </div>
          {bestOffer.sales ? (
            <div className="mt-1 text-[11px] text-muted-foreground">
              ~{bestOffer.sales.toLocaleString("pt-BR")} vendas aproximadas
            </div>
          ) : null}
        </div>

        <div className="text-xs text-muted-foreground">
          Disponível em {marketplaceCount} marketplace{marketplaceCount > 1 ? "s" : ""}
        </div>

        <div className="mt-auto grid grid-cols-3 gap-1.5 pt-2">
          <Button asChild size="sm" variant="outline">
            <Link to="/produto/$id/comparativo" params={{ id: product.id }}>
              <GitCompare className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Comparar</span>
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange/90"
          >
            <Link to="/gerador" search={{ produto: product.id, oferta: bestOffer.id }}>
              <Megaphone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Anúncio</span>
            </Link>
          </Button>

          <Button
            size="sm"
            variant={isFav ? "secondary" : "ghost"}
            onClick={() => toggleSaved(product.id)}
            aria-label={isFav ? "Remover dos salvos" : "Salvar"}
          >
            {isFav ? (
              <BookmarkCheck className="h-3.5 w-3.5" />
            ) : (
              <Bookmark className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">{isFav ? "Salvo" : "Salvar"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
