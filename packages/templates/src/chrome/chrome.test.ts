import { test } from "node:test";
import assert from "node:assert/strict";
import { getCountdown, isCountdownLive, formatCountdownUnit } from "./countdown";
import { buildDockItems, sectionAnchorId } from "./dock-items";
import { pickActiveId, isAtBottom } from "./scroll-spy";
import { shouldDeferReveal } from "./reveal";
import { isDirectAudioUrl, resolveMusicSrc, musicReducer, toggleIntent, shouldPrimeMusic } from "./audio";
import { buildParticles, particleCount, isLowPowerDevice } from "./particles";
import { mixHex, parseHex, goldStops, goldGradient, withAlpha } from "./gold";
import { resolveChrome } from "./config";
import { toKhmerDigits, localizeDigits } from "../format";

const T = "2026-05-29T17:00:00+07:00";
const at = (iso: string) => new Date(iso).getTime();

test("countdown: before the event day counts down and is 'upcoming'", () => {
  const c = getCountdown(T, at("2026-05-27T16:30:15+07:00"));
  assert.equal(c.status, "upcoming");
  assert.deepEqual([c.days, c.hours, c.minutes, c.seconds], [2, 0, 29, 45]);
});

test("countdown: same Phnom Penh day before start is 'day', after start is 'started'", () => {
  assert.equal(getCountdown(T, at("2026-05-29T08:00:00+07:00")).status, "day");
  assert.equal(getCountdown(T, at("2026-05-29T17:00:00+07:00")).status, "started");
  assert.equal(getCountdown(T, at("2026-05-29T23:59:00+07:00")).status, "started");
  assert.equal(getCountdown(T, at("2026-05-30T00:00:01+07:00")).status, "ended");
});

test("countdown: the day boundary follows Cambodia time, not UTC", () => {
  // 2026-05-28T18:00Z is already 29 May 01:00 in Phnom Penh.
  assert.equal(getCountdown(T, at("2026-05-28T18:00:00Z")).status, "day");
  // 2026-05-28T16:00Z is 28 May 23:00 in Phnom Penh: still 'upcoming'.
  assert.equal(getCountdown(T, at("2026-05-28T16:00:00Z")).status, "upcoming");
});

test("countdown: invalid or missing target", () => {
  assert.equal(getCountdown(undefined, 0).status, "invalid");
  assert.equal(getCountdown("not a date", 0).status, "invalid");
  assert.equal(getCountdown(T, Number.NaN).status, "invalid");
});

test("countdown: only upcoming/day keep ticking; units are padded and localized", () => {
  assert.equal(isCountdownLive("upcoming"), true);
  assert.equal(isCountdownLive("day"), true);
  assert.equal(isCountdownLive("started"), false);
  assert.equal(isCountdownLive("ended"), false);
  assert.equal(formatCountdownUnit(7, "en"), "07");
  assert.equal(formatCountdownUnit(7, "kh"), "០៧");
  assert.equal(formatCountdownUnit(123, "kh"), "១២៣");
  assert.equal(formatCountdownUnit(-4, "en"), "00");
});

test("khmer numerals", () => {
  assert.equal(toKhmerDigits(2568), "២៥៦៨");
  assert.equal(toKhmerDigits("29 May"), "២៩ May");
  assert.equal(localizeDigits(10, "en"), "10");
  assert.equal(localizeDigits(10, "kh"), "១០");
});

test("dock: enabled sections only, page order, default keys, no duplicates, capped", () => {
  const sections = [
    { section_key: "gallery", enabled: true, display_order: 4 },
    { section_key: "invitation", enabled: true, display_order: 2 },
    { section_key: "hero", enabled: true, display_order: 1 },
    { section_key: "agenda", enabled: false, display_order: 3 },
    { section_key: "guestbook", enabled: true, display_order: 5 },
    { section_key: "gallery", enabled: true, display_order: 6 },
    { section_key: "rsvp", enabled: true, display_order: 7 },
  ];
  const items = buildDockItems(sections);
  assert.deepEqual(items.map((i) => i.key), ["invitation", "gallery", "guestbook"]);
  assert.equal(items[0]!.icon, "invitation");
  assert.equal(items[2]!.labelKey, "dock.wishes");
  assert.deepEqual(buildDockItems(sections, ["rsvp", "gallery"]).map((i) => i.key), ["gallery", "rsvp"]);
  assert.equal(buildDockItems(sections, ["invitation", "gallery", "guestbook", "rsvp"], 2).length, 2);
  assert.equal(sectionAnchorId("details"), "mk-sec-details");
});

test("scroll-spy: last section above the probe line wins; empty sections are ignored", () => {
  const boxes = [
    { id: "a", top: -900, bottom: -100 },
    { id: "b", top: -100, bottom: 300 },
    { id: "c", top: 300, bottom: 900 },
    { id: "empty", top: 310, bottom: 310 },
  ];
  assert.equal(pickActiveId(boxes, 800), "c"); // probe line at 320, c.top 300 has crossed it
  assert.equal(pickActiveId(boxes, 600), "b"); // probe line at 240, c.top 300 has not
});

