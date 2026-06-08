import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/garimpa/types";
import { Button } from "@/components/ui/button";
import { CategoryBadge, CommissionBadge, MarketplaceBadge, ScoreBadge } from "./Badges";
import { isSaved, toggleSaved, useOffers, useSaved } from "@/lib/garimpa/store";
import { Bookmark, BookmarkCheck, GitCompare, Megaphone } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const offers = useOffers().filter((o) => o.productId === product.id);
  const cheapest = offers.length ? Math.min(...offers.map((o) => o.price)) : null;
  const bestOffer = offers.find((o) => o.bestOption);
  const commission = bestOffer?.commission ?? "Não informada";
  const saved = useSaved();
  const isFav = isSaved(saved, product.id);

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
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute left-2 top-2">
          <ScoreBadge score={product.opportunityScore} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <CategoryBadge>{product.category}</CategoryBadge>
          <CommissionBadge value={commission} />
        </div>
        <Link
          to="/produto/$id"
          params={{ id: product.id }}
          className="line-clamp-2 text-base font-semibold text-foreground hover:text-brand-navy"
        >
          {product.name}
        </Link>
        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">A partir de</div>
          <div className="font-semibold text-brand-navy">
            {cheapest !== null
              ? cheapest.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
              : "—"}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Melhor em</span>
          <MarketplaceBadge name={product.bestMarketplace} />
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
            <Link to="/gerador" search={{ produto: product.id }}>
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
            {isFav ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{isFav ? "Salvo" : "Salvar"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
