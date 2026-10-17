/**
 * Site constants: change these here and nowhere else (PRD tab 6, Constants).
 *
 * Values still waiting on an open item are marked PLACEHOLDER. The UI treats
 * a placeholder as "not configured" (see isPlaceholder) and hides or falls
 * back for it, so nothing broken ships while the item is pending.
 */

export const SITE_NAME = "Townley Creative";
export const SITE_TITLE = "Townley Creative — Photo, video, web and brand studio in Seattle";
export const TAGLINE =
  "A small creative studio in Seattle. Photo, video, web and brand — for the businesses that keep the lights on late.";

/** Public agency address; forwards to the private inbox, which is never shown.
 *  PLACEHOLDER until a domain is bought. */
export const CONTACT_EMAIL = "hello@[domain]";

/** Calendly event "15-minute consult — Townley Creative".
 *  PLACEHOLDER: empty until the event exists. */
export const CALENDLY_URL = "";

/** The OPEN sign. Update each quarter, or when booked out. */
export const BOOKING_STATUS = "Open — booking Q4 2026";

export const SERVICE_AREA = "Seattle · Tacoma · est. 2026";

export const FONT_STYLESHEET =
  "https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500&family=IBM+Plex+Mono&family=Mr+Dafoe&family=Oswald:wght@300;400;500&display=swap";

export const NAV_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/#services" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Studio", href: "/#studio" },
] as const;

export const START_HREF = "/#contact";
export const QUOTE_HREF = "/quote";
export const AUDIT_HREF = "/audit";
export const PRICING_HREF = "/#pricing";

/** The reel shown in theatre mode. Swap the file (and runtime) when real work
 *  replaces the concept cut; set isConcept to false at the same time. */
export const REEL = {
  /** First playable source wins: VP9 WebM (smaller), then H.264 MP4. */
  sources: [
    { src: "/media/reel/reel.webm", type: "video/webm" },
    { src: "/media/reel/reel.mp4", type: "video/mp4" },
  ],
  poster: "/media/reel/reel-poster.webp",
  runtime: "0:26",
  /** The concept cut is silent; set true for a reel with a soundtrack. */
  hasAudio: false,
  isConcept: true,
} as const;

/** Quote form options (PRD tab 4). */
export const BUDGETS = [
  "Under $1k",
  "$1–3k",
  "$3–7.5k",
  "$7.5–15k",
  "$15k+",
  "Tell me what it costs",
] as const;
export const TIMELINES = ["This month", "Next 1–3 months", "Later", "Hard date"] as const;
export const SEGMENTS = [
  "Restaurant / bar",
  "Music",
  "Event / venue",
  "Startup",
  "Small business",
  "Real estate",
  "Corporate",
  "Other",
] as const;
export const SOURCES = [
  "Instagram",
  "Google",
  "A friend or client",
  "Saw your work somewhere",
  "Other",
] as const;

/** True while a constant still holds its placeholder (empty or "[...]"). */
export function isPlaceholder(value: string): boolean {
  return value.trim() === "" || /\[[^\]]*\]/.test(value);
}

/** mailto link for the agency address, or null while it is a placeholder. */
export function emailHref(subject = "Project inquiry"): string | null {
  if (isPlaceholder(CONTACT_EMAIL)) return null;
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

/** The 15-minute consult; falls back to the contact section until Calendly exists. */
export function bookCallHref(): string {
  return isPlaceholder(CALENDLY_URL) ? START_HREF : CALENDLY_URL;
}
