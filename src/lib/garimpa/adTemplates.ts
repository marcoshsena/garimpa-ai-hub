import type { Offer, Product } from "./types";

export type AdFormat =
  | "whatsapp_curto"
  | "whatsapp_completo"
  | "telegram"
  | "instagram_feed"
  | "instagram_carrossel"
  | "stories"
  | "reels"
  | "tiktok"
  | "premium_ai_video"
  | "premium_ugc_video"
  | "premium_review_video"
  | "premium_comparison_video";

export interface AdFormatOption {
  id: AdFormat;
  label: string;
  description: string;
  category: "Mensageria" | "Instagram" | "TikTok" | "Premium";
}

export interface GeneratedAdBlock {
  title: string;
  content: string;
}

export interface GeneratedAd {
  format: AdFormat;
  label: string;
  blocks: GeneratedAdBlock[];
}

export const AD_FORMATS: AdFormatOption[] = [
  {
    id: "whatsapp_curto",
    label: "WhatsApp curto",
    description: "Mensagem rápida para grupos e listas.",
    category: "Mensageria",
  },
  {
    id: "whatsapp_completo",
    label: "WhatsApp completo",
    description: "Texto mais detalhado, com benefício e ponto de atenção.",
    category: "Mensageria",
  },
  {
    id: "telegram",
    label: "Telegram",
    description: "Post organizado para canal de ofertas.",
    category: "Mensageria",
  },
  {
    id: "instagram_feed",
    label: "Instagram Feed",
    description: "Legenda para publicação no feed.",
    category: "Instagram",
  },
  {
    id: "instagram_carrossel",
    label: "Instagram Carrossel",
    description: "Texto slide a slide para carrossel.",
    category: "Instagram",
  },
  {
    id: "stories",
    label: "Stories",
    description: "Sequência curta para stories com CTA.",
    category: "Instagram",
  },
  {
    id: "reels",
    label: "Reels",
    description: "Roteiro curto para vídeo vertical.",
    category: "Instagram",
  },
  {
    id: "tiktok",
    label: "TikTok",
    description: "Hook, roteiro, legenda e texto na tela.",
    category: "TikTok",
  },
  {
    id: "premium_ai_video",
    label: "Premium — Vídeo IA",
    description: "Prompt completo para gerar vídeo vertical com IA.",
    category: "Premium",
  },
  {
    id: "premium_ugc_video",
    label: "Premium — UGC IA",
    description: "Prompt para vídeo estilo usuário real usando o produto.",
    category: "Premium",
  },
  {
    id: "premium_review_video",
    label: "Premium — Review IA",
    description: "Prompt para vídeo de avaliação do produto.",
    category: "Premium",
  },
  {
    id: "premium_comparison_video",
    label: "Premium — Comparativo IA",
    description: "Prompt para vídeo comparando marketplaces.",
    category: "Premium",
  },
];

const priceFmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const numberFmt = (n: number) => n.toLocaleString("pt-BR");

const affiliateLink = "[cole seu link afiliado]";

function cleanHashtag(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "");
}

function getHashtags(product: Product, offer: Offer) {
  const category = cleanHashtag(product.category);
  const marketplace = cleanHashtag(offer.marketplace);

  return [
    "#achadinhos",
    "#ofertas",
    "#comprasonline",
    `#${category}`,
    `#${marketplace}`,
    "#garimpai",
  ].join(" ");
}

function getOfferProof(offer: Offer) {
  const parts: string[] = [];

  if (offer.rating) {
    parts.push(`avaliação ${offer.rating.toFixed(1)} de 5`);
  }

  if (offer.reviews) {
    parts.push(`${numberFmt(offer.reviews)} avaliações`);
  }

  if (offer.sales) {
    parts.push(`aprox. ${numberFmt(offer.sales)} vendas`);
  }

  return parts.join(" • ");
}

function getDisclosure() {
  return "Preço, disponibilidade e comissão podem mudar. Revise antes de divulgar.";
}

