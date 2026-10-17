const TZ = "America/Los_Angeles";

/** The next business day in Seattle, e.g. "Monday, October 19". */
export function nextBusinessDay(from: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(from);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  // Noon UTC on the Seattle calendar date keeps day arithmetic clear of DST edges.
  const day = new Date(Date.UTC(get("year"), get("month") - 1, get("day"), 12));
  do {
    day.setUTCDate(day.getUTCDate() + 1);
  } while (day.getUTCDay() === 0 || day.getUTCDay() === 6);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(day);
}
