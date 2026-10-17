import { MetalBar } from "../MaterialSection";
import { TubeHeading } from "../TubeHeading";

const PROOF = [
  {
    n: "01",
    title: "Whole job, one invoice",
    body: "Photo, video, web, brand and documents under one roof.",
  },
  {
    n: "02",
    title: "Ten years inside big brands",
    body: "Product and brand work inside Fortune 500 companies, now pointed at small businesses.",
  },
  {
    n: "03",
    title: "Photos in 48 hours, video in a week",
    body: "And AI-assisted production that gets more done per dollar.",
  },
];

/** Section 2: who we are for and the three proof points, in order. */
export function Statement() {
  return (
    <section className="tc-section tc-mat tc-mat-ground tc-statement" aria-labelledby="statement-h">
      <MetalBar className="tc-section__bar" thickness={8} />
      <div className="tc-wrap">
        <TubeHeading id="statement-h">The night shift</TubeHeading>
        <p className="tc-statement__line">One team shoots it, cuts it, designs it and ships it.</p>
        <ol className="tc-proof">
          {PROOF.map((p) => (
            <li key={p.n} className="tc-proof__item">
              <span className="tc-proof__n" aria-hidden="true">
                {p.n}
              </span>
              <h3 className="tc-proof__title">{p.title}</h3>
              <p className="tc-proof__body">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
