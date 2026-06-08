import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/garimpa/AppShell";

export const Route = createFileRoute("/privacidade")({
  head: () => ({ meta: [{ title: "Privacidade — Garimpa AI" }] }),
  component: Privacy,
});

function Privacy() {
  return (
    <AppShell>
      <article className="prose mx-auto max-w-3xl space-y-4">
        <h1 className="text-3xl font-semibold text-brand-navy">Política de Privacidade</h1>
        <p className="text-muted-foreground">
          O Garimpa AI coleta apenas os dados necessários para oferecer a experiência de curadoria de produtos e geração de anúncios.
        </p>
        <h2 className="text-xl font-semibold">Dados que podemos coletar</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>Nome e e-mail (quando houver cadastro).</li>
          <li>Produtos salvos pelo usuário.</li>
          <li>Anúncios gerados para uso pessoal.</li>
          <li>Histórico de uso para melhorar a curadoria.</li>
        </ul>
        <h2 className="text-xl font-semibold">O que não coletamos</h2>
        <p className="text-sm">Não coletamos dados sensíveis (origem racial, religião, saúde, biometria, etc.).</p>
        <h2 className="text-xl font-semibold">Seus direitos</h2>
        <p className="text-sm">
          Você pode solicitar a correção ou exclusão dos seus dados a qualquer momento. Basta entrar em contato com a equipe responsável.
        </p>
        <h2 className="text-xl font-semibold">Responsabilidade do usuário</h2>
        <p className="text-sm">
          Links, preços e produtos exibidos são responsabilidade de revisão do próprio usuário antes da publicação em qualquer canal.
        </p>
      </article>
    </AppShell>
  );
}
