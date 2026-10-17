import { AuditForm } from "../forms/AuditForm";
import { TubeHeading } from "../TubeHeading";

const PARTS = [
  "First impression, in three lines",
  "What's working",
  "What's leaking",
  "Three fixes, ranked by effort",
];

/** Section 8: the lead magnet, a free one-page brand audit, with the form inline. */
export function Audit() {
  return (
    <section
      id="audit"
      className="tc-section tc-mat tc-mat-ground tc-audit"
      aria-labelledby="audit-h"
    >
      <div className="tc-wrap">
        <div className="tc-audit__panel tc-mat-metal">
          <span className="tc-audit__bolt tc-audit__bolt--tl" aria-hidden="true" />
          <span className="tc-audit__bolt tc-audit__bolt--tr" aria-hidden="true" />
          <span className="tc-audit__bolt tc-audit__bolt--bl" aria-hidden="true" />
          <span className="tc-audit__bolt tc-audit__bolt--br" aria-hidden="true" />
          <div className="tc-audit__text">
            <TubeHeading id="audit-h">Free look</TubeHeading>
            <p className="tc-lead">
              Send your site and your Instagram. In 48 hours: what&rsquo;s working, what&rsquo;s
              leaking, three fixes. No pitch attached.
            </p>
            <ol className="tc-audit__parts">
              {PARTS.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
          </div>
          <AuditForm />
        </div>
      </div>
    </section>
  );
}
