import type { Product, Offer } from "./types";

export type AdFormat = "whatsapp_curto" | "whatsapp_completo" | "instagram" | "reels" | "story";

export const AD_FORMATS: { id: AdFormat; label: string; description: string }[] = [
  { id: "whatsapp_curto", label: "WhatsApp curto", description: "Mensagem rápida para grupos." },
  { id: "whatsapp_completo", label: "WhatsApp completo", description: "Texto mais detalhado." },
  { id: "instagram", label: "Instagram", description: "Legenda para feed." },
  { id: "reels", label: "Reels", description: "Roteiro curto para vídeo." },
  { id: "story", label: "Story", description: "Texto enxuto para sticker." },
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
    case "instagram":
      return `${product.name} — vale conhecer?

${product.shortDescription}

✅ ${product.strongPoint}
⚠️ ${product.attentionPoint}

Preço visto: ${price} na ${offer.marketplace}
Link na bio ou nos stories.

#${product.category.replace(/[^a-zA-Z]/g, "")} #achadinhos`;
    case "reels":
      return `Roteiro (15–20s):

Gancho: "Olha o que eu encontrei pra ${product.idealAudience.split(" ")[0].toLowerCase()}…"
Cena 1: mostrar o produto — ${product.name}
Cena 2: destacar — ${product.strongPoint}
Cena 3: alerta honesto — ${product.attentionPoint}
Fechamento: "Tava por ${price} na ${offer.marketplace}. Link fixado."

Aviso: preço pode mudar.`;
    case "story":
      return `${product.name}
${product.strongPoint}
💸 ${price} • ${offer.marketplace}
👆 Toque no link
(preço sujeito a alteração)`;
  }
}
