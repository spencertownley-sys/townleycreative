import { useEffect, useRef } from "react";

import { QUOTE_HREF, SERVICE_AREA, TAGLINE, bookCallHref } from "../../site";
import { NeonSign } from "./NeonSign";
import { PlayReelButton } from "./Reel";
import { StatusSign } from "./StatusSign";
import { TubeButton } from "./TubeButton";

/** Section 1: the sign on a brick wall over wet asphalt (concept A, "Open Late"). */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Scroll dim fallback for browsers without scroll-driven animations
  // (hero.css handles the rest with animation-timeline).
  useEffect(() => {
    const hero = ref.current;
    if (!hero || CSS.supports("animation-timeline: scroll()")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    hero.classList.add("tc-hero--js-dim");
    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      hero.style.setProperty("--tc-dim", progress.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      hero.classList.remove("tc-hero--js-dim");
    };
  }, []);

  return (
    <section ref={ref} id="top" className="tc-hero">
      <div className="tc-hero__wall tc-mat-brick" aria-hidden="true" />
      <div className="tc-hero__floor tc-mat-asphalt" aria-hidden="true" />
      <NeonSign as="h1" reflection className="tc-hero__sign" />
      <div className="tc-hero__ripples tc-ripples" aria-hidden="true" />

      <div className="tc-hero__content">
        <div className="tc-hero__pitch">
          <p className="tc-hero__tagline">{TAGLINE}</p>
          <div className="tc-hero__ctas">
            <TubeButton variant="fill" href={bookCallHref()}>
              Book a 15-min call
            </TubeButton>
            <TubeButton variant="outline" href={QUOTE_HREF}>
              Get a quote
            </TubeButton>
            <PlayReelButton className="tc-hero__reel" />
          </div>
        </div>
        <StatusSign className="tc-hero__status" />
      </div>

      <p className="tc-hero__side" aria-hidden="true">
        {SERVICE_AREA}
      </p>
    </section>
  );
}
