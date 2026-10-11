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
export const PRICING_HREF = "/#pricing";

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
