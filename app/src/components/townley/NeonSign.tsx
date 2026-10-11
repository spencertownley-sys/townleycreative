import { clsx } from "clsx";
import type { CSSProperties } from "react";

type NeonSignProps = {
  /** "h1" for the hero (the page's one H1); "div" anywhere else. */
  as?: "h1" | "div";
  /** Tube color; defaults to --tube. */
  tube?: string;
  /** Word color; defaults to --word. */
  word?: string;
  /** Idle flicker (8s loop, three dips). */
  flicker?: boolean;
  /** Run the once-per-session strike on page load. */
  strike?: boolean;
  /** Mirrored copy below the sign, for when it hangs above a floor. */
  reflection?: boolean;
  className?: string;
};

/**
 * The sign: cursive "Townley" and spaced caps CREATIVE breaking out of an
 * electric-blue tube box. Geometry and glow live in styles/townley/sign.css.
 */
export function NeonSign({
  as = "div",
  tube,
  word,
  flicker = true,
  strike = true,
  reflection = false,
  className,
}: NeonSignProps) {
  const style = {
    ...(tube ? { "--b": tube } : {}),
    ...(word ? { "--g": word } : {}),
  } as CSSProperties;

  return (
    <div className={clsx("tc-sign", strike && "tc-sign--strike", className)} style={style}>
      <div className="tc-sign__stage">
        <SignArt as={as} flicker={flicker} />
      </div>
      {reflection ? (
        <div className="tc-sign__reflection" aria-hidden="true">
          <SignArt as="div" flicker={flicker} />
        </div>
      ) : null}
    </div>
  );
}

function SignArt({ as: Words, flicker }: { as: "h1" | "div"; flicker: boolean }) {
  return (
    <div className={clsx("tc-sign__art", flicker && "tc-sign__art--flicker")}>
      <span className="tc-sign__wash tc-sign__wash--tube" aria-hidden="true" />
      <span className="tc-sign__wash tc-sign__wash--word" aria-hidden="true" />
      <span className="tc-sign__box" aria-hidden="true" />
      <span className="tc-sign__screw tc-sign__screw--tl" aria-hidden="true" />
      <span className="tc-sign__screw tc-sign__screw--tr" aria-hidden="true" />
      <span className="tc-sign__screw tc-sign__screw--bl" aria-hidden="true" />
      <span className="tc-sign__screw tc-sign__screw--br" aria-hidden="true" />
      <Words className="tc-sign__words">
        <span className="tc-sign__script">Townley</span>{" "}
        <span className="tc-sign__caps">Creative</span>
      </Words>
    </div>
  );
}