test("scroll-spy: above the first section is null; at the bottom the last section wins", () => {
  const boxes = [
    { id: "a", top: 500, bottom: 900 },
    { id: "b", top: 900, bottom: 1300 },
  ];
  assert.equal(pickActiveId(boxes, 800), null);
  assert.equal(pickActiveId(boxes, 800, { atBottom: true }), "b");
  assert.equal(pickActiveId([], 800), null);
  assert.equal(isAtBottom(1200, 800, 2000), true);
  assert.equal(isAtBottom(1000, 800, 2000), false);
});

test("reveal: defer only below the fold and never under reduced motion", () => {
  assert.equal(shouldDeferReveal(100, 800, false), false);
  assert.equal(shouldDeferReveal(900, 800, false), true);
  assert.equal(shouldDeferReveal(900, 800, true), false);
});

test("audio: only direct https/site-relative audio files are playable", () => {
  assert.equal(isDirectAudioUrl("https://cdn.example.com/a/song.mp3"), true);
  assert.equal(isDirectAudioUrl("https://cdn.example.com/song.M4A?x=1#t"), true);
  assert.equal(isDirectAudioUrl("/audio/theme.ogg"), true);
  assert.equal(isDirectAudioUrl("http://insecure.example.com/song.mp3"), false);
  assert.equal(isDirectAudioUrl("//evil.example.com/song.mp3"), false);
  assert.equal(isDirectAudioUrl("javascript:alert(1)//.mp3"), false);
  assert.equal(isDirectAudioUrl("https://open.spotify.com/playlist/abc"), false);
  assert.equal(isDirectAudioUrl("https://example.com/page.mp3.html"), false);
  assert.equal(isDirectAudioUrl(undefined), false);
});

test("audio: source priority override > couple's music link > template default", () => {
  const mp3 = (n: string) => `https://x.example/${n}.mp3`;
  assert.equal(resolveMusicSrc({ override: mp3("o"), musicSectionUrl: mp3("c"), templateDefault: mp3("t") }), mp3("o"));
  assert.equal(resolveMusicSrc({ musicSectionUrl: mp3("c"), templateDefault: mp3("t") }), mp3("c"));
  assert.equal(resolveMusicSrc({ musicSectionUrl: "https://open.spotify.com/x", templateDefault: mp3("t") }), mp3("t"));
  assert.equal(resolveMusicSrc({}), undefined);
});

test("audio: play-state machine", () => {
  assert.equal(musicReducer("idle", "started"), "playing");
  assert.equal(musicReducer("playing", "paused"), "paused");
  assert.equal(musicReducer("idle", "blocked"), "blocked");
  assert.equal(musicReducer("paused", "blocked"), "paused");
  assert.equal(toggleIntent("playing"), "pause");
  for (const s of ["idle", "paused", "blocked"] as const) assert.equal(toggleIntent(s), "play");
});

test("particles: deterministic and within the documented bounds", () => {
  const a = buildParticles("petals", 14, 7, 2);
  assert.deepEqual(a, buildParticles("petals", 14, 7, 2));
  assert.notDeepEqual(a, buildParticles("petals", 14, 8, 2));
  assert.equal(a.length, 14);
  for (const p of a) {
    assert.ok(p.x >= 0 && p.x <= 100);
    assert.ok(p.size >= 10 && p.size <= 18);
    assert.ok(p.delay <= 0 && p.duration >= 12 && p.duration <= 22);
    assert.ok(p.colorIndex === 0 || p.colorIndex === 1);
  }
  assert.equal(buildParticles("dust", -3, 1).length, 0);
});

test("particles: count is capped by width, density and device power", () => {
  const desktop = particleCount("dust", { viewportWidth: 1280 });
  const phone = particleCount("dust", { viewportWidth: 390 });
  const weakPhone = particleCount("dust", { viewportWidth: 390, lowPower: true });
  assert.ok(phone < desktop && weakPhone < phone);
  assert.ok(particleCount("dust", { viewportWidth: 1280, density: "high" }) <= 40);
  assert.ok(particleCount("butterflies", { viewportWidth: 320, density: "low", lowPower: true }) >= 1);
  assert.equal(isLowPowerDevice({ hardwareConcurrency: 4 }), true);
  assert.equal(isLowPowerDevice({ deviceMemory: 2 }), true);
  assert.equal(isLowPowerDevice({ hardwareConcurrency: 8, deviceMemory: 8 }), false);
  assert.equal(isLowPowerDevice({}), false);
});

