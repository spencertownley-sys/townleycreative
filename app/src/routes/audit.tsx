import { createFileRoute } from "@tanstack/react-router";

import { AuditForm } from "../components/townley/forms/AuditForm";
import { TubeHeading } from "../components/townley/TubeHeading";
import { SITE_NAME } from "../site";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: `Free brand audit — ${SITE_NAME}` },
      {
        name: "description",
        content:
          "Send your site and your Instagram. In 48 hours: what's working, what's leaking, three fixes. No pitch attached.",
      },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  return (
    <main id="main" className="tc-page tc-mat tc-mat-dirt">
      <div className="tc-page__wrap tc-page__wrap--narrow">
        <header className="tc-section__head">
          <TubeHeading as="h1">Free look</TubeHeading>
          <p className="tc-lead">
            Send your site and your Instagram. In 48 hours you get a one-page audit: what&rsquo;s
            working, what&rsquo;s leaking, three fixes. No pitch attached.
          </p>
        </header>
        <div className="tc-audit__panel tc-audit__panel--solo tc-mat-metal">
          <AuditForm />
        </div>
      </div>
    </main>
  );
}
