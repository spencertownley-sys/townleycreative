import { QUOTE_HREF, emailHref } from "../../../site";
import { MetalBar } from "../MaterialSection";
import { TubeButton } from "../TubeButton";
import { TubeHeading } from "../TubeHeading";

const CREDENTIALS = [
  "10+ years of Fortune 500 brand work",
  "FAA Part 107 drone pilot",
  "Sony A7 IV",
  "DJI",
];

/** Section 7: who's here, in the studio voice, with one dry line. */
export function Studio() {
  const email = emailHref();
  return (
    <section
      id="studio"
      className="tc-section tc-mat tc-mat-dirt tc-studio"
      aria-labelledby="studio-h"
    >
      <MetalBar className="tc-section__bar" thickness={8} />
      <div className="tc-wrap tc-studio__grid">
        <div className="tc-studio__text">
          <TubeHeading id="studio-h">Who&rsquo;s here</TubeHeading>
          <p className="tc-lead">
            We spent a decade making big brands look sharp. Now we do it for the bar on the corner.
          </p>
          <p className="tc-studio__story">
            Townley Creative is a small Seattle studio. Before this, we spent ten years on product
            and brand teams inside Fortune 500 companies, where one launch had a hundred people on
            it. Here it has one team: the same people shoot it, cut it, design it and ship it. We
            work late, we move fast, and you see the price before we start.
          </p>
          <ul className="tc-creds">
            {CREDENTIALS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="tc-studio__joke">We don&rsquo;t do weddings. We know people who do.</p>
          {email ? (
            <TubeButton variant="outline" href={email}>
              Email us
            </TubeButton>
          ) : (
            <TubeButton variant="outline" href={QUOTE_HREF}>
              Start a project
            </TubeButton>
          )}
        </div>
        <figure className="tc-studio__photo">
          <div className="tc-studio__frame">
            <img
              src="/media/studio-grade-720.webp"
              srcSet="/media/studio-grade-720.webp 720w, /media/studio-grade-1280.webp 1280w"
              sizes="(max-width: 900px) 92vw, 440px"
              width={1280}
              height={1600}
              alt="A small studio at night: one softbox lighting an empty stool against a brick wall, a cinema camera on a tripod."
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption className="tc-wipe-tile__concept">Concept image</figcaption>
        </figure>
      </div>
    </section>
  );
}
