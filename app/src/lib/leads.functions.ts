import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { QUOTE_SERVICES } from "../data/pricing";
import { BUDGETS, SEGMENTS, SOURCES, TIMELINES } from "../site";
import { saveLead, type LeadResult } from "./leads.server";

const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => v || undefined);

// Spam guards (PRD tab 6): a hidden field people never fill, and a minimum
// time on the form. A filled trap is accepted and dropped; a too-fast submit
// gets the ordinary error, so a real person can just send it again.
const guard = {
  trap: z.string().max(200).optional(),
  elapsedMs: z.number().nonnegative(),
};

export type SubmitResult = LeadResult | { ok: false; error: "too_fast" };

const quoteInput = z.object({
  services: z.array(z.enum(QUOTE_SERVICES)).min(1).max(QUOTE_SERVICES.length),
  tier: optional(20),
  bundle: optional(40),
  budget: z.enum(BUDGETS),
  timeline: z.enum(TIMELINES),
  hardDate: optional(20),
  business: z.string().trim().min(1).max(120),
  segment: z.enum(SEGMENTS).optional(),
  link: optional(200),
  brief: z.string().trim().min(1).max(600),
  name: z.string().trim().min(1).max(120),
  email: z.email().max(200),
  phone: optional(40),
  source: z.enum(SOURCES).optional(),
  ...guard,
});

export type QuoteInput = z.input<typeof quoteInput>;

export const submitQuote = createServerFn({ method: "POST" })
  .inputValidator(quoteInput)
  .handler(async ({ data }): Promise<SubmitResult> => {
    if (data.trap) return { ok: true };
    if (data.elapsedMs < 5000) return { ok: false, error: "too_fast" };
    return saveLead({
      kind: "quote",
      email: data.email,
      name: data.name,
      business: data.business,
      segment: data.segment,
      services: data.services.join(", "),
      tier: data.tier,
      bundle: data.bundle,
      budget: data.budget,
      timeline:
        data.timeline === "Hard date" && data.hardDate
          ? `Hard date: ${data.hardDate}`
          : data.timeline,
      link: data.link,
      brief: data.brief,
      phone: data.phone,
      source: data.source,
    });
  });

const auditInput = z.object({
  site: z.string().trim().min(3).max(200),
  handle: z.string().trim().min(1).max(120),
  email: z.email().max(200),
  note: optional(140),
  ...guard,
});

export type AuditInput = z.input<typeof auditInput>;

export const submitAudit = createServerFn({ method: "POST" })
  .inputValidator(auditInput)
  .handler(async ({ data }): Promise<SubmitResult> => {
    if (data.trap) return { ok: true };
    if (data.elapsedMs < 3000) return { ok: false, error: "too_fast" };
    return saveLead({
      kind: "audit",
      email: data.email,
      link: `${data.site} · ${data.handle}`,
      brief: data.note,
    });
  });