function getAffiliateNotice() {
  return "Alguns links podem ser de afiliado. Você não paga nada a mais por isso.";
}

function getFormatLabel(format: AdFormat) {
  return AD_FORMATS.find((item) => item.id === format)?.label ?? "Formato";
}

export function generateAd(format: AdFormat, product: Product, offer: Offer): GeneratedAd {
  const price = priceFmt(offer.price);
  const proof = getOfferProof(offer);
  const hashtags = getHashtags(product, offer);
  const label = getFormatLabel(format);

  switch (format) {
    case "whatsapp_curto":
      return {
        format,
        label,
        blocks: [
          {
            title: "Mensagem",
            content: `🛒 ${product.name}

${product.strongPoint}

💸 ${price} na ${offer.marketplace}
🔗 ${affiliateLink}

${getDisclosure()}`,
          },
        ],
      };

    case "whatsapp_completo":
      return {
        format,
        label,
        blocks: [
          {
            title: "Gancho",
            content: `Achei uma opção interessante para quem precisa de ${product.problemSolved.toLowerCase()}.`,
          },
          {
            title: "Mensagem completa",
            content: `🏷️ ${product.name}

${product.shortDescription}

✅ Por que vale olhar:
${product.strongPoint}

⚠️ Ponto de atenção:
${product.attentionPoint}

💸 Preço visto: ${price}
🛒 Marketplace: ${offer.marketplace}
${proof ? `⭐ Dados da oferta: ${proof}` : ""}

🔗 Link: ${affiliateLink}

${getAffiliateNotice()}
${getDisclosure()}`,
          },
        ],
      };

    case "telegram":
      return {
        format,
        label,
        blocks: [
          {
            title: "Post para Telegram",
            content: `🔥 ACHADO DO DIA

${product.name}

${product.shortDescription}

💰 Preço: ${price}
🛒 Marketplace: ${offer.marketplace}
⭐ ${proof || "Dados de avaliação não informados"}

✅ Destaque:
${product.strongPoint}

⚠️ Atenção:
${product.attentionPoint}

🔗 Link:
${affiliateLink}

${getDisclosure()}`,
          },
        ],
      };

    case "instagram_feed":
      return {
        format,
        label,
        blocks: [
          {
            title: "Legenda",
            content: `${product.name}: vale conhecer?

${product.shortDescription}

Esse produto pode ajudar quem sofre com:
${product.problemSolved}

✅ Ponto forte:
${product.strongPoint}

⚠️ Antes de comprar:
${product.attentionPoint}

💸 Preço visto: ${price}
🛒 Onde encontrei: ${offer.marketplace}

Salva esse achado para conferir depois.

${getAffiliateNotice()}
${getDisclosure()}

${hashtags}`,
          },
          {
            title: "CTA",
            content: "Comente “link” ou confira o link disponível no canal/perfil.",
          },
        ],
      };

    case "instagram_carrossel":
      return {
        format,
        label,
        blocks: [
          {
            title: "Slide 1",
            content: `Você compraria esse ${product.name}?`,
          },
          {
            title: "Slide 2",
            content: `O problema: ${product.problemSolved}`,
          },
          {
            title: "Slide 3",
            content: `A solução: ${product.shortDescription}`,
          },
          {
            title: "Slide 4",
            content: `Ponto forte: ${product.strongPoint}`,
          },
          {
            title: "Slide 5",
            content: `Atenção antes de comprar: ${product.attentionPoint}`,
          },
          {
            title: "Slide 6",
            content: `Preço visto: ${price} na ${offer.marketplace}

Confira antes que o preço mude.`,
          },
          {
            title: "Legenda do carrossel",
            content: `Esse é um daqueles achados que podem facilitar a rotina.

${product.name}

💸 ${price}
🛒 ${offer.marketplace}

${getDisclosure()}

${hashtags}`,
          },
        ],
      };

    case "stories":
      return {
        format,
        label,
        blocks: [
          {
            title: "Story 1",
            content: `Você também passa por isso?

${product.problemSolved}`,
          },
          {
            title: "Story 2",
            content: `Olha esse achado:

${product.name}`,
          },
          {
            title: "Story 3",
            content: `Por que chamou atenção:

${product.strongPoint}`,
          },
          {
            title: "Story 4",
            content: `💸 ${price}
🛒 ${offer.marketplace}

Toque no link 👆

${getDisclosure()}`,
          },
        ],
      };

    case "reels":
      return {
        format,
        label,
        blocks: [
          {
            title: "Hook",
            content: `Esse achado resolve um problema que muita gente ignora.`,
          },
          {
            title: "Roteiro",
            content: `Duração sugerida: 15 a 25 segundos

Cena 1:
Mostrar o problema: ${product.problemSolved}

Cena 2:
Mostrar o produto: ${product.name}

Cena 3:
Destacar o benefício principal: ${product.strongPoint}

Cena 4:
Mostrar o ponto de atenção com honestidade: ${product.attentionPoint}

Cena 5:
Mostrar preço e marketplace: ${price} na ${offer.marketplace}

Fechamento:
"Confere o link e revisa antes de comprar."`,
          },
          {
            title: "Texto na tela",
            content: `• Achado útil
• ${product.category}
• ${price}
• ${offer.marketplace}
• Preço pode mudar`,
          },
          {
            title: "Legenda",
            content: `Esse achado pode facilitar a rotina de muita gente.

${product.name}

${getDisclosure()}

${hashtags}`,
          },
        ],
      };

    case "tiktok":
      return {
        format,
        label,
        blocks: [
          {
            title: "Hook viral",
            content: `Como eu vivi tanto tempo sem isso?`,
          },
          {
            title: "Roteiro TikTok",
            content: `Duração sugerida: 15 a 20 segundos

Cena 1 — Quebra de padrão:
Mostrar a situação antes: ${product.problemSolved}

Cena 2 — Apresentação rápida:
"Olha esse ${product.name}"

Cena 3 — Demonstração:
Mostrar o benefício: ${product.strongPoint}

Cena 4 — Prova/decisão:
Mostrar preço, avaliação ou marketplace:
${price} na ${offer.marketplace}
${proof ? proof : "Dados da oferta devem ser revisados."}

Cena 5 — CTA:
"Confere o link e vê se ainda está nesse preço."`,
          },
          {
            title: "Texto na tela",
            content: `POV: você encontra um produto simples que resolve um problema chato

${product.name}
${price}
${offer.marketplace}`,
          },
          {
            title: "Legenda TikTok",
            content: `Esse achado aqui é simples, mas pode resolver um problema bem comum.

${product.name}

💸 ${price}
🛒 ${offer.marketplace}

${getDisclosure()}

${hashtags} #tiktokmademebuyit`,
          },
          {
            title: "CTA",
            content: "Confira o link e revise preço, frete e avaliações antes de comprar.",
          },
        ],
      };

    case "premium_ai_video":
      return {
        format,
        label,
        blocks: [
          {
            title: "Prompt premium para vídeo IA",
            content: `Crie um vídeo vertical 9:16, estilo anúncio orgânico para redes sociais.

Produto:
${product.name}

Objetivo do vídeo:
Mostrar como o produto ajuda a resolver este problema: ${product.problemSolved}

Público-alvo:
${product.idealAudience}

Estilo visual:
Vídeo moderno, limpo, com aparência realista, iluminação natural, câmera suave, ritmo rápido e visual de conteúdo nativo para redes sociais.

Duração sugerida:
20 a 30 segundos.

Cenas:
1. Mostrar uma pessoa enfrentando o problema: ${product.problemSolved}
2. Apresentar o produto de forma natural.
3. Mostrar o produto sendo usado.
4. Destacar o benefício principal: ${product.strongPoint}
5. Mostrar rapidamente o ponto de atenção: ${product.attentionPoint}
6. Finalizar com preço visto e marketplace: ${price} na ${offer.marketplace}

Texto na tela:
"Achado útil para facilitar a rotina"
"${product.name}"
"${price} na ${offer.marketplace}"
"Revise o preço antes de comprar"

CTA final:
"Confira no link."

Restrições:
Não prometer resultado garantido.
Não exagerar benefícios.
Não afirmar que é o melhor produto do mercado.
Não inventar dados além dos fornecidos.`,
          },
        ],
      };

    case "premium_ugc_video":
      return {
        format,
        label,
        blocks: [
          {
            title: "Prompt UGC IA",
            content: `Crie um vídeo vertical 9:16 em estilo UGC realista.

Contexto:
Uma pessoa comum mostra o produto como se tivesse encontrado um achado útil para o dia a dia.

Produto:
${product.name}

Marketplace:
${offer.marketplace}

Preço visto:
${price}

Roteiro:
Cena 1:
Pessoa aparece mostrando o problema: ${product.problemSolved}

Cena 2:
Pessoa diz: "Eu achei isso aqui e achei bem útil."

Cena 3:
Mostrar o produto em uso.

Cena 4:
Destacar: ${product.strongPoint}

Cena 5:
Aviso honesto: ${product.attentionPoint}

Cena 6:
Finalizar com: "Vi por ${price} na ${offer.marketplace}. Confere se ainda está nesse preço."

Estilo:
Natural, caseiro, confiável, sem parecer propaganda exagerada.

Texto na tela:
"Achado útil"
"${price}"
"${offer.marketplace}"

Evitar:
Promessas exageradas.
Tom artificial.
Falas muito comerciais.`,
          },
        ],
      };

    case "premium_review_video":
      return {
        format,
        label,
        blocks: [
          {
            title: "Prompt Review IA",
            content: `Crie um vídeo vertical 9:16 de review curto.

Produto:
${product.name}

Estrutura do vídeo:
1. Apresentação do produto.
2. Para quem serve: ${product.idealAudience}
3. Problema que resolve: ${product.problemSolved}
4. Ponto forte: ${product.strongPoint}
5. Ponto de atenção: ${product.attentionPoint}
6. Preço visto: ${price}
7. Marketplace: ${offer.marketplace}
8. CTA final.

Tom:
Review honesto, objetivo e confiável.

Texto na tela:
"Review rápido"
"Vale olhar?"
"${product.strongPoint}"
"Atenção: ${product.attentionPoint}"
"${price} na ${offer.marketplace}"

CTA:
"Confira o link e revise os detalhes antes de comprar."

Não inventar características técnicas não informadas.`,
          },
        ],
      };

    case "premium_comparison_video":
      return {
        format,
        label,
        blocks: [
          {
            title: "Prompt Comparativo IA",
            content: `Crie um vídeo vertical 9:16 em estilo comparativo de marketplace.

Produto:
${product.name}

Oferta selecionada:
${offer.marketplace} — ${price}

Objetivo:
Mostrar que o usuário deve comparar preço, avaliação, frete e disponibilidade antes de divulgar ou comprar.

Estrutura:
Cena 1:
Tela com texto: "Compare antes de divulgar"

Cena 2:
Mostrar o produto: ${product.name}

Cena 3:
Mostrar critérios de comparação:
- Preço
- Avaliação
- Prova social
- Frete
- Comissão provável
- Disponibilidade

Cena 4:
Destacar a oferta selecionada:
${offer.marketplace} por ${price}

Cena 5:
Aviso:
"Preço e disponibilidade podem mudar."

Cena 6:
CTA:
"Use os dados para decidir melhor."

Estilo:
Moderno, limpo, com cards flutuantes e animações simples.

Não afirmar que uma oferta é definitivamente a melhor se os dados não forem suficientes.
Não prometer lucro ou vendas.`,
          },
        ],
      };
  }
}
