import type { SkinId } from "../skins";
import { SAKURA_ORNAMENTS } from "../sakura/ornaments";
import { DEFAULT_ORNAMENTS } from "./ornaments/default-ornaments";
import type { SkinOrnaments } from "./skin-ornament-types";

/**
 * One entry per skin. Until a skin task replaces its own line with a set imported from its own
 * folder (for example `emerald: EMERALD_ORNAMENTS` from "../emerald/ornaments"), it uses the
 * shared gold set. A skin task edits only its own line in this file.
 */
export const SKIN_ORNAMENTS: Record<SkinId, SkinOrnaments> = {
  emerald: DEFAULT_ORNAMENTS,
  garden: DEFAULT_ORNAMENTS,
  cream: DEFAULT_ORNAMENTS,
  sakura: SAKURA_ORNAMENTS,
  fairytale: DEFAULT_ORNAMENTS,
  kids: DEFAULT_ORNAMENTS,
};

export function ornamentsFor(skin: SkinId | null | undefined): SkinOrnaments {
  return (skin && SKIN_ORNAMENTS[skin]) || DEFAULT_ORNAMENTS;
}
