import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Produtos" },
  { to: "/gerador", label: "Gerador" },
  { to: "/salvos", label: "Salvos" },
  { to: "/admin/produtos", label: "Admin" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-navy text-brand-orange">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-lg font-semibold text-brand-navy">
              Garimpa <span className="text-brand-orange">AI</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 overflow-x-auto text-sm">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeProps={{ className: "bg-brand-navy text-white" }}
                inactiveProps={{ className: "text-muted-foreground hover:bg-muted" }}
                className="rounded-md px-3 py-1.5 font-medium transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <footer className="mt-12 border-t bg-muted/30">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Garimpa AI — assistente para curadores de ofertas.</p>
          <div className="flex gap-4">
            <Link to="/privacidade" className="hover:text-foreground">Privacidade</Link>
            <Link to="/termos" className="hover:text-foreground">Termos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
