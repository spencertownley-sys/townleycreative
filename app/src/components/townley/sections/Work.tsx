import { WORK } from "../../../data/work";
import { QUOTE_HREF } from "../../../site";
import { GradeWipe } from "../GradeWipe";
import { MetalBar } from "../MaterialSection";
import { ReelCard } from "../Reel";
import { TubeButton } from "../TubeButton";
import { TubeHeading } from "../TubeHeading";

/** Section 4: the reel in theatre mode, then the wall of grade-wipe frames. */
export function Work() {
  return (
    <section id="work" className="tc-section tc-mat tc-mat-dirt tc-work" aria-labelledby="work-h">
      <MetalBar className="tc-section__bar" thickness={8} />
      <div className="tc-wrap">
        <header className="tc-section__head">
          <TubeHeading id="work-h">On the wall</TubeHeading>
          <p className="tc-lead">
            New studio, new work. These are concept frames; real projects go here as they ship.
          </p>
        </header>

        <ReelCard />

        <div className="tc-wall-head">
          <p className="tc-label">Dailies</p>
          <p className="tc-wall-hint">
            <span className="tc-wall-hint--hover">Hover a frame to grade it.</span>
            <span className="tc-wall-hint--touch">Drag across a frame to grade it, or tap.</span>
          </p>
        </div>
        <div className="tc-wall">
          {WORK.map((tile) => (
            <GradeWipe key={tile.key} tile={tile} />
          ))}
        </div>

        <div className="tc-work__cta">
          <p className="tc-work__first">Be the first on this wall.</p>
          <TubeButton variant="outline" href={QUOTE_HREF}>
            Get a quote
          </TubeButton>
        </div>
      </div>
    </section>
  );
}
