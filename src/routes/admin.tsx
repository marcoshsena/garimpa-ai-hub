import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/garimpa/AppShell";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Garimpa AI" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-brand-navy">Área administrativa</h1>
        <p className="text-sm text-muted-foreground">Cadastre produtos e ofertas manualmente.</p>
      </div>
      <div className="mb-6 flex gap-1 border-b">
        <Link
          to="/admin/produtos"
          activeProps={{ className: "border-brand-orange text-brand-navy" }}
          inactiveProps={{ className: "border-transparent text-muted-foreground hover:text-foreground" }}
          className="border-b-2 px-4 py-2 text-sm font-medium"
        >
          Produtos
        </Link>
        <Link
          to="/admin/ofertas"
          activeProps={{ className: "border-brand-orange text-brand-navy" }}
          inactiveProps={{ className: "border-transparent text-muted-foreground hover:text-foreground" }}
          className="border-b-2 px-4 py-2 text-sm font-medium"
        >
          Ofertas
        </Link>
      </div>
      <Outlet />
    </AppShell>
  );
}
