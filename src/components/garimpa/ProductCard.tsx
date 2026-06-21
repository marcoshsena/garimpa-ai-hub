import { Link } from "@tanstack/react-router";
import { useMemo, type ReactNode } from "react";
import type { Product } from "@/lib/garimpa/types";
import { Button } from "@/components/ui/button";
import { CategoryBadge, CommissionBadge, MarketplaceBadge, ScoreBadge } from "./Badges";
import { ProductImage } from "./ProductImage";
import {
  isSaved,
  toggleSaved,
  useEnrichedOffers,
  useActiveMarketplaces,
  useSaved,
} from "@/lib/garimpa/store";
import { bestOfferOf } from "@/lib/garimpa/ranking";
import { Bookmark, BookmarkCheck, GitCompare, Megaphone, Star, TrendingUp } from "lucide-react";
import { getProductDiagnosis } from "@/lib/garimpa/recommendations";

export function ProductCard({ product }: { product: Product }) {
  const allOffers = useEnrichedOffers();
  const active = useActiveMarketplaces();
  const savedProducts = useSaved();

  const offers = useMemo(() => {
    const list = allOffers.filter((offer) => offer.productId === product.id);
    return active.length ? list.filter((offer) => active.includes(offer.marketplace)) : list;
  }, [allOffers, active, product.id]);

  const bestOffer = useMemo(() => bestOfferOf(offers), [offers]);

  const diagnosis = bestOffer ? getProductDiagnosis(product, bestOffer, offers) : null;

  const isFav = useMemo(() => isSaved(savedProducts, product.id), [savedProducts, product.id]);

  if (!bestOffer) return null;

  const marketplaceCount = offers.length;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <Link
        to="/produto/$id"
        params={{ id: product.id }}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          imgClassName="transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute left-2 top-2">
          <ScoreBadge score={bestOffer.computedScore} />
        </div>

        {product.trending ? (
          <div className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-brand-orange px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-orange-foreground shadow-sm">
            <TrendingUp className="h-3 w-3" />
            Em alta
          </div>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <CategoryBadge>{product.category}</CategoryBadge>
          <MarketplaceBadge name={bestOffer.marketplace} />
        </div>

        <Link
          to="/produto/$id"
          params={{ id: product.id }}
          className="line-clamp-2 min-h-[2.5rem] text-[15px] font-semibold leading-snug text-foreground hover:text-brand-navy"
        >
          {product.name}
        </Link>

        <div className="rounded-lg border border-brand-navy/10 bg-gradient-to-br from-brand-navy/5 to-transparent p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Melhor oferta em {bestOffer.marketplace}
          </div>

          <div className="mt-0.5 text-2xl font-bold leading-tight text-brand-navy">
            {bestOffer.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
        </div>

        {diagnosis && diagnosis.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {diagnosis.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-[11px] font-medium text-brand-navy"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <dl className="grid grid-cols-3 gap-2 text-center">
          <Meta
            label="Avaliação"
            value={
              <span className="inline-flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-warning text-warning" />
                {bestOffer.rating.toFixed(1)}
              </span>
            }
          />

          <Meta
            label="Vendas"
            value={
              bestOffer.sales
                ? bestOffer.sales >= 1000
                  ? `${(bestOffer.sales / 1000).toFixed(1)}k`
                  : String(bestOffer.sales)
                : "—"
            }
          />

          <Meta label="Comissão" value={<CommissionBadge value={bestOffer.commission} />} />
        </dl>

        <div className="text-[11px] text-muted-foreground">
          Disponível em {marketplaceCount} marketplace
          {marketplaceCount > 1 ? "s" : ""}
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

function Meta({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-md border bg-muted/30 px-1.5 py-1.5">
      <dt className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-xs font-semibold text-foreground">{value}</dd>
    </div>
  );
}
