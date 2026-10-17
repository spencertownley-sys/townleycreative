/**
 * Price list (PRD tab 5). The one place a price changes: the Services panels,
 * the Pricing section and the quote form all read from here.
 * USD, "starting at".
 */

export type TierId = "starter" | "core" | "full";

export type Tier = {
  id: TierId;
  label: "Starter" | "Core" | "Full";
  deliverable: string;
  price: string;
  turnaround: string;
};

export type ServiceGroup = "capture" | "build" | "design";

export type Service = {
  key: string;
  name: string;
  group: ServiceGroup;
  /** One line: what it is. */
  line: string;
  /** The quote-form chip this service maps to. */
  chip: QuoteService;
  tiers: [Tier, Tier, Tier];
  /** Extra note shown under the tiers, if any. */
  note?: string;
};

export const QUOTE_SERVICES = [
  "Photography",
  "Video production",
  "Video editing",
  "Podcast",
  "Website",
  "UI/UX",
  "Brand identity",
  "Documents & decks",
  "AI visuals",
  "Retainer",
  "Not sure",
] as const;

export type QuoteService = (typeof QUOTE_SERVICES)[number];

const tiers = (
  starter: [string, string, string],
  core: [string, string, string],
  full: [string, string, string],
): [Tier, Tier, Tier] => [
  {
    id: "starter",
    label: "Starter",
    deliverable: starter[0],
    price: starter[1],
    turnaround: starter[2],
  },
  { id: "core", label: "Core", deliverable: core[0], price: core[1], turnaround: core[2] },
  { id: "full", label: "Full", deliverable: full[0], price: full[1], turnaround: full[2] },
];

export const SERVICES: Service[] = [
  {
    key: "photography",
    name: "Photography",
    group: "capture",
    line: "Brand, interior, product, event, portrait, real estate and drone (FAA Part 107).",
    chip: "Photography",
    tiers: tiers(
      ["Half-day shoot, 25 edited images", "$650", "48 hours"],
      ["Full-day shoot, 60 images", "$1,200", "48 hours"],
      ["Brand library: 2 days, 150 images, 1-year commercial license", "$2,400", "48 hours"],
    ),
  },
  {
    key: "video-production",
    name: "Video production",
    group: "capture",
    line: "Concept, shoot, edit, color and sound. Social cuts to mini-docs.",
    chip: "Video production",
    tiers: tiers(
      ["Social cut: half-day shoot, 3 vertical edits", "$1,500", "1 week"],
      ["Brand film, 60–90 s, plus 3 cut-downs", "$3,500", "1 week"],
      ["Mini-documentary, 3–6 min, plus trailer and stills", "$6,500", "3 weeks"],
    ),
  },
  {
    key: "video-editing",
    name: "Video editing",
    group: "capture",
    line: "Your footage: cut-downs, social verticals, captions and color.",
    chip: "Video editing",
    tiers: tiers(
      ["10 social edits", "$900", "3 business days"],
      ["Long-form, per finished minute", "$150–300/min", "3 business days"],
      ["Editing retainer, 8 edits a month", "$1,500/mo", "3 business days"],
    ),
  },
  {
    key: "podcast",
    name: "Podcast production",
    group: "capture",
    line: "Multi-cam edit, audio clean-up, clips for social and show art.",
    chip: "Podcast",
    tiers: tiers(
      ["Per-episode edit and show notes", "$250", "3 business days"],
      ["Episode plus 4 social clips", "$450", "3 business days"],
      ["Launch kit: show art, intro/outro, 3 episodes", "$1,800", "3 business days"],
    ),
  },
  {
    key: "website",
    name: "Websites",
    group: "build",
    line: "Landing pages to full brand sites, with CMS or e-commerce as needed.",
    chip: "Website",
    tiers: tiers(
      ["Landing page", "$1,800", "2 weeks"],
      ["5-page brand site", "$4,500", "4 weeks"],
      ["Custom site with CMS or e-commerce", "$8,000", "6–8 weeks"],
    ),
  },
  {
    key: "ui-ux",
    name: "UI/UX design",
    group: "build",
    line: "Audits, product flows, app and web screens, prototypes, hand-off specs.",
    chip: "UI/UX",
    tiers: tiers(
      ["Audit and fix list", "$900", "1 week"],
      ["Product flow design, up to 12 screens", "$4,000", "3 weeks"],
      ["Full app design, prototype and hand-off", "$12,000", "6 weeks"],
    ),
    note: "Overflow design work at $125/h.",
  },
  {
    key: "brand-identity",
    name: "Brand identity",
    group: "design",
    line: "Logo, palette, type, voice and guidelines, from starter to full system.",
    chip: "Brand identity",
    tiers: tiers(
      ["Logo and palette", "$1,500", "2 weeks"],
      ["Starter identity: logo, type, colors, mini-guide", "$2,500", "3 weeks"],
      ["Full system, voice and 20-page guidelines", "$6,000", "5 weeks"],
    ),
  },
  {
    key: "documents",
    name: "Documents & decks",
    group: "design",
    line: "Pitch decks, one-sheets, menus, proposals and template suites.",
    chip: "Documents & decks",
    tiers: tiers(
      ["One-pager or menu", "$400", "3 business days"],
      ["Pitch deck, up to 15 slides", "$1,200", "5 business days"],
      ["Template suite: deck, doc, one-pager, social", "$1,800", "10 business days"],
    ),
  },
  {
    key: "ai-visuals",
    name: "AI-generated visuals",
    group: "design",
    line: "Concept imagery and motion loops made with Higgsfield, always labeled as generated.",
    chip: "AI visuals",
    tiers: tiers(
      ["10 concept images", "$300", "2 business days"],
      ["25 images plus 3 motion loops", "$750", "3 business days"],
      ["Campaign set: 60 images, 10 loops, usage rights", "$1,800", "5 business days"],
    ),
  },
];

