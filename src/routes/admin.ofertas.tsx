import { createFileRoute } from "@tanstack/react-router";
import { AdminOfferForm } from "@/components/garimpa/AdminOfferForm";
import { useOffers, useProducts } from "@/lib/garimpa/store";
import { MarketplaceBadge, CommissionBadge } from "@/components/garimpa/Badges";

export const Route = createFileRoute("/admin/ofertas")({
  component: AdminOffers,
});

function AdminOffers() {
  const offers = useOffers();
  const products = useProducts();
  const nameFor = (id: string) => products.find((p) => p.id === id)?.name ?? "—";
  return (
    <div className="space-y-8">
      <AdminOfferForm />
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Ofertas cadastradas ({offers.length})
        </h2>
        <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5">Produto</th>
                <th className="px-3 py-2.5">Marketplace</th>
                <th className="px-3 py-2.5">Preço</th>
                <th className="px-3 py-2.5">Comissão</th>
                <th className="px-3 py-2.5">Melhor?</th>
                <th className="px-3 py-2.5">Atualizado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {offers.map((o) => (
                <tr key={o.id}>
                  <td className="px-3 py-2.5">{nameFor(o.productId)}</td>
                  <td className="px-3 py-2.5"><MarketplaceBadge name={o.marketplace} /></td>
                  <td className="px-3 py-2.5">
                    {o.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </td>
                  <td className="px-3 py-2.5"><CommissionBadge value={o.commission} /></td>
                  <td className="px-3 py-2.5">{o.bestOption ? "Sim" : "Não"}</td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">
                    {new Date(o.updatedAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
