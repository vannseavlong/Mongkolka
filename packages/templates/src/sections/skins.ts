/**
 * The Khmer e-invitation skins (six, plus the Christian "covenant" skin) (Tasks/_plans/Web-khmer-einvite-templates.md). Each skin owns
 * `sections/<id>/` (Opening, Hero, strings, index) and the component ids `opening_<id>` / `hero_<id>`.
 * Skin tasks replace the stub bodies in their own folder only.
 */
export const SKIN_IDS = ["emerald", "garden", "cream", "sakura", "fairytale", "kids", "covenant"] as const;
export type SkinId = (typeof SKIN_IDS)[number];

/** Dictionary keys a skin (or the shared `khmer` pack) may add: always prefixed with the pack id. */
export type SkinKey = `${SkinId | "khmer"}.${string}`;