export type Bundle = {
  key: string;
  name: string;
  forWho: string;
  contents: string[];
  price: string;
  /** Quote-form chips to preselect. */
  chips: QuoteService[];
};

/** The anchor: first and largest in Pricing. */
export const LAUNCH_KIT: Bundle = {
  key: "launch-kit",
  name: "Launch Kit",
  forWho: "For a business opening its doors, or opening them again",
  contents: [
    "Starter brand identity",
    "5-page brand site",
    "Half-day photo shoot",
    "One-pager template",
  ],
  price: "$7,500",
  chips: ["Brand identity", "Website", "Photography", "Documents & decks"],
};

/** Segment bundles: shown under the Services panels, not in the Pricing grid. */
export const SEGMENT_BUNDLES: Bundle[] = [
  {
    key: "opening-night",
    name: "Opening Night",
    forWho: "Bars, restaurants, venues",
    contents: ["Half-day interior and food shoot", "3 social video cuts", "Menu design"],
    price: "$2,800",
    chips: ["Photography", "Video production", "Documents & decks"],
  },
  {
    key: "press-kit",
    name: "Press Kit",
    forWho: "Musicians and bands",
    contents: ["Press photos (half-day)", "Live or promo cut", "EPK one-sheet", "One-page site"],
    price: "$4,200",
    chips: ["Photography", "Video production", "Documents & decks", "Website"],
  },
  {
    key: "pitch-ready",
    name: "Pitch Ready",
    forWho: "Startups and founders",
    contents: ["Pitch deck", "Landing page", "10 AI concept visuals"],
    price: "$3,000",
    chips: ["Documents & decks", "Website", "AI visuals"],
  },
];

export type Retainer = {
  key: string;
  name: string;
  line: string;
  price: string;
  term: string;
};

export const RETAINERS: Retainer[] = [
  {
    key: "content-retainer",
    name: "Content retainer",
    line: "One half-day shoot, 8 edits and 2 templates every month.",
    price: "$1,800/mo",
    term: "3-month minimum",
  },
  {
    key: "fractional-cd",
    name: "Fractional creative director",
    line: "10 hours a month of creative direction, reviews and vendor wrangling.",
    price: "$3,500/mo",
    term: "3-month minimum",
  },
];

export const POLICY_LINES = [
  "25% deposit books the date; balance on delivery, net 7.",
  "Rush: +25% for half the stated turnaround, subject to availability.",
  "Travel included within 40 miles of Seattle; mileage and lodging beyond.",
  "Prices exclude WA sales tax where applicable, talent, locations and paid music licenses, quoted as pass-through.",
];

export function serviceByKey(key: string | undefined): Service | undefined {
  return SERVICES.find((s) => s.key === key);
}

export function bundleByKey(key: string | undefined): Bundle | undefined {
  return [LAUNCH_KIT, ...SEGMENT_BUNDLES].find((b) => b.key === key);
}
