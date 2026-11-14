import { createFileRoute, Link } from "@tanstack/react-router";
import { button } from "@higgsfield/quanta/button";

export const Route = createFileRoute("/")({
  // No title/description here on purpose: the home page inherits the app's
  // editable page metadata from the root route (app-meta.json).
  component: Index,
});

// Routes are server-rendered: keep render SSR-safe (no window/document during render).
function Index() {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-6 py-16">
        <h1 className="text-q-title-lg-semi-bold text-q-text-primary">Townley Creative</h1>
        <p className="text-q-body-md-regular text-q-text-secondary">
          [PLACEHOLDER: one or two sentences from the owner describing what Townley Creative does
          and who it is for]
        </p>
        <section aria-labelledby="work-heading" className="mt-6 flex flex-col gap-2">
          <h2 id="work-heading" className="text-q-title-md-semi-bold text-q-text-primary">
            Work
          </h2>
          <p className="text-q-body-sm-regular text-q-text-secondary">
            [PLACEHOLDER: services, selected work or a contact call to action from the owner]
          </p>
        </section>
        <section aria-labelledby="contact-heading" className="mt-6 flex flex-col gap-2">
          <h2 id="contact-heading" className="text-q-title-md-semi-bold text-q-text-primary">
            Contact
          </h2>
          <p className="text-q-body-sm-regular text-q-text-secondary">
            [PLACEHOLDER: CONTACT EMAIL]
          </p>
        </section>
      </main>
      <footer className="border-t border-q-border-default px-6 py-4">
        <nav aria-label="Footer" className="mx-auto flex max-w-3xl items-center gap-3">
          <Link to="/privacy" className={button({ variant: "outline", size: "sm" })}>
            Privacy and cookies
          </Link>
        </nav>
      </footer>
    </div>
  );
}
