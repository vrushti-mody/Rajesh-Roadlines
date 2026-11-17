import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { getActiveUpdates, getBranches, getHazmat, getLanes, getSettings } from "@/lib/data";
import { clientIp, json, preflight, rateLimit } from "@/lib/http";

export const dynamic = "force-dynamic";
export const OPTIONS = preflight;

const Body = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(1000) })).min(1).max(12),
  locale: z.string().max(5).optional(),
});

const client = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/** Builds the assistant's knowledge from the CMS on every call, so it is never staler than the site. */
async function systemPrompt(locale?: string) {
  const [settings, branches, lanes, hazmat, updates] = await Promise.all([getSettings(), getBranches(), getLanes(), getHazmat(), getActiveUpdates(10)]);
  const branchLines = branches.map((b) => `- ${b.town} [${b.region}, ${b.kind}]${b.phones.length ? " tel " + b.phones.join(" / ") : ""}${b.address ? ", " + b.address : ""}`).join("\n");
  const laneLines = lanes.map((l) => `- ${l.origin} to ${l.destination}: book by ${l.cutoff} IST, ${l.transitDays} day(s) transit, no dispatch on ${l.closedDays.map((d) => ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d]).join("/")}${l.verified ? "" : " (indicative)"}`).join("\n");
  const hazLines = hazmat.map((h) => `- UN${h.un} ${h.name}, class ${h.hazardClass}: ${h.status}${h.conditions ? " (" + h.conditions + ")" : ""}`).join("\n");
  const updLines = updates.map((u) => `- [${u.kind}${u.severity !== "info" ? ", " + u.severity : ""}] ${u.title}: ${u.summary}`).join("\n") || "- none";
  const lang = { en: "English", mr: "Marathi", gu: "Gujarati", hi: "Hindi", kok: "Konkani" }[locale ?? "en"] ?? "English";

  return `You are "Ask RRPL", the assistant on the website of Rajesh Roadlines Pvt. Ltd. (RRPL), a road freight company founded in 1969 serving Mumbai, Konkan (Sindhudurg), Goa and Gujarat.

Rules:
- Answer only from the facts below. If the answer is not here, say you don't know and give the phone ${settings.phone} or email ${settings.email}.
- Never invent rates, prices, LR statuses, delivery promises or policies. For a rate, offer the quote form. For an LR status, point to the Track LR box.
- Reply in the language the customer writes in; the site language is ${lang}. Keep replies under 120 words, plain text, no markdown tables.
- E-way bill and GST answers are general guidance; tell the customer to confirm with their CA.
- Classes ${settings.refusedClasses.join(", ")} are never carried.

Services: interstate full and part loads, primary and secondary distribution, clearing and forwarding, C&F, distribution warehousing, hazardous chemicals in packs (ADR classification, licensed drivers, emergency response plan), EXIM, ISO tanks, high-priority cargo. Fleet from 1 t pick-ups to 40 ft trailers and gas tankers.

E-way bill limits (₹): inter-state ${settings.eway.interState}; within Maharashtra ${settings.eway.intraMH}; within Goa only notified goods above ${settings.eway.intraGA}; within Gujarat only specified goods above ${settings.eway.intraGJ}, none within one city; inter-state job work at any value. Validity 1 day per 200 km.

Branches:
${branchLines}

Booking cut-offs and transit:
${laneLines || "- not published yet"}

Hazardous goods list:
${hazLines || "- not published yet"}

Current news and route alerts:
${updLines}
${settings.chatbotExtra ? "\nMore from RRPL staff:\n" + settings.chatbotExtra : ""}`;
}

/** POST /api/public/chat  { messages: [{role, content}], locale } -> { reply } */
export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return json(req, { error: "Chat is not available." }, 503);
  const settings = await getSettings();
  if (!settings.chatbotEnabled) return json(req, { error: "Chat is not available." }, 503);
  if (!rateLimit(`chat:${clientIp(req)}`, 20, 10 * 60_000)) return json(req, { error: "Please wait a few minutes before asking again." }, 429);

  let raw: unknown;
  try { raw = await req.json(); } catch { return json(req, { error: "Invalid request." }, 400); }
  const parsed = Body.safeParse(raw);
  if (!parsed.success || parsed.data.messages.at(-1)?.role !== "user") return json(req, { error: "Invalid request." }, 400);

  try {
    const msg = await client().messages.create({
      model: process.env.ANTHROPIC_MODEL ?? "claude-haiku-5-5",
      max_tokens: 500,
      system: await systemPrompt(parsed.data.locale),
      messages: parsed.data.messages,
    });
    const reply = msg.content.filter((b) => b.type === "text").map((b) => (b as { text: string }).text).join("\n").trim();
    return json(req, { reply: reply || "Sorry, I could not answer that. Please call 022-62284444." });
  } catch (e) {
    console.error("chat failed:", (e as Error).message);
    return json(req, { error: "Chat is busy right now. Please call 022-62284444." }, 502);
  }
}
