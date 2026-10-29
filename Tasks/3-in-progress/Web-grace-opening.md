# Web-grace-opening

- **Repo:** packages/templates
- **Owner:** SNLRLONG
- **Tier:** T2 · new components in a shared package (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (Web-grace-opening), 2026-10-29
- **Worktree:** `Mongkolka/grace-opening/` · **Branch:** `feat/grace-opening`
- **Started / updated:** 2026-10-29 / 2026-10-29
- **Docs:** Tasks/_plans/Web-grace-wedding-template.md, Tasks/1-backlog/Web-grace-sections.md
- **Depends on:** Web-grace-skeleton (merged)
- **Touches:** packages/templates/src/sections/grace/Opening.tsx, grace/strings/opening.ts

## Goal
Replace the `GraceOpening` stub (`opening_grace`) with the real gate: arched gold-line window on a pink gradient, cross at the top of the arch, "Dear {name}" in script type from `guestGreeting` (the `?name=`/`?to=` param, already read by the web page), "You are invited" when there is no name, couple names and date, falling petals, tap/Enter to open (arch doors part), `onOpen` after the animation; keyboard operable, reduced-motion friendly, English and Khmer.

## Gates
- [x] G1 scope (only the two owned files)  - [x] G2 static (tsc clean templates, web, couple; eslint grace clean; next build web and couple pass)  - [x] G3 tests (API 96/96 incl. strings parity; none for templates: no runner)  - [~] G4 run it (headless Chrome screenshots at 390, 1200, 320 with long names, no name, Khmer; real click in a live tab fired onOpen; door motion mid-swing, reduced motion, load-time hydration warnings and the builder preview box NOT verified)
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Name from `?to=` appears; no name shows a graceful fallback; long names wrap at 320px
- [ ] Opening animation plays once, then `onOpen` fires; reduced motion skips the animation but still opens
- [ ] Keyboard: focusable control, Enter/Space opens; focus is not trapped
- [ ] Works full-screen on the public site and inside the builder preview box
- [ ] English and Khmer strings, Khmer names use the Khmer serif
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Status 2026-10-29
Built in commit 9375a5a on `feat/grace-opening`, not merged. Soft pink gradient ground (from bg_color, darker pink at the top fading to near-white), tall white arched window (up to 400 px) with a thick outer and thin inner gold line, small gold cross with leaf spray at the apex, "Dear {guest}," in script (reuses the existing `opening.dear` key), "You are invited to the wedding of" in soft serif, names large in gold-foil script stacked with a small "&", gold line with a diamond, date in refined serif, gold-outline pill "Open the invitation"; no guest name -> "You are invited" and the "to the wedding of" line is dropped; petals drift behind the arch. Opening: the arch is drawn twice, each copy clipped to one half; on click the halves swing apart in 3D and fade, then the whole gate fades; `onOpen` at 1.3 s. Reduced motion: no petals, `onOpen` immediately. Real `<button>` with aria-label ("Open the wedding invitation of {names}"), visible gold focus ring, no focus trap, second door copy aria-hidden and inert. Khmer names, greeting and button use the Khmer serif (a Khmer guest name does too in English mode). `fixed inset-0` pattern like the other openings. New keys grace.opening.invited, invitedTo, open, openLabel (en and kh).
Gold text #8a6418 on white 5.36:1.
Not verified: doors mid-swing and the final fade (coded, not seen), reduced-motion path exercised, load-time hydration warnings, 820 px, inside the builder preview box. The gate does not use GraceSection (full-screen).
Next: G5 review, G7, G8, G11.
