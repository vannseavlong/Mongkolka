import { contrastRatio, MIN_ACCENT_CONTRAST, MIN_TEXT_CONTRAST } from "@mongkolka/templates";
import type { Theme } from "@mongkolka/templates";

/**
 * Contrast readout for text and accent on the background. The visible text
 * updates freely; the screen-reader status only changes when a pair crosses
 * the threshold, so dragging a color picker does not spam announcements.
 */
export function ContrastNote({ theme }: { theme: Pick<Theme, "bg_color" | "text_color" | "accent_color"> }) {
  const text = contrastRatio(theme.text_color, theme.bg_color);
  const accent = contrastRatio(theme.accent_color, theme.bg_color);
  if (text === null || accent === null) {
    return <p className="text-xs text-muted-foreground">Contrast cannot be checked for these colors.</p>;
  }
  const textLow = text < MIN_TEXT_CONTRAST;
  const accentLow = accent < MIN_ACCENT_CONTRAST;
  const announce = [textLow && "Text contrast is low.", accentLow && "Accent contrast is low."].filter(Boolean).join(" ");
  return (
    <>
      <p className={textLow || accentLow ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
        Contrast on background: text {text.toFixed(1)}:1{textLow ? " (low)" : ""}, accent {accent.toFixed(1)}:1
        {accentLow ? " (low)" : ""}
      </p>
      <p role="status" className="sr-only">
        {announce}
      </p>
    </>
  );
}
