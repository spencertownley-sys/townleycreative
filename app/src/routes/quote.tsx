import { createFileRoute } from "@tanstack/react-router";

import { QuoteForm, type QuotePrefill } from "../components/townley/forms/QuoteForm";
import { TubeHeading } from "../components/townley/TubeHeading";
import { RETAINERS, bundleByKey, serviceByKey } from "../data/pricing";
import { SITE_NAME } from "../site";

type QuoteSearch = { service?: string; tier?: string; bundle?: string };

const str = (v: unknown) => (typeof v === "string" && v.length <= 40 ? v : undefined);

function prefillFrom(search: QuoteSearch): QuotePrefill {
  const bundle = bundleByKey(search.bundle);
  if (bundle)
    return {
      services: bundle.chips,
      bundle: bundle.key,
      context: `${bundle.name} (${bundle.price})`,
    };
  const retainer = RETAINERS.find((r) => r.key === search.service);
  if (retainer) return { services: ["Retainer"], context: `${retainer.name} (${retainer.price})` };
  const service = serviceByKey(search.service);
  if (service) {
    const tier = service.tiers.find((t) => t.id === search.tier);
    return {
      services: [service.chip],
      tier: tier?.id,
      context: tier ? `${service.name}, ${tier.label} (${tier.price})` : service.name,
    };
  }
  return { services: [] };
}

export const Route = createFileRoute("/quote")({
  validateSearch: (search: Record<string, unknown>): QuoteSearch => ({
    service: str(search.service),
    tier: str(search.tier),
    bundle: str(search.bundle),
  }),
  head: () => ({
    meta: [
      { title: `Get a quote — ${SITE_NAME}` },
      {
        name: "description",
        content: "Four quick steps. A written quote by the next business day.",
      },
    ],
  }),
  component: QuotePage,
});

function QuotePage() {
  const search = Route.useSearch();
  return (
    <main id="main" className="tc-page tc-mat tc-mat-dirt">
      <div className="tc-page__wrap">
        <header className="tc-section__head">
          <TubeHeading as="h1">Get a quote</TubeHeading>
          <p className="tc-lead">
            Four quick steps. A written quote by the next business day; a 25% deposit books the
            date.
          </p>
        </header>
        <QuoteForm prefill={prefillFrom(search)} />
      </div>
    </main>
  );
}
