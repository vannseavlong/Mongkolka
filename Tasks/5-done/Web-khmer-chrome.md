# Web-khmer-chrome

- **ID:** T-0046
- **Repo:** packages/templates, apps/web, apps/couple
- **Owner:** SNLRLONG
- **Tier:** T2 · edits shared renderer and app layouts, new shared components (auto picker)
- **Claimed by:** none (released 2026-11-22, in 4-testing)
- **Worktree:** `Mongkolka/mongkolka-khmer-chrome/` (gitignored locally via .git/info/exclude) · **Branch:** `feat/khmer-chrome`
- **Started / updated:** 2026-11-22 / 2026-11-22
- **Docs:** `Tasks/_plans/Web-khmer-einvite-templates.md`, `khmer-einvite-reference/README.md` (sections 2C, 2E, 3), `docs/grace-template-howto.md`
- **Depends on:** none
- **Touches:** `packages/templates/src/site-renderer.tsx`, `packages/templates/src/chrome/*` (new), `packages/templates/src/format.ts` (countdown and Khmer numeral/date helpers), `apps/web/src/app/layout.tsx`, `apps/couple/src/app/layout.tsx` (fonts)

## Goal
Shared persistent UI and motion, enabled per template through template config, off by default so existing templates are unchanged: music toggle (top-right, starts only on the opening tap), bottom glass dock with smooth-scroll to enabled sections, particle layer (petals, butterflies, gold dust, bokeh kinds), scroll fade-and-rise reveal, and pure countdown logic. Also load Moul, Battambang, Cinzel and a rounded kids font via `next/font/google`.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (countdown and Khmer numeral helpers are pure, test them)  - [ ] G4 run it (390px, tablet, desktop; reduced motion; blocked autoplay)
- [ ] G5 code review  - [ ] G7 docs sync  - [ ] G8 commit  - [ ] G11 changelog

## Done when
- [ ] Existing templates render identically with chrome off (compare before/after)
- [ ] Logic (countdown, scroll-spy, particle count cap) lives in pure functions/hooks, UI files hold JSX only
- [ ] Particles capped by viewport, paused when the tab is hidden, disabled under `prefers-reduced-motion`
- [ ] Dock and music toggle keyboard operable, labelled in KH and EN, usable at 360px
- [ ] Font weight impact noted (kids font loaded only where needed)
- [ ] Root `CHANGELOG.md` entry added; worktree and branch removed after merge

## Dependencies added (reason)
- `tsx` (devDependency of `packages/templates`): runs the new pure-helper tests with `node --test`; same tool apps/api already uses, dev only, MIT.
- `@types/node@^20` (devDependency): types for `node:test`; same range as the apps. No runtime package added.

## Result (2026-11-22, uncommitted in the worktree)
- G1: diff stays in Touches, plus `packages/templates/package.json` + lockfile (test script/devDeps) and `src/chrome/README.md`.
- G2: `tsc --noEmit` clean in packages/templates, apps/web, apps/couple. `eslint` clean on every changed/new file; `eslint .` still reports 8 pre-existing errors in untouched files (ink/*, kbach/shared: missing next/react-hooks plugin definitions).
- G3: `pnpm test` in packages/templates: 18 pass (countdown incl. Cambodia day boundary, Khmer numerals, dock items, scroll-spy, reveal, audio URL/priority/state machine, particles, gold math, config, theme vars).
- G4: temporary demo page (since removed) rendering SiteRenderer with chrome, in two 390x844 iframes, dark emerald + light cream, EN + KH: opening tap starts music (toggle shows playing with glow, pause shows slash + "Play music"), dock shows only present sections and highlights on scroll, dock tap scrolls, reveal states pending/in, particles petals+dust and butterflies+bokeh, chrome off gives zero `mk-*` nodes (DOM identical).
- G5-G11: not run (review agent, changelog, commit belong to the next stages).

## Public API for skeleton/skin tasks
See `packages/templates/src/chrome/README.md`. Entry points: `SiteRendererTemplate.chrome?: ChromeConfig`, `SiteRendererProps.musicSrc?`, exports from `@mongkolka/templates` (`useCountdown`, `getCountdown`, `formatCountdownUnit`, `toKhmerDigits`, `localizeDigits`, `goldGradient`, `goldStops`, `mixHex`, `withAlpha`, `chromeText`, font stacks, `ChromeConfig`).

## Not verified
Real iOS Safari / Android autoplay behaviour (tested in desktop Chrome only); `prefers-reduced-motion` visual pass (CSS + hook written, not emulated); tablet/desktop widths; Khmer dock/music wording (needs native-speaker review); `next build` with the four new Google fonts (offline here, dev server only); framed `/templates/<id>` preview scroll-spy (logic handles inner scroll containers, not exercised); the builder canvas (chrome intentionally off there). Pre-existing: the Envelope opening logs a hydration mismatch on its date (locale format), unrelated to this task.
