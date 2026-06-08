import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, Search, GitCompare, Megaphone, Check, X } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Garimpa AI — Curadoria inteligente para afiliados" },
      {
        name: "description",
        content:
          "Encontre produtos com potencial, compare marketplaces e gere anúncios prontos para WhatsApp, Instagram, Reels e Stories.",
      },
      { property: "og:title", content: "Garimpa AI" },
      {
        property: "og:description",
        content:
          "Assistente para afiliados e criadores de canais de ofertas. Curadoria, comparação e anúncios prontos sem parecer spam.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-navy text-brand-orange">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-xl font-semibold text-brand-navy">
              Garimpa <span className="text-brand-orange">AI</span>
            </span>
          </div>
          <Button
            asChild
            className="bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange/90"
          >
            <Link to="/dashboard">Acessar dashboard</Link>
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(60%_60%_at_70%_0%,oklch(0.72_0.18_50/0.6),transparent_60%)]" />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/80">
            <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
            Para curadores de achadinhos
          </span>
          <h1 className="mt-5 text-balance text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Encontre produtos com potencial, compare marketplaces e gere anúncios prontos{" "}
            <span className="text-brand-orange">sem parecer spam.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-white/80 sm:text-lg">
            Ideal para afiliados, criadores de achadinhos e canais de ofertas no WhatsApp, Telegram e Instagram.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-brand-orange text-brand-orange-foreground hover:bg-brand-orange/90"
            >
              <Link to="/dashboard">Acessar dashboard</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/gerador">Ver gerador de anúncios</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold text-brand-navy">Como funciona</h2>
          <p className="mt-2 text-muted-foreground">Três passos simples, do produto ao anúncio pronto.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Search, title: "1. Escolha ou pesquise", desc: "Navegue pela curadoria de produtos sugeridos ou pesquise por nome e categoria." },
            { icon: GitCompare, title: "2. Compare ofertas", desc: "Veja o comparativo lado a lado entre Amazon, Mercado Livre, Shopee e Magalu." },
            { icon: Megaphone, title: "3. Gere o anúncio", desc: "Receba textos prontos para WhatsApp, Instagram, Reels e Stories com tom anti-spam." },
          ].map((s) => (
            <div key={s.title} className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-orange/15 text-brand-orange">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-brand-navy">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-semibold text-brand-navy">O que o app não promete</h2>
            <p className="mt-2 text-muted-foreground">Transparência primeiro. Sem promessas vazias.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Não promete renda garantida.",
              "Não mostra comissão exata.",
              "Não substitui revisão humana.",
              "Não usa scraping não autorizado.",
            ].map((t) => (
              <div key={t} className="flex items-start gap-3 rounded-lg border bg-card p-4">
                <X className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                <span className="text-sm">{t}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Curadoria com dados claros e revisáveis.",
              "Comissão indicada como alta/média/baixa — sempre estimativa.",
              "Você sempre revisa antes de divulgar.",
              "Estrutura preparada para integrações futuras autorizadas.",
            ].map((t) => (
              <div key={t} className="flex items-start gap-3 rounded-lg border border-success/40 bg-success/5 p-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-[oklch(0.4_0.12_150)]" />
                <span className="text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t bg-background">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Garimpa AI</p>
          <div className="flex gap-4">
            <Link to="/privacidade" className="hover:text-foreground">Privacidade</Link>
            <Link to="/termos" className="hover:text-foreground">Termos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
