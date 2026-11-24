import type { SkinId } from "../skins";
import { SAKURA_ORNAMENTS } from "../sakura/ornaments";
import { DEFAULT_ORNAMENTS } from "./ornaments/default-ornaments";
import { FAIRYTALE_ORNAMENTS } from "../fairytale/ornaments";
import { CREAM_ORNAMENTS } from "../cream/ornaments";
import { GARDEN_ORNAMENTS } from "../garden/ornaments";
import { KIDS_ORNAMENTS } from "../kids/ornaments";
import type { SkinOrnaments } from "./skin-ornament-types";
import { EMERALD_ORNAMENTS } from "../emerald/ornaments";
import { COVENANT_ORNAMENTS } from "../covenant/ornaments";

/**
 * One entry per skin. Until a skin task replaces its own line with a set imported from its own
 * folder (for example `emerald: EMERALD_ORNAMENTS` from "../emerald/ornaments"), it uses the
 * shared gold set. A skin task edits only its own line in this file.
 */
export const SKIN_ORNAMENTS: Record<SkinId, SkinOrnaments> = {
  emerald: EMERALD_ORNAMENTS,
  garden: GARDEN_ORNAMENTS,
  cream: CREAM_ORNAMENTS,
  sakura: SAKURA_ORNAMENTS,
  fairytale: FAIRYTALE_ORNAMENTS,
  kids: KIDS_ORNAMENTS,
  covenant: COVENANT_ORNAMENTS,
};

export function ornamentsFor(skin: SkinId | null | undefined): SkinOrnaments {
  return (skin && SKIN_ORNAMENTS[skin]) || DEFAULT_ORNAMENTS;
}
