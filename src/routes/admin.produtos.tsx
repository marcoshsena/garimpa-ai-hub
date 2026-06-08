import { createFileRoute } from "@tanstack/react-router";
import { AdminProductForm } from "@/components/garimpa/AdminProductForm";
import { useProducts } from "@/lib/garimpa/store";
import { CategoryBadge } from "@/components/garimpa/Badges";

export const Route = createFileRoute("/admin/produtos")({
  component: AdminProducts,
});

function AdminProducts() {
  const products = useProducts();
  return (
    <div className="space-y-8">
      <AdminProductForm />
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Produtos cadastrados ({products.length})
        </h2>
        <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5">Nome</th>
                <th className="px-3 py-2.5">Categoria</th>
                <th className="px-3 py-2.5">Nota</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5">Destaque</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-3 py-2.5 font-medium">{p.name}</td>
                  <td className="px-3 py-2.5"><CategoryBadge>{p.category}</CategoryBadge></td>
                  <td className="px-3 py-2.5">{p.opportunityScore.toFixed(1)}</td>
                  <td className="px-3 py-2.5">{p.status}</td>
                  <td className="px-3 py-2.5">{p.featured ? "Sim" : "Não"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
