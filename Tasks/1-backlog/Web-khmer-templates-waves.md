# Web-khmer-templates-waves (waves 2 to 6 of the Khmer e-invite templates)

- **Repo:** packages/templates (+ apps/api seeds, apps/couple, apps/web for QA)
- **Owner:** SNLRLONG
- **Tier:** T2 per task, `Web-khqr-gift` is **T3** (payment data) · auto picker, see `PIPELINE.md`
- **Claimed by:** none
- **Docs:** `Tasks/_plans/Web-khmer-einvite-templates.md`, `khmer-einvite-reference/templates/01..06-*.md`, `docs/grace-template-howto.md`
- **Depends on:** `Web-khmer-section-keys`, `Web-khmer-chrome`

Promote each task to `2-todo/` when its dependency is done. Every skin is original artwork (SVG/CSS), seeded **inactive**, English and Khmer, with loading/empty/error states, reduced-motion support, 360px to 1200px.

## 2. `Web-khmer-skeleton` (T2)
Register every new component id as a stub in `registry.ts`, add per-skin string files in `i18n`, add inactive `site_templates` and `section_components` seed rows for the six templates (`emerald_kbach`, `royal_garden`, `royal_cream`, `sakura_romance`, `fairytale_storybook`, `kids_fantasy_birthday`) with `default_sections`, `default_theme` and chrome config. After this, later tasks edit only their own folder, strings file and seed block.

## 3a. `Web-khmer-core-sections` (T2)
Shared themed components used by all skins: `invitation_khmer` (parents left/right, crest centre, KH then EN, lunar + solar date, countdown to `startsAt`, "Event Started" state), `agenda_khmer` (vertical timeline by day, line icon per ritual from the `AgendaIcon` enum), `letters_khmer` (gratitude and apology), location block in `details` (venue image, "view location" button, QR from `mapUrl`). Skins restyle via CSS variables and an ornament prop, not forks. Logic in hooks/pure functions.

## 3b. `Web-khqr-gift` (T3, after `Web-khmer-section-keys`)
`registry` gift content (KHQR image, bank, account name/number), gold-framed display, copy button with toast, couple editor with image upload through the existing assets API. Display and copy only: no amounts, no collection. Server validates image type/size via existing upload limits; account number is personal/payment data: no logging, OWASP checklist + `/security-review` recorded in the task, G9 and G10 apply.

## 4. `Web-khmer-skin-emerald` (T2, pilot)
`emerald_kbach` (reference 05): double-door opening with 3D swing, rotating gold medallion, gold dust, Kbach corners, pin-stripe frames, Moul gold headings, lunar date prominent. Palette emerald `#0D2B1D`/`#081C13`, gold `#F3E5AB`/`#D4AF37`/`#A67C2E`; verify `contrastRatio` on the 4-key theme. This pilot proves the skin contract; fix the skeleton here before the others start.

## 5. Skins (five parallel tasks, T2 each, after the pilot)
- `Web-khmer-skin-royal-garden` (01): wrought-iron gate that parts, fountain court, climbing roses, petals + doves.
- `Web-khmer-skin-royal-cream` (04): envelope flap opening, floral oval arch hero, butterflies, spinning vinyl music icon.
- `Web-khmer-skin-sakura` (03): monogram light burst to white flash, hanging blossom branches, sakura petals, white butterflies.
- `Web-khmer-skin-fairytale` (02): storybook cover page-turn, hydrangea/baby's-breath frames, morpho butterflies, polaroid gallery.
- `Web-khmer-skin-kids` (06): birthday event, party timeline instead of ritual agenda, rounded font, **original** chibi mascots drawn from scratch, "សូមចុចទីនេះដើម្បីចូល" CTA, frosted cards. Confirm no licensed or traced character.

## 6. `Web-khmer-templates-qa-launch` (T2)
Sample content (KH + EN) in `SAMPLE_CONTENT`; walk every template at phone, tablet and desktop in both languages; contrast and keyboard passes; full flow (pick template, upload, publish, `?to=Name`, guestbook, gift copy); native-speaker Khmer review; flip each template row and its component rows to `active` together; update the owner how-to doc. Owner approval is the acceptance.

## Done when (whole set)
- [ ] Six templates appear in the catalog/gallery and builder and work in preview and public site
- [ ] Original artwork only; Khmer reviewed by a native speaker
- [ ] Root `CHANGELOG.md` entries, worktrees and branches removed after merge
