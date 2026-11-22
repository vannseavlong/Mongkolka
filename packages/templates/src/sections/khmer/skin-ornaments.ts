import type { SkinId } from "../skins";
import { DEFAULT_ORNAMENTS } from "./ornaments/default-ornaments";
import { FAIRYTALE_ORNAMENTS } from "../fairytale/ornaments";
import type { SkinOrnaments } from "./skin-ornament-types";
import { EMERALD_ORNAMENTS } from "../emerald/ornaments";

/**
 * One entry per skin. Until a skin task replaces its own line with a set imported from its own
 * folder (for example `emerald: EMERALD_ORNAMENTS` from "../emerald/ornaments"), it uses the
 * shared gold set. A skin task edits only its own line in this file.
 */
export const SKIN_ORNAMENTS: Record<SkinId, SkinOrnaments> = {
  emerald: EMERALD_ORNAMENTS,
  garden: DEFAULT_ORNAMENTS,
  cream: DEFAULT_ORNAMENTS,
  sakura: DEFAULT_ORNAMENTS,
  fairytale: FAIRYTALE_ORNAMENTS,
  kids: DEFAULT_ORNAMENTS,
};

export function ornamentsFor(skin: SkinId | null | undefined): SkinOrnaments {
  return (skin && SKIN_ORNAMENTS[skin]) || DEFAULT_ORNAMENTS;
}
