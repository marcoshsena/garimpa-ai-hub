import {
  CATEGORIES,
  OPPORTUNITY_TYPES,
  type Category,
  type Commission,
  type OpportunityType,
} from "@/lib/garimpa/types";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface Filters {
  query: string;
  category: Category | "all";
  minScore: number;
  commission: Commission | "all";
  opportunityType: OpportunityType;
}

export const defaultFilters: Filters = {
  query: "",
  category: "all",
  minScore: 0,
  commission: "all",
  opportunityType: "Melhores oportunidades",
};

const baseSelect =
  "h-9 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function ProductFilters({
  value,
  onChange,
}: {
  value: Filters;
  onChange: (f: Filters) => void;
}) {
  const update = <K extends keyof Filters>(key: K, v: Filters[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="grid gap-3 rounded-xl border bg-card p-4 shadow-sm md:grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value.query}
          onChange={(e) => update("query", e.target.value)}
          placeholder="Pesquisar produtos..."
          className="pl-9"
        />
      </div>
      <select
        className={baseSelect}
        value={value.category}
        onChange={(e) => update("category", e.target.value as Filters["category"])}
      >
        <option value="all">Todas categorias</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select
        className={baseSelect}
        value={String(value.minScore)}
        onChange={(e) => update("minScore", Number(e.target.value))}
      >
        <option value="0">Nota mínima</option>
        <option value="6">6+</option>
        <option value="7">7+</option>
        <option value="8">8+</option>
        <option value="9">9+</option>
      </select>
      <select
        className={baseSelect}
        value={value.commission}
        onChange={(e) => update("commission", e.target.value as Filters["commission"])}
      >
        <option value="all">Qualquer comissão</option>
        <option value="Alta">Alta</option>
        <option value="Média">Média</option>
        <option value="Baixa">Baixa</option>
        <option value="Não informada">Não informada</option>
      </select>
      <select
        className={baseSelect}
        value={value.opportunityType}
        onChange={(e) => update("opportunityType", e.target.value as OpportunityType)}
        title="Tipo de oportunidade — define a ordenação"
      >
        {OPPORTUNITY_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  );
}
