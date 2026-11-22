import type { ComponentType, CSSProperties } from "react";
import type { Theme } from "../../types";

/**
 * The form/closing-note side of a skin: how its buttons, fields and choice pills look, plus one small
 * signature mark (rose sprig, blossom, lozenge...) used at the top of the story and in the footer.
 * Kept apart from `SkinOrnaments` (cards, corners, dividers) so a skin's section frame and its form
 * controls can change independently. One entry per skin in `skin-ui.tsx`.
 */
export interface MarkProps {
  /** The theme accent. */
  color: string;
  size?: number;
}

export interface SkinUi {
  id: string;
  /** Primary button (submit, view-map). */
  button: (theme: Theme) => CSSProperties;
  /** Text input / textarea. */
  field: (theme: Theme, invalid: boolean) => CSSProperties;
  /** The face of a choice pill (attending yes / no). */
  chip: (theme: Theme, selected: boolean, invalid: boolean) => CSSProperties;
  /** Round +/- guest-count buttons. */
  stepper: (theme: Theme) => CSSProperties;
  /** Small signature mark. */
  Mark: ComponentType<MarkProps>;
  /** Heading letter-case for Latin headings inside forms is skin-neutral; this is the label tone. */
  labelColor: (theme: Theme) => string;
}
