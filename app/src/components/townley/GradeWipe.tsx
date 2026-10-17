import { useRef, type PointerEvent as ReactPointerEvent } from "react";

import { workSrc, type WorkTile } from "../../data/work";

const SIZES = "(max-width: 760px) 46vw, (max-width: 1100px) 46vw, 400px";

/**
 * Grade-wipe work tile. At rest it shows the flat LOG frame, like a dailies
 * wall; hovering (or dragging on touch) wipes the finished grade across it,
 * following the pointer. Tap toggles the full grade; keyboard users get a
 * range slider. The wipe position lives in a CSS custom property, so moving
 * the pointer never re-renders React.
 */
export function GradeWipe({ tile }: { tile: WorkTile }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const current = useRef(0);

  const setWipe = (value: number, live: boolean) => {
    const frame = frameRef.current;
    if (!frame) return;
    const v = Math.max(0, Math.min(100, value));
    current.current = v;
    frame.style.setProperty("--wipe", `${v}%`);
    frame.toggleAttribute("data-live", live);
    frame.dataset.state = v >= 99.5 ? "graded" : v <= 0.5 ? "log" : "split";
    const range = rangeRef.current;
    if (range) {
      range.value = String(Math.round(v));
      range.setAttribute("aria-valuetext", `${Math.round(v)}% graded`);
    }
  };

  const pointerX = (e: ReactPointerEvent) => {
    const rect = frameRef.current!.getBoundingClientRect();
    return ((e.clientX - rect.left) / rect.width) * 100;
  };

  return (
    <figure className="tc-wipe-tile">
      <div
        ref={frameRef}
        className="tc-wipe"
        data-state="log"
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setWipe(pointerX(e), true);
        }}
        onPointerMove={(e) => {
          if (e.pointerType === "mouse") {
            setWipe(pointerX(e), true);
          } else if (drag.current) {
            if (Math.abs(e.clientX - drag.current.x) > 6) drag.current.moved = true;
            if (drag.current.moved) setWipe(pointerX(e), true);
          }
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setWipe(0, false);
        }}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") return;
          drag.current = { x: e.clientX, moved: false };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerUp={(e) => {
          if (e.pointerType === "mouse" || !drag.current) return;
          const { moved } = drag.current;
          drag.current = null;
          if (moved) setWipe(current.current, false);
          else setWipe(current.current > 50 ? 0 : 100, false);
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <img
          className="tc-wipe__img"
          src={workSrc(tile.key, "log", 720)}
          srcSet={`${workSrc(tile.key, "log", 720)} 720w, ${workSrc(tile.key, "log", 1280)} 1280w`}
          sizes={SIZES}
          width={1280}
          height={724}
          alt={tile.alt}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <img
          className="tc-wipe__img tc-wipe__img--grade"
          src={workSrc(tile.key, "grade", 720)}
          srcSet={`${workSrc(tile.key, "grade", 720)} 720w, ${workSrc(tile.key, "grade", 1280)} 1280w`}
          sizes={SIZES}
          width={1280}
          height={724}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <span className="tc-wipe__seam" aria-hidden="true" />
        <span className="tc-wipe__tag tc-wipe__tag--grade" aria-hidden="true">
          Grade
        </span>
        <span className="tc-wipe__tag tc-wipe__tag--log" aria-hidden="true">
          LOG
        </span>
        <span className="tc-wipe__slate" aria-hidden="true">
          {tile.slate} · 23.976
        </span>
        <input
          ref={rangeRef}
          type="range"
          className="tc-wipe__range"
          min={0}
          max={100}
          step={5}
          defaultValue={0}
          aria-label={`Grade wipe: ${tile.label}`}
          aria-valuetext="0% graded"
          onChange={(e) => setWipe(Number(e.currentTarget.value), false)}
        />
      </div>
      <figcaption className="tc-wipe-tile__caption">
        <span>{tile.label}</span>
        {tile.concept ? <span className="tc-wipe-tile__concept">Concept frame</span> : null}
      </figcaption>
    </figure>
  );
}
