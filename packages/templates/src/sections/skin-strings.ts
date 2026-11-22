import { strings as khmer } from "./khmer/strings";
import { strings as emerald } from "./emerald/strings";
import { strings as garden } from "./garden/strings";
import { strings as cream } from "./cream/strings";
import { strings as sakura } from "./sakura/strings";
import { strings as fairytale } from "./fairytale/strings";
import { strings as kids } from "./kids/strings";

const PACKS = [khmer, emerald, garden, cream, sakura, fairytale, kids];

/** Merged strings of the shared `khmer.` pack and the six skins, merged into the i18n dictionary. Keys are prefixed per pack. */
export const SKIN_EN: Record<string, string> = Object.assign({}, ...PACKS.map((p) => p.en));
export const SKIN_KH: Record<string, string> = Object.assign({}, ...PACKS.map((p) => p.kh));

/** Parity check: every English key needs a Khmer one and vice versa. */
export function skinKeyMismatches(): string[] {
  const en = Object.keys(SKIN_EN);
  const kh = Object.keys(SKIN_KH);
  return [
    ...en.filter((k) => !(k in SKIN_KH)).map((k) => `missing kh: ${k}`),
    ...kh.filter((k) => !(k in SKIN_EN)).map((k) => `missing en: ${k}`),
  ];
}
