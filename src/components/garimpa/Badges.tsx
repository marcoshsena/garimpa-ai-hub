import type { Commission, Marketplace } from "@/lib/garimpa/types";
import { cn } from "@/lib/utils";

export function CategoryBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
      {children}
    </span>
  );
}

const marketplaceColors: Record<Marketplace, string> = {
  Amazon: "bg-[#FF9900]/15 text-[#995c00] border-[#FF9900]/30",
  "Mercado Livre": "bg-[#FFE600]/30 text-[#7a6b00] border-[#FFE600]/60",
  Shopee: "bg-[#EE4D2D]/15 text-[#c93a1d] border-[#EE4D2D]/30",
  Magalu: "bg-[#0086FF]/15 text-[#005bb0] border-[#0086FF]/30",
};

export function MarketplaceBadge({ name }: { name: Marketplace }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold",
        marketplaceColors[name],
      )}
    >
      {name}
    </span>
  );
}

const commissionStyles: Record<Commission, string> = {
  Alta: "bg-success/15 text-[oklch(0.4_0.12_150)] border-success/40",
  Média: "bg-warning/20 text-[oklch(0.4_0.08_80)] border-warning/40",
  Baixa: "bg-muted text-muted-foreground border-border",
  "Não informada": "bg-muted text-muted-foreground border-border",
};

export function CommissionBadge({ value }: { value: Commission }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        commissionStyles[value],
      )}
    >
      Comissão {value.toLowerCase()}
    </span>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 8
      ? "bg-success/15 text-[oklch(0.4_0.12_150)]"
      : score >= 6
      ? "bg-warning/20 text-[oklch(0.4_0.08_80)]"
      : "bg-muted text-muted-foreground";
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold", tone)}>
      Nota {score.toFixed(1)}
    </span>
  );
}
