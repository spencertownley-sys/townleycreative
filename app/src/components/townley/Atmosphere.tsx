/** Page-wide film grain: one fixed SVG noise layer for the whole page. */
export function GrainOverlay() {
  return (
    <svg
      className="tc-grain"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="tc-grain-filter" x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves={3}
          stitchTiles="stitch"
        />
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#tc-grain-filter)" />
    </svg>
  );
}

/** Page-wide vignette: transparent center to 55% black at the corners. */
export function Vignette() {
  return <div className="tc-vignette" aria-hidden="true" />;
}
