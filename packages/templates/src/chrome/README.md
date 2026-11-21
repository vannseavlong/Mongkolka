# chrome: shared persistent UI for the Khmer e-invitation templates

Music toggle, bottom glass dock, ambient particles, scroll reveals, countdown logic. **Off unless a template turns it on**; a template without `chrome` renders exactly as before (no extra DOM). Skipped in the builder canvas (when `SiteRenderer` gets `wrapSection`), because fixed overlays would escape it.

## Turn it on (template config)
```ts
// SiteRendererTemplate.chrome  (type ChromeConfig, ./config.ts)
chrome: {
  dock: true,                                  // or { include: ["invitation","agenda","details","gallery","registry","guestbook"] } (max 6 buttons)
  music: { src: "/audio/theme.mp3", icon: "disc" | "waves", corner: "top-right" | "top-left" },
  particles: { kinds: ["petals","dust"], density: "low"|"normal"|"high", colors: ["#f3e5ab"] },
  reveal: true,                                // default true once chrome is configured
}
```
Colors come from the 4 theme keys (accent = gold; bg = glass). Seed it in `site_templates` as part of the template row the renderer receives (`template.chrome`).

## Behaviour
- **Music** starts only from a tap. The opening gate's first tap on a button/link starts it (`useSiteChrome().primeMusicOnTap`, wired in `SiteRenderer`); the toggle then pauses/resumes. Source priority: `SiteRenderer musicSrc` prop > the couple's music-section `playlistUrl` if it is a direct https/site-relative audio file > `chrome.music.src`. No audio request before the first tap; pauses while the tab is hidden. No source = no toggle.
- **Dock** buttons come from enabled sections (`DOCK_TARGETS`: invitation, agenda, details = Location, gallery, registry = Gift, guestbook = Wishes, rsvp). Sections that render nothing are skipped. Active button follows scroll (`pickActiveId`).
- **Sections** are wrapped in `<div id="mk-sec-<key>" data-mk-section>` (`ChromeSection`) so the dock can scroll to them and reveal can fade them in.
- **Particles**: `petals | butterflies | dust | bokeh`, CSS transform/opacity only, count capped by width/density/device power, paused when the tab is hidden, absent under `prefers-reduced-motion`.
- **Countdown** (for the invitation section): `useCountdown(iso)` returns `null` until mounted, then `{status: upcoming|day|started|ended|invalid, days, hours, minutes, seconds}`. Day boundaries use Cambodia time (UTC+7). Pass ISO with an offset. `formatCountdownUnit(n, language)` gives "07" / "០៧"; labels via `chromeText(language, "countdown.days" ...)`.
- **Fonts**: `MOUL_FONT`, `KHMER_BODY_FONT`, `CINZEL_FONT`, `ROUNDED_FONT` stacks (`./fonts.ts`); the CSS variables are loaded in apps/web and apps/couple layouts.

## Layout of this folder
Logic (pure, tested in `chrome.test.ts`): `config, gold, countdown, dock-items, scroll-spy, reveal, audio, particles, chrome-theme`.
Hooks: `use-countdown, use-active-section, use-reveal, use-background-music, use-site-chrome, use-mounted, use-page-visible`.
UI (JSX + props only): `SiteChrome, Dock, dock-icons, MusicToggle, ParticleLayer, particle-shapes, ChromeSection`, CSS in `chrome-styles.ts`.
All artwork (icons, petal, butterfly, disc) is original SVG.
