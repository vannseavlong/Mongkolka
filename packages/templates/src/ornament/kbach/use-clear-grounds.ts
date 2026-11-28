import { useEffect, type RefObject } from "react";

/** A real picture, as opposed to gradients and the templates' own drawn SVG textures. */
export function hasPicture(backgroundImage: string): boolean {
  return [...backgroundImage.matchAll(/url\(["']?/g)].some((m) => !backgroundImage.startsWith("data:image/svg+xml", m.index + m[0].length));
}

/**
 * Lets the pattern show on templates that paint the page colour on each section: every section (and wrapper above it)
 * whose base colour equals the page ground is marked see-through, soft tints and drawn textures included. Sections with their
 * own colour (a dark band, a card) or a picture keep it, so text contrast does not change.
 */
export function useClearGrounds(root: RefObject<HTMLElement | null>, ground: string, active: boolean) {
  useEffect(() => {
    const page = root.current;
    if (!active || !page) return;
    const target = getComputedStyle(page).backgroundColor;
    const scan = () => {
      for (const section of page.querySelectorAll<HTMLElement>("section")) {
        for (let el: HTMLElement | null = section; el && el !== page; el = el.parentElement) {
          if (el.hasAttribute("data-mk-clear")) continue;
          const { backgroundColor, backgroundImage } = getComputedStyle(el);
          if (backgroundColor === target && !hasPicture(backgroundImage)) el.setAttribute("data-mk-clear", "");
        }
      }
    };
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(page, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      page.querySelectorAll("[data-mk-clear]").forEach((el) => el.removeAttribute("data-mk-clear"));
    };
  }, [root, ground, active]);
}
