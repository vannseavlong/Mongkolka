/** True when `pathname` is the link's page or sits under it (e.g. /templates/preview/x is under /templates). */
export function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return path === href || path.startsWith(`${href}/`);
}
