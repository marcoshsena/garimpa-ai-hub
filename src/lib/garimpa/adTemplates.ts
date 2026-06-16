import type { Product, Offer } from "./types";

export type AdFormat =
  | "whatsapp_curto"
  | "whatsapp_completo"
  | "telegram"
  | "instagram_feed"
  | "instagram_carrossel"
  | "story"
  | "reels"
  | "tiktok"
  | "premium_video_ia"
  | "premium_ugc_ia"
  | "premium_review_ia"
  | "premium_comparativo_ia";

export type AdFormatCategory = "Mensageria" | "Instagram" | "Vídeo curto" | "Premium IA";

export const AD_FORMATS: {
  id: AdFormat;
  label: string;
  description: string;
  category: AdFormatCategory;
  premium?: boolean;
}[] = [
  { id: "whatsapp_curto", label: "WhatsApp curto", description: "Mensagem rápida para grupos.", category: "Mensageria" },
  { id: "whatsapp_completo", label: "WhatsApp completo", description: "Texto mais detalhado.", category: "Mensageria" },
  { id: "telegram", label: "Telegram", description: "Post para canal de ofertas.", category: "Mensageria" },
  { id: "instagram_feed", label: "Instagram Feed", description: "Legenda para post de feed.", category: "Instagram" },
  { id: "instagram_carrossel", label: "Instagram Carrossel", description: "Roteiro de slides em sequência.", category: "Instagram" },
  { id: "story", label: "Stories", description: "Texto enxuto para sticker.", category: "Instagram" },
  { id: "reels", label: "Reels", description: "Roteiro curto para vídeo.", category: "Vídeo curto" },
  { id: "tiktok", label: "TikTok", description: "Roteiro nativo em tom TikTok.", category: "Vídeo curto" },
  { id: "premium_video_ia", label: "Vídeo IA", description: "Roteiro pronto para gerar vídeo com IA.", category: "Premium IA", premium: true },
  { id: "premium_ugc_ia", label: "UGC IA", description: "Roteiro estilo depoimento UGC.", category: "Premium IA", premium: true },
  { id: "premium_review_ia", label: "Review IA", description: "Estrutura de review com prós e contras.", category: "Premium IA", premium: true },
  { id: "premium_comparativo_ia", label: "Comparativo IA", description: "Roteiro comparando marketplaces.", category: "Premium IA", premium: true },
];

const priceFmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function generateAd(format: AdFormat, product: Product, offer: Offer): string {
  const price = priceFmt(offer.price);
  const link = "[cole seu link afiliado]";
  switch (format) {
    case "whatsapp_curto":
      return `🛒 ${product.name}
${product.strongPoint}
💸 ${price} na ${offer.marketplace}
🔗 ${link}
Preço pode mudar a qualquer momento.`;
    case "whatsapp_completo":
      return `🏠 ${product.category}

Achei esse(a) ${product.name} para ${product.idealAudience.toLowerCase()}

✅ Ponto forte: ${product.strongPoint}
⚠️ Atenção: ${product.attentionPoint}

💸 Preço visto: ${price}
🛒 Marketplace: ${offer.marketplace}
🔗 Link: ${link}

Preço e disponibilidade podem mudar.`;
    case "telegram":
      return `🔥 ${product.name}

${product.shortDescription}

💸 ${price} • ${offer.marketplace}
✅ ${product.strongPoint}
⚠️ ${product.attentionPoint}

🔗 ${link}

#${product.category.replace(/[^a-zA-Z]/g, "")} #ofertas`;
    case "instagram_feed":
      return `${product.name} — vale conhecer?

${product.shortDescription}

✅ ${product.strongPoint}
⚠️ ${product.attentionPoint}

Preço visto: ${price} na ${offer.marketplace}
Link na bio ou nos stories.

#${product.category.replace(/[^a-zA-Z]/g, "")} #achadinhos`;
    case "instagram_carrossel":
      return `Roteiro de carrossel (5 slides):

Slide 1 — Capa: "${product.name}, vale a pena?"
Slide 2 — Para quem é: ${product.idealAudience}
Slide 3 — Ponto forte: ${product.strongPoint}
Slide 4 — Atenção: ${product.attentionPoint}
Slide 5 — Onde encontrar: ${price} na ${offer.marketplace} (link na bio)

Legenda sugerida: "Achei esse(a) ${product.name} e separei o que importa antes de comprar. 👇"`;
    case "story":
      return `${product.name}
${product.strongPoint}
💸 ${price} • ${offer.marketplace}
👆 Toque no link
(preço sujeito a alteração)`;
    case "reels":
      return `Roteiro Reels (15–20s):

Gancho: "Olha o que eu encontrei pra ${product.idealAudience.split(" ")[0].toLowerCase()}…"
Cena 1: mostrar o produto — ${product.name}
Cena 2: destacar — ${product.strongPoint}
Cena 3: alerta honesto — ${product.attentionPoint}
Fechamento: "Tava por ${price} na ${offer.marketplace}. Link fixado."

Aviso: preço pode mudar.`;
    case "tiktok":
      return `Roteiro TikTok (20–30s):

Hook (0–3s): "Se você ${product.idealAudience.toLowerCase()}, presta atenção."
Cena 1 (3–10s): mostra ${product.name} em uso.
Cena 2 (10–18s): "O que eu gostei: ${product.strongPoint}."
Cena 3 (18–25s): "Sinceridade: ${product.attentionPoint}."
CTA (25–30s): "Tava ${price} na ${offer.marketplace}, link no perfil."

Trend: usar áudio em alta + texto na tela.`;
    case "premium_video_ia":
      return `🎬 Roteiro Vídeo IA (avatar + voz):

CENA 1 — Apresentação (5s)
"Você procurando ${product.category.toLowerCase()}? Olha esse ${product.name}."

CENA 2 — Problema (8s)
"${product.problemSolved}"

CENA 3 — Solução (10s)
"${product.strongPoint}"

CENA 4 — Prova (5s)
"Avaliação ${offer.rating.toFixed(1)} estrelas em ${offer.marketplace}."

CENA 5 — Oferta (5s)
"Hoje por ${price}. Link na descrição."

Estilo: avatar realista, voz feminina natural, B-roll do produto.`;
    case "premium_ugc_ia":
      return `📱 Roteiro UGC IA (depoimento natural):

"Gente, comprei esse(a) ${product.name} e preciso contar pra vocês.

Eu sou ${product.idealAudience.toLowerCase()} e estava com o problema de ${product.problemSolved.toLowerCase()}.

O que mais me surpreendeu foi: ${product.strongPoint}.

Sendo bem sincero(a), ${product.attentionPoint.toLowerCase()} — então fica essa observação.

Paguei ${price} na ${offer.marketplace}. Deixei o link aqui embaixo se quiserem ver."

Estilo: câmera frontal, luz natural, tom conversacional.`;
    case "premium_review_ia":
      return `⭐ Roteiro Review IA:

📦 PRODUTO
${product.name} — ${product.category}

👤 PARA QUEM SERVE
${product.idealAudience}

✅ PRÓS
• ${product.strongPoint}
• Avaliação ${offer.rating.toFixed(1)}/5 (${offer.reviews.toLocaleString("pt-BR")} avaliações)
• Comissão ${offer.commission.toLowerCase()} para afiliados

⚠️ CONTRAS / ATENÇÃO
• ${product.attentionPoint}

💸 PREÇO E ONDE COMPRAR
${price} na ${offer.marketplace}

🎯 VEREDITO
${product.shortDescription}

Link: ${link}`;
    case "premium_comparativo_ia":
      return `⚖️ Roteiro Comparativo IA:

Tema: "Onde comprar ${product.name} vale mais a pena?"

INTRO (10s)
"Eu pesquisei em vários marketplaces e a diferença surpreende."

DESTAQUE
${offer.marketplace} apareceu como a melhor opção encontrada:
• Preço: ${price}
• Avaliação: ${offer.rating.toFixed(1)} (${offer.reviews.toLocaleString("pt-BR")} avaliações)
• Disponibilidade: ${offer.availability}
${offer.sales ? `• Vendas aproximadas: ${offer.sales.toLocaleString("pt-BR")}` : ""}

CONCLUSÃO
"Se for comprar hoje, ${offer.marketplace} tava na melhor combinação de preço e confiança. Link fixado."

Aviso: preço pode mudar — confira antes.`;
  }
}
