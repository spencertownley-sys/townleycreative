import { useRef, type CSSProperties } from "react";

import { bookCallHref } from "../../../site";
import { TubeButton } from "../TubeButton";
import { TubeHeading, useLitOnView } from "../TubeHeading";

const STEPS = [
  { title: "Call", body: "Fifteen minutes. What you need and when." },
  {
    title: "Quote & 25% deposit",
    body: "A written quote within 24 hours. The deposit books your date.",
  },
  { title: "Shoot / build", body: "One team on it from the first frame to the last file." },
  { title: "Deliver", body: "Photos in 48 hours, video in a week, sites on the date we set." },
];

/** Section 5: four steps on a tube line whose nodes light as it scrolls in. */
export function Process() {
  const lineRef = useRef<HTMLOListElement>(null);
  useLitOnView(lineRef);

  return (
    <section className="tc-section tc-mat tc-mat-asphalt tc-process" aria-labelledby="process-h">
      <div className="tc-ripples tc-process__ripples" aria-hidden="true" />
      <div className="tc-wrap">
        <header className="tc-section__head">
          <TubeHeading id="process-h">How it goes</TubeHeading>
          <p className="tc-lead">
            Call. Quote and a 25% deposit. We shoot or build. You get it back fast.
          </p>
        </header>
        <ol ref={lineRef} className="tc-steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className="tc-step" style={{ "--i": i } as CSSProperties}>
              <span className="tc-step__node" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="tc-step__title">{s.title}</h3>
              <p className="tc-step__body">{s.body}</p>
            </li>
          ))}
        </ol>
        <TubeButton variant="fill" href={bookCallHref()}>
          Book a 15-min call
        </TubeButton>
      </div>
    </section>
  );
}
