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

## Review 2026-10-29 (fresh agent, G5; browser and code review only; tsc, eslint, API tests and build not rerun)
Verdict: NOT ready for testing: one blocker.
BLOCKER: the right half of the "Open the invitation" button is dead. Each door is clipped (`clip-path: inset`), the right door sits over the left door's right half and shows the non-interactive `<span>` copy of the button; measured with elementFromPoint: BUTTON at 10/30/45/49% of the button width, SPAN at 51/60/90%; a real click on the right half fired `onOpen` 0 times. The author's earlier "real click fired onOpen" landed on the left half. Should-fix: the focus ring is cut in half by the same clip; on landscape phones (667x375) the arch is 400x649 and the button sits below the fold (the overlay scrolls). All sent back.
Verified OK: doors rotate to about 78 degrees and fade, gone at about 1.3 s (sampled computed style at 150 ms steps; a multi-frame GIF could not be captured); `onOpen` exactly once for a double click, Enter and Space; unmount mid-animation 500 ms in -> no `onOpen`, no errors, no leftover timers; no hydration warnings after a fresh reload; all guest text plain text (HTML, `<img onerror>`, Khmer, RTL, emoji; whitespace-only falls back to "You are invited"); single partner name shows no "&"; long names wrap at 320 px; the rest of the site is unmounted under the gate; the language toggle (z-60) stays above the gate (z-50) like the other openings; string parity; contrast gold #8a6418 5.36:1 on white and 4.95:1 on pink.
Code only (not emulated): reduced motion opens immediately; builder preview box behaves like the other `fixed` gates.
Nits: focus drops to body when the gate unmounts (same as the other gates).

## Fixes 2026-10-29 (commit 31a8cbc; Opening.tsx only)
Blocker fixed: both door copies are now inert visuals (aria-hidden, pointer-events none, the button is a painted span); ONE real unclipped layer above both doors holds the single real `<button>` (border and text transparent, adds only hover and focus), so the whole button is clickable; the layer is visibility:hidden except the button, the heading, greeting and date stay in the accessibility tree at opacity 0; it fades out and is disabled once opening starts, and a ref guard stops `onOpen` firing twice. Focus ring draws fully around the whole button. Arch width `min(100%, 400px, (100dvh - 1.5rem) / 1.82)` with smaller vertical padding and lower type minimums: the whole gate including the button fits at 667x375, 568x320 and 844x390; 390x844 and 1200x800 unchanged. The two door halves overlap by 1px (removed a faint seam). Not done: focus after the gate unmounts (no reliable target without touching SiteRenderer).
Real-browser results (own tab, throwaway page with an onOpen counter): elementFromPoint returns the BUTTON at 10, 50, 51 and 90% of the button width; real mouse clicks: 90% -> 1, 51% double-click -> 1, 50% -> 1, 10% -> 1; Tab then Enter -> 1, Space -> 1; zoomed focus ring complete; animation sampled every 140 ms: doors rotate to about +78 and -78 degrees and fade to 0 by about 1.1 s, root fades from about 0.7 s, onOpen at about 1.3 s; console from page load (en and kh) clean. tsc, eslint grace, API tests 96/96; next build web and couple printed route tables (exit code capture was empty, success inferred).
Not verified: a real mouse click under reduced motion (branch unchanged), a recorded GIF, the builder preview box, no-name and Khmer layouts after the final CSS tweaks (Khmer only got the console check), 320x568 with very long names after the change, a fresh independent re-review of the fix (the first review caught a blocker the author's own click test had missed).
