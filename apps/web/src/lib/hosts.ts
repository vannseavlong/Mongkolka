/**
 * True for hosts that serve the main Mongkolka site. Any other host that reaches the site shell
 * is a custom domain mapped to a couple and is resolved by host (see Web-custom-domain-routing).
 */
export function isMainHost(hostname: string): boolean {
  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "").split(":")[0].toLowerCase();
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    (root !== "" && (hostname === root || hostname === `www.${root}`)) ||
    hostname.endsWith(".web.app") ||
    hostname.endsWith(".firebaseapp.com")
  );
}
