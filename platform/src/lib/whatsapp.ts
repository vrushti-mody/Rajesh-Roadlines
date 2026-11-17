/**
 * WhatsApp Business (Meta Cloud API). Used to alert RRPL's operations desk about new pickup
 * requests and complaints, and to confirm receipt to the customer.
 *
 * Business-initiated messages must use templates approved in Meta Business Manager.
 * Create these two templates (category UTILITY) and keep the variable order:
 *   rrpl_ops_alert        "New {{1}}: {{2}}"                         (to the ops desk)
 *   rrpl_request_received "Hello {{1}}, RRPL received your {{2}} (ref {{3}}). Our team will call you."
 */
const API = () => `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION ?? "v21.0"}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

export const whatsappEnabled = () => !!(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);

/** Indian mobile to E.164 without "+", or null. */
export function toWaNumber(phone: string): string | null {
  const d = phone.replace(/\D/g, "").replace(/^0+/, "");
  if (/^[6-9]\d{9}$/.test(d)) return "91" + d;
  if (/^91[6-9]\d{9}$/.test(d)) return d;
  return null;
}

export async function sendTemplate(to: string, template: string, params: string[], lang = "en"): Promise<boolean> {
  if (!whatsappEnabled()) return false;
  const res = await fetch(API(), {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: template,
        language: { code: lang },
        components: [{ type: "body", parameters: params.map((text) => ({ type: "text", text: text.slice(0, 1000) })) }],
      },
    }),
  });
  if (!res.ok) {
    console.error("WhatsApp send failed", res.status, await res.text().catch(() => ""));
    return false;
  }
  return true;
}

export async function alertOps(kind: string, summary: string) {
  const ops = process.env.WHATSAPP_OPS_NUMBER;
  if (!ops) return false;
  return sendTemplate(ops, "rrpl_ops_alert", [kind, summary]);
}
