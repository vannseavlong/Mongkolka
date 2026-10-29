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
- [x] G1 scope (only the four owned files)  - [x] G2 static (tsc clean templates, web, couple; eslint grace clean; builds compiled but the author only saw partial output)  - [x] G3 tests (API 96/96 incl. strings parity; none for templates: no runner)  - [~] G4 run it (headless Chrome 320/390/820/1200 px, en and kh; reduced motion, console hydration warnings and the Reveal animation not checked)
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Verse in English and Khmer, with and without textKh; long verse wraps; empty renders null
- [ ] Footer with full content, with one partner name, with no date; long hashtag wraps at 320px
- [ ] Small text meets 4.5:1 contrast on the pink ground
- [ ] English and Khmer strings
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Status 2026-10-29
Built in commit 10f1806 on `feat/grace-verse-footer`, not merged. Verse: white circle with a double gold ring holding the larger cross with floral spray, gold divider with a small cross, italic serif verse with balanced line breaks, thin gold line and the reference in small gold letter-spaced capitals; Khmer mode shows textKh when set (else the English text, upright, no uppercase or letter-spacing); fade-up on scroll, none under reduced motion; empty text renders nothing; figure/blockquote/figcaption/cite. Footer: thin gold top line, spray cross, "Together with love" label, names in large script with a gold ampersand (Khmer serif in kh), date, optional message, gold hashtag, short rule and a small underlined "Made with Mongkolka" link; one partner name drops the ampersand; missing date omitted; wraps at 320 px.
Open points: the credit link goes to `https://mongkolka.com` (a GUESS: the repo has no brand URL constant; owner to confirm, ideally an env-driven constant); with no couple and no content the footer still shows the cross, label and credit (Footer/Classic returns nothing); gold text uses accent 4.95:1 on the pink ground, the credit link's contrast was not measured; added keys grace.verse.reference (unused), grace.footer.together, grace.footer.credit; stub keys removed.
Not verified: mobile Safari, real Khmer text beyond samples, full build output, reduced motion, hydration warnings.
Next: G5 review, G7, G8, G11.
