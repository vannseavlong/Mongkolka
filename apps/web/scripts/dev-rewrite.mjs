// The same URL -> static shell mapping as firebase.json, for `next dev` (see dev.mjs).
// Under `output: "export"` Next's dev server insists every dynamic URL is listed in generateStaticParams(), and
// next.config rewrites do not get around that check, so the rewrite happens in front of Next instead.

const TOP_LEVEL = new Set(["_", "_next", "about", "contact", "marketplace", "templates", "api", "favicon.ico"]);

/** The path Next should serve for a browser path, or the same path when it needs no rewrite. */
export function devRewrite(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1] ?? "";
  if (parts.length === 0 || last.includes(".") || parts[0] === "_next") return pathname; // files and Next internals
  const [a, b, c] = parts;
  if (a === "marketplace" && parts.length === 2 && b !== "_") return "/marketplace/_";
  if (a === "templates" && b === "preview" && parts.length === 3 && c !== "_") return "/templates/preview/_";
  if (a === "templates" && b !== "preview" && parts.length === 2 && b !== "_") return "/templates/_";
  if (TOP_LEVEL.has(a)) return pathname;
  if (parts.length === 1) return "/_";
  if (parts.length === 2 && (b === "wishes" || b === "photos" || b === "gallery")) return `/_/${b}`;
  return pathname;
}
