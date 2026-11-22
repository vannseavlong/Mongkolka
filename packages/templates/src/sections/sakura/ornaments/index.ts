import type { SkinOrnaments } from "../../khmer/skin-ornament-types";
import { sakuraHeading, sakuraSurface } from "../sakura-style";
import { SakuraCorner } from "./Corner";
import { SakuraCrest } from "./Crest";
import { SakuraDivider } from "./Divider";
import { SAKURA_ICONS } from "./icons";

/**
 * The Sakura ornament set. Cards carry the hanging-blossom branches and the flower bed as their own
 * background (see sakuraSurface), so the four corner sprigs are off; the Corner component stays
 * available for the hero and for any card that opts back in.
 */
export const SAKURA_ORNAMENTS: SkinOrnaments = {
  id: "sakura",
  Corner: SakuraCorner,
  Divider: SakuraDivider,
  Crest: SakuraCrest,
  icons: SAKURA_ICONS,
  corners: false,
  inset: 9,
  radius: 30,
  surface: sakuraSurface,
  heading: sakuraHeading,
  iconStroke: 1.5,
  motion: "float",
};
