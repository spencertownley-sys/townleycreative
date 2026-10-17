// Server-only lead handling for the quote form and the brand audit (PRD tab 4).
// Every lead is stored in D1; when a mail key is configured it is also emailed
// to the agency address with an auto-reply to the sender. A lead is never
// dropped silently: if it can be neither stored nor mailed, the form says so.
import { getRequestHeader } from "@tanstack/react-start/server";

import { CALENDLY_URL, CONTACT_EMAIL, SITE_NAME, isPlaceholder } from "../site";
import { bindings } from "./bindings.server";
import { nextBusinessDay } from "./business-day";

export type Lead = {
  kind: "quote" | "audit";
  email: string;
  name?: string;
  business?: string;
  segment?: string;
  services?: string;
  tier?: string;
  bundle?: string;
  budget?: string;
  timeline?: string;
  link?: string;
  brief?: string;
  phone?: string;
  source?: string;
};

export type LeadResult = { ok: true } | { ok: false; error: "rate_limited" | "unavailable" };

// Secrets configured in Higgsfield's website settings (never in the repo).
type LeadEnv = ReturnType<typeof bindings> & {
  RESEND_API_KEY?: string;
  LEADS_FROM_EMAIL?: string;
};

const RATE_WINDOW = "-10 minutes";
const RATE_MAX = 5;

async function requesterHash(): Promise<string> {
  const ip =
    getRequestHeader("cf-connecting-ip") ??
    getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`tc-leads:${ip}`));
  return [...new Uint8Array(digest)]
    .slice(0, 12)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function saveLead(lead: Lead): Promise<LeadResult> {
  const env = bindings() as LeadEnv;
  const tag = lead.kind === "quote" ? "TC-quote" : "TC-audit";
  const hash = await requesterHash();

  if (env.DB) {
    const recent = await env.DB.prepare(
      "SELECT COUNT(*) AS n FROM leads WHERE ip_hash = ? AND created_at > datetime('now', ?)",
    )
      .bind(hash, RATE_WINDOW)
      .first<{ n: number }>();
    if ((recent?.n ?? 0) >= RATE_MAX) return { ok: false, error: "rate_limited" };

    await env.DB.prepare(
      `INSERT INTO leads (id, kind, tag, email, name, business, segment, services, tier, bundle,
         budget, timeline, link, brief, phone, source, ip_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        crypto.randomUUID(),
        lead.kind,
        tag,
        lead.email,
        lead.name ?? null,
        lead.business ?? null,
        lead.segment ?? null,
        lead.services ?? null,
        lead.tier ?? null,
        lead.bundle ?? null,
        lead.budget ?? null,
        lead.timeline ?? null,
        lead.link ?? null,
        lead.brief ?? null,
        lead.phone ?? null,
        lead.source ?? null,
        hash,
      )
      .run();
  }

  const mailed = await mailLead(env, lead, tag);
  if (!env.DB && !mailed) return { ok: false, error: "unavailable" };
  return { ok: true };
}

async function mailLead(env: LeadEnv, lead: Lead, tag: string): Promise<boolean> {
  if (!env.RESEND_API_KEY || isPlaceholder(CONTACT_EMAIL)) return false;
  const from = env.LEADS_FROM_EMAIL ?? `${SITE_NAME} <${CONTACT_EMAIL}>`;
  const talk = isPlaceholder(CALENDLY_URL)
    ? "Want to talk first? Reply to this email."
    : `Want to talk first? ${CALENDLY_URL}`;

  const subject =
    lead.kind === "quote"
      ? `[${tag}] ${lead.business ?? lead.email} — ${lead.services ?? "?"} — ${lead.budget ?? "?"}`
      : `[${tag}] ${lead.link ?? lead.email}`;
  const fields = Object.entries(lead)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const reply =
    lead.kind === "quote"
      ? {
          subject: `Got your quote request — ${SITE_NAME}`,
          text: `Thanks. You'll have a quote by ${nextBusinessDay()}. To book a date it's a 25% deposit; photos come back in 48 hours, video in a week.\n\n${talk}\n\n${SITE_NAME}`,
        }
      : {
          subject: "Your free brand audit is on the way",
          text: `Thanks. One page, 48 hours, no pitch attached. If you want to talk sooner: ${isPlaceholder(CALENDLY_URL) ? "reply to this email" : CALENDLY_URL}.\n\n${SITE_NAME}`,
        };

  const send = (body: Record<string, unknown>) =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });

  try {
    const notice = await send({
      from,
      to: [CONTACT_EMAIL],
      reply_to: lead.email,
      subject,
      text: fields,
    });
    if (!notice.ok) return false;
    await send({ from, to: [lead.email], reply_to: CONTACT_EMAIL, ...reply }).catch(
      () => undefined,
    );
    return true;
  } catch {
    return false;
  }
}