test("gold: hex parsing and mixing", () => {
  assert.deepEqual(parseHex("#D4AF37"), { r: 212, g: 175, b: 55 });
  assert.deepEqual(parseHex("#fff"), { r: 255, g: 255, b: 255 });
  assert.equal(parseHex("gold"), null);
  assert.equal(mixHex("#000000", "#ffffff", 50), "#808080");
  assert.equal(mixHex("#d4af37", "#ffffff", 100), "#d4af37");
  assert.equal(mixHex("gold", "#ffffff", 50), "gold");
  assert.equal(withAlpha("#0d2b1d", 0.5), "rgba(13, 43, 29, 0.5)");
  const g = goldStops("#d4af37");
  assert.equal(g.mid, "#d4af37");
  assert.notEqual(g.hi, g.lo);
  assert.match(goldGradient("#d4af37", 90), /^linear-gradient\(90deg, #[0-9a-f]{6} 0%, #d4af37 48%, #[0-9a-f]{6} 100%\)$/);
});

test("config: everything off by default; normalises shorthand", () => {
  assert.equal(resolveChrome(undefined), null);
  assert.equal(resolveChrome({}), null);
  assert.equal(resolveChrome({ dock: false, music: false }), null);
  const r = resolveChrome({ dock: true, music: { src: "/a.mp3" }, particles: { kinds: ["petals", "petals", "dust"] } });
  assert.deepEqual(r?.dock, {});
  assert.deepEqual(r?.music, { src: "/a.mp3", icon: "disc", corner: "top-right" });
  assert.deepEqual(r?.particles?.kinds, ["petals", "dust"]);
  assert.equal(r?.particles?.density, "normal");
  assert.equal(r?.reveal, true);
  assert.equal(resolveChrome({ reveal: true })?.reveal, true);
  assert.equal(resolveChrome({ dock: true, reveal: false })?.reveal, false);
});

test("chrome theme: CSS variables derive from the 4 theme colors", async () => {
  const { chromeVars, defaultParticleColors } = await import("./chrome-theme");
  const v = chromeVars({ bg_color: "#0d2b1d", text_color: "#f3e5ab", accent_color: "#d4af37" });
  assert.equal(v["--mk-gold"], "#d4af37");
  assert.match(v["--mk-gold-grad"]!, /^linear-gradient\(135deg,/);
  assert.equal(v["--mk-glass"], "rgba(13, 43, 29, 0.64)");
  assert.equal(v["--mk-ink"], "#f3e5ab");
  const colors = defaultParticleColors("#d4af37");
  assert.equal(colors.length, 3);
  assert.equal(colors[2], "#d4af37");
});

test("resolveChrome: malformed stored JSON never throws and turns the feature off", () => {
  const bad = [
    "oops", 42, [], { particles: {} }, { particles: "x" }, { particles: { kinds: "petals" } },
    { particles: { kinds: [1, null, "snow"] } }, { dock: { include: "a" } }, { music: 5 },
    { music: { icon: 3, corner: {}, src: 9 } }, { reveal: "yes" },
  ];
  for (const config of bad) {
    assert.doesNotThrow(() => resolveChrome(config as never), JSON.stringify(config));
  }
  assert.equal(resolveChrome({ particles: {} } as never), null);
  assert.equal(resolveChrome({ particles: { kinds: ["snow"] } } as never), null);
  assert.deepEqual(resolveChrome({ particles: { kinds: ["petals", "snow", "petals"], density: "huge" } } as never)?.particles, {
    kinds: ["petals"], density: "normal", colors: undefined,
  });
  assert.deepEqual(resolveChrome({ dock: { include: ["a", 3] } } as never)?.dock, { include: ["a"] });
  const m = resolveChrome({ music: { icon: 3, corner: {}, src: 9 } } as never)?.music;
  assert.deepEqual(m, { src: undefined, icon: "disc", corner: "top-right" });
});

test("music: a src change resets the status to idle", () => {
  assert.equal(musicReducer("playing", "reset"), "idle");
  assert.equal(musicReducer("blocked", "reset"), "idle");
});

test("music: only the primary open action (or a non-opted-out button) primes playback", () => {
  const fake = (matches: Record<string, boolean>) => ({
    closest: (sel: string) => (matches[sel] ? ({} as never) : null),
  });
  assert.equal(shouldPrimeMusic(null), false);
  assert.equal(shouldPrimeMusic(fake({})), false, "a tap on plain gate artwork");
  assert.equal(shouldPrimeMusic(fake({ 'button, a, [role="button"]': true })), true, "fallback: any button");
  assert.equal(shouldPrimeMusic(fake({ "[data-mk-open]": true })), true);
  assert.equal(shouldPrimeMusic(fake({ "[data-mk-no-music]": true, 'button, a, [role="button"]': true })), false, "language switch");
  assert.equal(shouldPrimeMusic(fake({ "[data-mk-no-music]": true, "[data-mk-open]": true })), false);
});
