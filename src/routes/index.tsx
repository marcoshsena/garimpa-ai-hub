import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Search,
  GitCompare,
  Megaphone,
  Check,
  X,
  Zap,
  Target,
  ShieldCheck,
  LayoutDashboard,
  Users,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Garimpa AI — Curadoria inteligente para afiliados" },
      {
        name: "description",
        content:
          "Garimpe produtos com potencial, compare marketplaces e gere anúncios prontos para WhatsApp, Instagram, Reels e Stories.",
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
  const benefits = [
    {
      icon: Zap,
      title: "Encontre oportunidades mais rápido",
      desc: "Veja produtos sugeridos e filtre o que faz sentido para o seu canal.",
    },
    {
      icon: GitCompare,
      title: "Compare antes de divulgar",
      desc: "Analise preço, marketplace e dados principais antes de escolher uma oferta.",
    },
    {
      icon: Megaphone,
      title: "Gere anúncios prontos",
      desc: "Crie textos para WhatsApp, Instagram, Reels, Stories e Telegram em poucos cliques.",
    },
    {
      icon: LayoutDashboard,
      title: "Divulgue com mais organização",
      desc: "Tenha uma base clara para decidir o que vale a pena postar.",
    },
  ];

  const steps = [
    {
      icon: Search,
      title: "1. Escolha ou pesquise",
      desc: "Navegue pela curadoria de produtos sugeridos ou pesquise por nome e categoria.",
    },
    {
      icon: GitCompare,
      title: "2. Compare ofertas",
      desc: "Veja preço, marketplace e dados principais para tomar uma decisão melhor.",
    },
    {
      icon: Megaphone,
      title: "3. Gere o anúncio",
      desc: "Receba textos prontos para diferentes canais e adapte antes de divulgar.",
    },
  ];

  const audiences = [
    "Afiliados iniciantes",
    "Canais de achadinhos",
    "Criadores de conteúdo de ofertas",
    "Perfis de WhatsApp, Telegram e Instagram",
  ];

  const delivers = [
    "Curadoria com dados claros e revisáveis.",
    "Comparação entre marketplaces.",
    "Geração de anúncios como ponto de partida.",
    "Estrutura preparada para integrações futuras autorizadas.",
  ];

  const limits = [
    "Não promete renda garantida.",
    "Não mostra comissão exata quando esse dado não está disponível.",
    "Não substitui revisão humana.",
    "Não usa scraping não autorizado.",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-navy text-brand-orange shadow-sm">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-xl font-semibold text-brand-navy">
              Garimpa <span className="text-brand-orange">AI</span>
            </span>
          </Link>

          <Button
            asChild
            className="bg-brand-orange text-brand-orange-foreground shadow-sm hover:bg-brand-orange/90"
          >
            <Link to="/dashboard">Acessar dashboard</Link>
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0 opacity-25 [background:radial-gradient(60%_60%_at_70%_0%,oklch(0.72_0.18_50/0.75),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/10 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white/85 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
            Para afiliados e curadores de achadinhos
          </span>

          <h1 className="mx-auto mt-6 max-w-5xl text-balance text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Garimpe produtos com potencial, compare marketplaces e crie anúncios{" "}
            <span className="text-brand-orange">em minutos.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-7 text-white/80 sm:text-lg">
            O Garimpa AI ajuda afiliados e canais de ofertas a encontrar boas oportunidades,
            comparar opções e divulgar com mais rapidez, sem parecer spam.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-brand-orange text-brand-orange-foreground shadow-lg shadow-brand-orange/20 hover:bg-brand-orange/90"
            >
              <Link to="/dashboard">
                Explorar produtos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/gerador">Testar gerador de anúncios</Link>
            </Button>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-3 text-sm text-white/80 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <strong className="block text-lg text-white">Produtos</strong>
              Curadoria para divulgar melhor
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <strong className="block text-lg text-white">Comparação</strong>
              Ofertas lado a lado
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <strong className="block text-lg text-white">Anúncios</strong>
              Textos prontos para canais
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-orange">
            <Target className="h-3.5 w-3.5" />
            Benefícios
          </span>
          <h2 className="mt-4 text-3xl font-semibold text-brand-navy sm:text-4xl">
            O que o Garimpa AI faz por você
          </h2>
          <p className="mt-3 text-muted-foreground">
            Menos tempo procurando. Mais clareza para escolher e divulgar.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange transition group-hover:bg-brand-orange group-hover:text-white">
                <benefit.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-brand-navy">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/35 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold text-brand-navy sm:text-4xl">
              Como funciona
            </h2>
            <p className="mt-2 text-muted-foreground">
              Três passos simples, do produto ao anúncio pronto.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/15 text-brand-orange">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-brand-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 rounded-3xl border bg-card p-8 shadow-sm md:grid-cols-[1fr_1.2fr] md:p-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-navy/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-navy">
              <Users className="h-3.5 w-3.5" />
              Público ideal
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-brand-navy">
              Feito para quem divulga produtos
            </h2>
            <p className="mt-3 text-muted-foreground">
              Se você precisa encontrar produtos, comparar opções e criar divulgação com
              mais rapidez, o Garimpa AI foi pensado para esse fluxo.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {audiences.map((audience) => (
              <div
                key={audience}
                className="flex items-center gap-3 rounded-xl border bg-background p-4"
              >
                <Check className="h-5 w-5 shrink-0 text-[oklch(0.4_0.12_150)]" />
                <span className="text-sm font-medium">{audience}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/35 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-navy/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-navy">
              <ShieldCheck className="h-3.5 w-3.5" />
              Transparência
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-brand-navy sm:text-4xl">
              Transparência em primeiro lugar
            </h2>
            <p className="mt-3 text-muted-foreground">
              O Garimpa AI ajuda você a decidir melhor, mas a revisão final continua
              sendo sua.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-success/30 bg-success/5 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-brand-navy">O que o app entrega</h3>
              <div className="mt-5 space-y-3">
                {delivers.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-[oklch(0.4_0.12_150)]" />
                    <span className="text-sm leading-6">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-brand-navy">
                O que o app não promete
              </h3>
              <div className="mt-5 space-y-3">
                {limits.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <X className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                    <span className="text-sm leading-6">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-3xl bg-brand-navy p-8 text-center text-white shadow-lg md:p-12">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Pronto para garimpar melhores oportunidades?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/75">
            Explore produtos, compare ofertas e gere anúncios para divulgar com mais
            agilidade.
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

      <footer className="border-t bg-background">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Garimpa AI</p>
          <div className="flex gap-4">
            <Link to="/privacidade" className="hover:text-foreground">
              Privacidade
            </Link>
            <Link to="/termos" className="hover:text-foreground">
              Termos
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}