import { useState } from "react";
import { CATEGORIES, MARKETPLACES, type Product } from "@/lib/garimpa/types";
import { addProduct } from "@/lib/garimpa/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const baseSelect =
  "h-9 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

const initial = {
  name: "",
  category: CATEGORIES[0],
  niche: "",
  image: "",
  shortDescription: "",
  idealAudience: "",
  problemSolved: "",
  strongPoint: "",
  attentionPoint: "",
  opportunityScore: "8",
  bestMarketplace: MARKETPLACES[0],
  status: "Ativo" as Product["status"],
  featured: false,
};

export function AdminProductForm() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ok, setOk] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Informe o nome.";
    if (!form.shortDescription.trim()) errs.shortDescription = "Descrição curta é obrigatória.";
    if (!form.strongPoint.trim()) errs.strongPoint = "Informe o ponto forte.";
    const score = Number(form.opportunityScore);
    if (Number.isNaN(score) || score < 0 || score > 10) errs.opportunityScore = "Nota entre 0 e 10.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const product: Product = {
      id: `p-${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      niche: form.niche.trim() || undefined,
      image: form.image.trim() || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
      shortDescription: form.shortDescription.trim(),
      idealAudience: form.idealAudience.trim(),
      problemSolved: form.problemSolved.trim(),
      strongPoint: form.strongPoint.trim(),
      attentionPoint: form.attentionPoint.trim(),
      opportunityScore: score,
      bestMarketplace: form.bestMarketplace,
      status: form.status,
      featured: form.featured,
      updatedAt: new Date().toISOString(),
    };
    addProduct(product);
    setForm(initial);
    setOk(true);
    setTimeout(() => setOk(false), 2500);
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-xl border bg-card p-5 shadow-sm md:grid-cols-2">
      <Field label="Nome *" error={errors.name}>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </Field>
      <Field label="Categoria">
        <select
          className={baseSelect}
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value as Product["category"] })}
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Nicho">
        <Input value={form.niche} onChange={(e) => setForm({ ...form, niche: e.target.value })} />
      </Field>
      <Field label="Imagem (URL)">
        <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
      </Field>
      <Field label="Descrição curta *" error={errors.shortDescription} full>
        <Input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
      </Field>
      <Field label="Público ideal">
        <Input value={form.idealAudience} onChange={(e) => setForm({ ...form, idealAudience: e.target.value })} />
      </Field>
      <Field label="Problema que resolve">
        <Input value={form.problemSolved} onChange={(e) => setForm({ ...form, problemSolved: e.target.value })} />
      </Field>
      <Field label="Ponto forte *" error={errors.strongPoint}>
        <Input value={form.strongPoint} onChange={(e) => setForm({ ...form, strongPoint: e.target.value })} />
      </Field>
      <Field label="Ponto de atenção">
        <Input value={form.attentionPoint} onChange={(e) => setForm({ ...form, attentionPoint: e.target.value })} />
      </Field>
      <Field label="Nota (0-10)" error={errors.opportunityScore}>
        <Input
          type="number" step="0.1" min="0" max="10"
          value={form.opportunityScore}
          onChange={(e) => setForm({ ...form, opportunityScore: e.target.value })}
        />
      </Field>
      <Field label="Melhor marketplace sugerido">
        <select
          className={baseSelect}
          value={form.bestMarketplace}
          onChange={(e) => setForm({ ...form, bestMarketplace: e.target.value as Product["bestMarketplace"] })}
        >
          {MARKETPLACES.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </Field>
      <Field label="Status">
        <select
          className={baseSelect}
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as Product["status"] })}
        >
          <option>Ativo</option><option>Rascunho</option><option>Pausado</option>
        </select>
      </Field>
      <Field label="Destaque">
        <label className="flex h-9 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Exibir como destaque
        </label>
      </Field>
      <div className="md:col-span-2 flex items-center justify-between gap-3">
        {ok && <span className="text-sm text-[oklch(0.4_0.12_150)]">Produto cadastrado!</span>}
        <Button
          type="submit"
          className="ml-auto bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange/90"
        >
          Salvar produto
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  error,
  full,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
