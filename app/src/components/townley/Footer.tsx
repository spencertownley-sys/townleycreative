import { useState } from "react";

import {
  AUDIT_HREF,
  CONTACT_EMAIL,
  QUOTE_HREF,
  SERVICE_AREA,
  bookCallHref,
  emailHref,
  isPlaceholder,
} from "../../site";
import { NeonSign } from "./NeonSign";
import { StatusSign } from "./StatusSign";
import { TubeButton } from "./TubeButton";
import { TubeHeading } from "./TubeHeading";

function EmailCopy() {
  const [copied, setCopied] = useState(false);
  return (
    <p className="tc-footer__email">
      <span className="tc-mono">{CONTACT_EMAIL}</span>
      <button
        type="button"
        className="tc-footer__copy tc-mono"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(CONTACT_EMAIL);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          } catch {
            setCopied(false);
          }
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <span className="tc-sr-only" aria-live="polite">
        {copied ? "Email address copied" : ""}
      </span>
    </p>
  );
}

/** Section 9 and the page footer: the sign again, reflected, with every way in. */
export function Footer() {
  const email = emailHref();
  return (
    <footer id="contact" className="tc-footer" aria-labelledby="contact-h">
      <div className="tc-footer__wall tc-mat-brick" aria-hidden="true" />
      <div className="tc-footer__floor tc-mat-asphalt" aria-hidden="true" />

      <div className="tc-footer__content">
        <TubeHeading id="contact-h">Still open</TubeHeading>
        <p className="tc-lead">
          Email, book a call, or start a quote. We answer by the next business day.
        </p>
        <div className="tc-footer__ctas">
          <TubeButton variant="fill" href={bookCallHref()}>
            Book a 15-min call
          </TubeButton>
          <TubeButton variant="outline" href={QUOTE_HREF}>
            Get a quote
          </TubeButton>
          {email ? (
            <TubeButton variant="text" href={email}>
              Email us
            </TubeButton>
          ) : null}
        </div>
        {!isPlaceholder(CONTACT_EMAIL) ? <EmailCopy /> : null}
      </div>

      <NeonSign className="tc-footer__sign" reflection strike={false} />
      <div className="tc-footer__ripples tc-ripples" aria-hidden="true" />

      <div className="tc-footer__meta">
        <StatusSign />
        <ul className="tc-footer__links">
          <li>{SERVICE_AREA.replace(" · est. 2026", "")}</li>
          <li>
            <a href={AUDIT_HREF}>Free brand audit</a>
          </li>
          <li>
            <a href="/privacy">Privacy</a>
          </li>
          <li>© 2026 Townley Creative</li>
        </ul>
      </div>
    </footer>
  );
}
