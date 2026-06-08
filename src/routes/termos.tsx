import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/garimpa/AppShell";

export const Route = createFileRoute("/termos")({
  head: () => ({ meta: [{ title: "Termos de Uso — Garimpa AI" }] }),
  component: Terms,
});

function Terms() {
  return (
    <AppShell>
      <article className="prose mx-auto max-w-3xl space-y-4">
        <h1 className="text-3xl font-semibold text-brand-navy">Termos de Uso</h1>
        <p className="text-muted-foreground">
          Ao usar o Garimpa AI, você concorda com os termos abaixo.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm">
          <li>O app <strong>não promete</strong> renda, lucro ou venda garantida.</li>
          <li>
            As informações de preço, disponibilidade e comissão são estimativas ou dados cadastrados manualmente — podem mudar a qualquer momento.
          </li>
          <li>O usuário é responsável por revisar links, preços e disponibilidade antes de divulgar em qualquer canal.</li>
          <li>
            O Garimpa AI não é afiliado oficialmente às plataformas Amazon, Mercado Livre, Shopee ou Magalu, salvo se houver autorização ou parceria formal divulgada futuramente.
          </li>
          <li>
            O uso indevido da ferramenta para spam, propaganda enganosa ou outras práticas que violem leis ou políticas das plataformas é de responsabilidade exclusiva do usuário.
          </li>
        </ul>
      </article>
    </AppShell>
  );
}
