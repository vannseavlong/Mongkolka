# Web-grace-verse-footer

- **Repo:** packages/templates
- **Owner:** SNLRLONG
- **Tier:** T2 · new components in a shared package (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (Web-grace-verse-footer), 2026-10-29
- **Worktree:** `Mongkolka/grace-verse-footer/` · **Branch:** `feat/grace-verse-footer`
- **Started / updated:** 2026-10-29 / 2026-10-29
- **Docs:** Tasks/_plans/Web-grace-wedding-template.md, Tasks/1-backlog/Web-grace-sections.md
- **Depends on:** Web-grace-skeleton (merged)
- **Touches:** packages/templates/src/sections/grace/Verse.tsx, grace/Footer.tsx, grace/strings/verse.ts, grace/strings/footer.ts

## Goal
Replace the `GraceVerse` and `GraceFooter` stubs. Verse: the Bible verse (`content.text`, `content.reference`, `content.textKh` shown in Khmer mode when set) centred with a cross ornament, semantic figure/blockquote/figcaption, empty text renders nothing. Footer: couple names, date (localized with `formatWeddingDate(iso, language)`), the cross, optional message and hashtag, and a small "Made with Mongkolka" link; never throws with missing content.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (no runner for templates: pure helpers only)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Verse in English and Khmer, with and without textKh; long verse wraps; empty renders null
- [ ] Footer with full content, with one partner name, with no date; long hashtag wraps at 320px
- [ ] Small text meets 4.5:1 contrast on the pink ground
- [ ] English and Khmer strings
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
