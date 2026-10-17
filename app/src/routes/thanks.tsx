import { createFileRoute } from "@tanstack/react-router";

import { TubeButton } from "../components/townley/TubeButton";
import { TubeHeading } from "../components/townley/TubeHeading";
import { nextBusinessDay } from "../lib/business-day";
import { CALENDLY_URL, QUOTE_HREF, SITE_NAME, emailHref, isPlaceholder } from "../site";

type ThanksSearch = { from?: "quote" | "audit" };

export const Route = createFileRoute("/thanks")({
  validateSearch: (search: Record<string, unknown>): ThanksSearch => ({
    from: search.from === "quote" || search.from === "audit" ? search.from : undefined,
  }),
  head: () => ({
    meta: [{ title: `Got it — ${SITE_NAME}` }, { name: "robots", content: "noindex" }],
  }),
  component: ThanksPage,
});

function ThanksPage() {
  const { from } = Route.useSearch();
  const day = nextBusinessDay();
  const line =
    from === "quote"
      ? `You’ll have a quote by ${day}.`
      : from === "audit"
        ? "Your one-page audit lands within 48 hours. No pitch attached."
        : `You’ll hear from a human by ${day}.`;
  const calendly = isPlaceholder(CALENDLY_URL) ? null : CALENDLY_URL;
  const email = emailHref("Following up");

  return (
    <main id="main" className="tc-page tc-mat tc-mat-dirt">
      <div className="tc-page__wrap tc-page__wrap--narrow">
        <header className="tc-section__head">
          <TubeHeading as="h1">Got it</TubeHeading>
          <p className="tc-lead">{line}</p>
        </header>
        <section className="tc-thanks__next" aria-labelledby="next-h">
          <h2 id="next-h" className="tc-label">
            Want to talk it through first?
          </h2>
          {calendly ? (
            <iframe
              className="tc-thanks__calendly"
              title="Book a 15-minute consult"
              src={`${calendly}?hide_gdpr_banner=1&background_color=0b0a0c&text_color=e3e6e4&primary_color=3d6cff`}
              loading="lazy"
            />
          ) : (
            <div className="tc-thanks__actions">
              {email ? (
                <TubeButton variant="outline" href={email}>
                  Email us
                </TubeButton>
              ) : null}
              <TubeButton variant="text" href="/">
                Back to the front
              </TubeButton>
              {from === "audit" ? (
                <TubeButton variant="text" href={QUOTE_HREF}>
                  Or get a quote now
                </TubeButton>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
