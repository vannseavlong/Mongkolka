import { FAIRYTALE_CSS } from "./fairytale-styles";

/** Hoisted once per page by React; safe to render from every fairytale component. */
export function FairytaleStyles() {
  return (
    <style href="mk-fairytale-css" precedence="mk-fairytale">
      {FAIRYTALE_CSS}
    </style>
  );
}
