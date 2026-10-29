const MAX_GUEST_NAME = 80;

/**
 * Guest greeting from `?name=` / `?to=`: several guests may be comma-separated and are joined with " & ".
 * The result is trimmed and capped at 80 characters so a crafted link cannot flood the page.
 */
export function guestGreetingFrom(query: { [key: string]: string | string[] | undefined }): string | undefined {
  const raw = typeof query.name === "string" ? query.name : typeof query.to === "string" ? query.to : undefined;
  if (!raw) return undefined;
  const joined = raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" & ")
    .trim()
    .slice(0, MAX_GUEST_NAME)
    .trim();
  return joined || undefined;
}
