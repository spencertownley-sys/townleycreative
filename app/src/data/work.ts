/**
 * Work tiles (PRD tab 3, placeholder plan). Concept frames generated with
 * Higgsfield, one per segment, until real projects replace them. Each has a
 * flat LOG version and the house grade, made from the same frame so the
 * grade wipe lines up.
 */
export type WorkTile = {
  key: string;
  /** Service + segment label. */
  label: string;
  /** Monitor slate, like a clip name on a dailies wall. */
  slate: string;
  alt: string;
  /** Real projects set this to false (and drop the caption). */
  concept: boolean;
};

export const WORK: WorkTile[] = [
  {
    key: "bar",
    label: "Bar · Photo + menu",
    slate: "A001_C003",
    alt: "A small bar at night in the rain, its window glowing red and amber across a wet street.",
    concept: true,
  },
  {
    key: "band",
    label: "Band · Live cut + press photos",
    slate: "A002_C011",
    alt: "A three-piece band on a tiny club stage under one red light, haze in the beam.",
    concept: true,
  },
  {
    key: "event",
    label: "Event · Recap film",
    slate: "B001_C007",
    alt: "A warehouse event at blue hour seen from a mezzanine, string lights over moving guests.",
    concept: true,
  },
  {
    key: "founder",
    label: "Startup · Brand + pitch deck",
    slate: "A003_C002",
    alt: "A founder working late at a laptop by a desk lamp, rain and city lights behind.",
    concept: true,
  },
  {
    key: "dish",
    label: "Restaurant · Menu photography",
    slate: "C001_C014",
    alt: "A plated fish dish on dark walnut under a single warm spotlight.",
    concept: true,
  },
  {
    key: "waterfront",
    label: "Real estate · Drone + listing film",
    slate: "D001_C001",
    alt: "An aerial view of the Tacoma waterfront at blue hour under low cloud.",
    concept: true,
  },
];

export function workSrc(key: string, kind: "log" | "grade", width: 720 | 1280) {
  return `/media/work/${key}-${kind}-${width}.webp`;
}
