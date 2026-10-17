import { createFileRoute } from "@tanstack/react-router";

import { TubeHeading } from "../components/townley/TubeHeading";
import { SITE_NAME } from "../site";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `Privacy — ${SITE_NAME}` },
      { name: "description", content: "What we keep from the forms on this site, and why." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main id="main" className="tc-page tc-mat tc-mat-dirt">
      <div className="tc-page__wrap tc-page__wrap--narrow tc-prose">
        <TubeHeading as="h1">Privacy</TubeHeading>
        <p>
          When you ask for a quote or a brand audit, we keep what you send us: your name, email,
          phone if you add it, your business details and your brief. We use it to reply, quote and
          do the work, and for nothing else. It is stored with our hosting provider and read only by
          us. We don&rsquo;t sell it, share it, or add you to a newsletter. Ask us to delete it at
          any time and we will. This site sets no tracking cookies; its fonts load from Google
          Fonts.
        </p>
        <h2 className="tc-label">Licensing, in short</h2>
        <p>
          Work we deliver comes with a perpetual license for your own channels. Stock, resale or
          third-party ad use is quoted separately. We keep portfolio rights unless an NDA says
          otherwise. Any generated imagery we deliver is labeled as such.
        </p>
      </div>
    </main>
  );
}
