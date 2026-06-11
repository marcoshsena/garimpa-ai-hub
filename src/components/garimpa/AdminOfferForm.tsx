import { useState } from "react";
import { AVAILABILITIES, MARKETPLACES, type Offer } from "@/lib/garimpa/types";
import { addOffer, useProducts } from "@/lib/garimpa/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const baseSelect =
  "h-9 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

interface OfferFormState {
  productId: string;
  marketplace: Offer["marketplace"];
  title: string;
  price: string;
  rating: string;
  reviews: string;
  sales: string;
  availability: Offer["availability"];
  shipping: string;
  originalLink: string;
  affiliateLink: string;
  commission: Offer["commission"];
  note: string;
  offerScore: string;
  bestOption: boolean;
}

export function AdminOfferForm() {
  const products = useProducts();
  const [form, setForm] = useState<OfferFormState>({
    productId: products[0]?.id ?? "",
    marketplace: MARKETPLACES[0],
    title: "",
    price: "",
    rating: "4.5",
    reviews: "0",
    sales: "0",
    availability: "Em estoque",
    shipping: "",
    originalLink: "",
    affiliateLink: "",
    commission: "Média",
    note: "",
    offerScore: "8",
    bestOption: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ok, setOk] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.productId) errs.productId = "Selecione um produto.";
    if (!form.title.trim()) errs.title = "Informe o título.";
    const price = Number(form.price);
    if (!price || price <= 0) errs.price = "Preço inválido.";
    if (!form.originalLink.trim()) errs.originalLink = "Informe o link original.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const offer: Offer = {
      id: `o-${Date.now()}`,
      productId: form.productId,
      marketplace: form.marketplace,
      title: form.title.trim(),
      price,
      rating: Number(form.rating) || 0,
      reviews: Number(form.reviews) || 0,
      sales: Number(form.sales) || 0,
      availability: form.availability,
      shipping: form.shipping.trim(),
      originalLink: form.originalLink.trim(),
      affiliateLink: form.affiliateLink.trim(),
      commission: form.commission,
      note: form.note.trim() || undefined,
      offerScore: Number(form.offerScore) || 0,
      bestOption: form.bestOption,
      updatedAt: new Date().toISOString(),
    };
    addOffer(offer);
    setOk(true);
    setForm({ ...form, title: "", price: "", originalLink: "", affiliateLink: "", note: "" });
    setTimeout(() => setOk(false), 2500);
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-xl border bg-card p-5 shadow-sm md:grid-cols-2">
      <Field label="Produto *" error={errors.productId}>
        <select
          className={baseSelect}
          value={form.productId}
          onChange={(e) => setForm({ ...form, productId: e.target.value })}
        >
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </Field>
      <Field label="Marketplace">
        <select
          className={baseSelect}
          value={form.marketplace}
          onChange={(e) => setForm({ ...form, marketplace: e.target.value as Offer["marketplace"] })}
        >
          {MARKETPLACES.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </Field>
      <Field label="Título da oferta *" error={errors.title} full>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </Field>
      <Field label="Preço (R$) *" error={errors.price}>
        <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
      </Field>
      <Field label="Avaliação (0-5)">
        <Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
      </Field>
      <Field label="Nº avaliações">
        <Input type="number" value={form.reviews} onChange={(e) => setForm({ ...form, reviews: e.target.value })} />
      </Field>
      <Field label="Vendas aproximadas">
        <Input type="number" value={form.sales} onChange={(e) => setForm({ ...form, sales: e.target.value })} />
      </Field>
      <Field label="Disponibilidade">
        <select
          className={baseSelect}
          value={form.availability}
          onChange={(e) => setForm({ ...form, availability: e.target.value as Offer["availability"] })}
        >
          {AVAILABILITIES.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </Field>
      <Field label="Frete / entrega">
        <Input value={form.shipping} onChange={(e) => setForm({ ...form, shipping: e.target.value })} />
      </Field>
      <Field label="Link original *" error={errors.originalLink} full>
        <Input value={form.originalLink} onChange={(e) => setForm({ ...form, originalLink: e.target.value })} placeholder="https://..." />
      </Field>
      <Field label="Link afiliado" full>
        <Input value={form.affiliateLink} onChange={(e) => setForm({ ...form, affiliateLink: e.target.value })} placeholder="https://..." />
      </Field>
      <Field label="Comissão provável">
        <select
          className={baseSelect}
          value={form.commission}
          onChange={(e) => setForm({ ...form, commission: e.target.value as Offer["commission"] })}
        >
          <option>Alta</option><option>Média</option><option>Baixa</option><option>Não informada</option>
        </select>
      </Field>
      <Field label="Nota da oferta (0-10)">
        <Input type="number" step="0.1" min="0" max="10" value={form.offerScore} onChange={(e) => setForm({ ...form, offerScore: e.target.value })} />
      </Field>
      <Field label="Observação" full>
        <Input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
      </Field>
      <Field label="Melhor opção?">
        <label className="flex h-9 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.bestOption}
            onChange={(e) => setForm({ ...form, bestOption: e.target.checked })}
          />
          Marcar como melhor opção
        </label>
      </Field>
      <div className="md:col-span-2 flex items-center justify-between gap-3">
        {ok && <span className="text-sm text-[oklch(0.4_0.12_150)]">Oferta cadastrada!</span>}
        <Button
          type="submit"
          className="ml-auto bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange/90"
        >
          Salvar oferta
        </Button>
      </div>
    </form>
  );
}

function Field({
  label, children, error, full,
}: { label: string; children: React.ReactNode; error?: string; full?: boolean }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
