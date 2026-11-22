import type { SakuraPalette } from "../palette";
import { archPoints, bezier, n1, rng, svgDataUri, type Pt } from "./geometry";
import { blossom, bud, defs, hydrangea, lavender, leaf, rose, sparkle } from "./parts";

/**
 * Whole-scene SVG strings for the Sakura skin: hanging blossom branches, the flower bed, the arch
 * garland around the hero photo, the misty blossom hallway and a dove. All original, all seeded so
 * the same palette always draws the same picture. Pure; the components turn these into CSS backgrounds.
 */

const svg = (w: number, h: number, body: string, p: SakuraPalette) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMin meet">${defs(p)}${body}</svg>`;

interface Twig {
  p0: Pt;
  p1: Pt;
  p2: Pt;
  p3: Pt;
  w: number;
}

/** Draws a bark stroke and scatters blossoms, buds and leaves along it (denser toward the tip). */
function drawTwig(t: Twig, rand: () => number, p: SakuraPalette, density: number, rMin: number, rMax: number): { under: string; over: string } {
  const d = `M${n1(t.p0.x)} ${n1(t.p0.y)}C${n1(t.p1.x)} ${n1(t.p1.y)} ${n1(t.p2.x)} ${n1(t.p2.y)} ${n1(t.p3.x)} ${n1(t.p3.y)}`;
  let under = `<path d="${d}" fill="none" stroke="${p.bark}" stroke-width="${n1(t.w)}" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${p.barkLight}" stroke-width="${n1(t.w * 0.28)}" stroke-linecap="round" opacity=".6" transform="translate(-.6 -.6)"/>`;
  let over = "";
  const count = Math.max(2, Math.round(density));
  for (let i = 0; i < count; i++) {
    const tt = 0.25 + (i / count) * 0.75 + (rand() - 0.5) * 0.08;
    const c = bezier(t.p0, t.p1, t.p2, t.p3, Math.min(1, tt));
    const r = rMin + rand() * (rMax - rMin);
    if (rand() < 0.22) under += leaf(c.x, c.y, r * 1.6, rand() * 360);
    over += blossom(c.x + (rand() - 0.5) * 8, c.y + (rand() - 0.5) * 8, r, rand() * 72, rand() < 0.35, p);
    if (rand() < 0.3) over += bud(c.x + 6, c.y + 4, r * 0.34, 30 + rand() * 60, p);
  }
  // a cluster right at the tip
  over += blossom(t.p3.x, t.p3.y, rMax * 1.05, rand() * 72, false, p) + blossom(t.p3.x + 7, t.p3.y + 9, rMin, rand() * 72, true, p);
  return { under, over };
}

function branchGroup(seed: number, p: SakuraPalette, scale: number): string {
  const rand = rng(seed);
  const twigs: Twig[] = [
    { p0: { x: -14, y: 4 }, p1: { x: 60, y: 22 }, p2: { x: 130, y: 12 }, p3: { x: 214, y: 40 }, w: 5.4 },
    { p0: { x: 52, y: 14 }, p1: { x: 62, y: 44 }, p2: { x: 54, y: 74 }, p3: { x: 66, y: 112 }, w: 2.6 },
    { p0: { x: 118, y: 14 }, p1: { x: 132, y: 40 }, p2: { x: 130, y: 70 }, p3: { x: 142, y: 98 }, w: 2.4 },
    { p0: { x: 176, y: 30 }, p1: { x: 190, y: 52 }, p2: { x: 184, y: 76 }, p3: { x: 198, y: 94 }, w: 2.2 },
    { p0: { x: 14, y: 8 }, p1: { x: 20, y: 36 }, p2: { x: 8, y: 66 }, p3: { x: 18, y: 134 }, w: 2.4 },
  ];
  let under = "";
  let over = "";
  twigs.forEach((t, i) => {
    const out = drawTwig(t, rand, p, i === 0 ? 7 : 4, 8, 15);
    under += out.under;
    over += out.over;
  });
  return `<g transform="scale(${scale})">${under}${over}</g>`;
}

/** Two hanging blossom branches framing the top corners; the centre stays clear for text. */
export function branchesSvg(p: SakuraPalette): string {
  const body =
    branchGroup(11, p, 1) +
    `<g transform="translate(600 0) scale(-1 1)">${branchGroup(29, p, 0.86)}</g>` +
    sparkle(262, 30, 7, p) +
    sparkle(340, 22, 5, p) +
    sparkle(300, 48, 4, p);
  return svg(600, 150, body, p);
}

function bedSide(seed: number, p: SakuraPalette): string {
  const rand = rng(seed);
  let back = `<ellipse cx="84" cy="156" rx="104" ry="26" fill="url(#lf)"/>`;
  let mid = "";
  let front = "";
  for (let i = 0; i < 12; i++) back += leaf(4 + i * 15 + rand() * 8, 154, 18 + rand() * 18, -40 + rand() * 80);
  for (let i = 0; i < 8; i++) {
    const x = 6 + i * 13 + rand() * 6;
    back += lavender(x, 152, 70 + (1 - i / 8) * 56 + rand() * 12, -8 + rand() * 18, p);
  }
  for (const [x, y, r] of [[24, 122, 26], [70, 128, 30], [124, 136, 25], [170, 143, 18]] as const) mid += hydrangea(x, y, r, rand, p);
  for (const [x, y, r] of [[44, 140, 19], [98, 146, 16], [146, 148, 13]] as const) front += rose(x, y, r, p);
  for (let i = 0; i < 10; i++) front += blossom(12 + i * 18 + rand() * 6, 140 + rand() * 9, 7 + rand() * 6, rand() * 72, rand() < 0.5, p);
  return back + mid + front;
}

/** A flower bed along the bottom: lavender, hydrangea and roses heavy at both edges, low in the middle. */
export function bedSvg(p: SakuraPalette): string {
  const rand = rng(77);
  let centre = "";
  for (let i = 0; i < 11; i++) centre += blossom(230 + rand() * 140, 140 + rand() * 8, 4 + rand() * 4, rand() * 72, rand() < 0.6, p);
  const body =
    `<g>${bedSide(5, p)}</g>` +
    `<g transform="translate(600 0) scale(-1 1)">${bedSide(41, p)}</g>` +
    centre;
  return svg(600, 150, body, p).replace('preserveAspectRatio="xMidYMin meet"', 'preserveAspectRatio="xMidYMax meet"');
}

/** Garland of blossoms and leaves along the arch around the hero portrait. 360 x 470. */
export function archGarlandSvg(p: SakuraPalette): string {
  const rand = rng(303);
  const pts = archPoints(180, 452, 140, 190, 46);
  let leaves = "";
  let flowers = "";
  pts.forEach((pt, i) => {
    const outward = pt.x < 180 ? -1 : 1;
    const lift = pt.y < 190 ? (pt.x - 180) / 140 : outward;
    leaves += leaf(pt.x + outward * 4, pt.y + 2, 14 + rand() * 9, (pt.y < 190 ? Math.atan2(pt.x - 180, 190 - pt.y) * 57.3 : outward * 70) + (rand() - 0.5) * 50);
    if (i % 2 === 0 || rand() < 0.4) {
      const r = (pt.y < 150 ? 12 : 9) + rand() * 7;
      flowers += blossom(pt.x + (rand() - 0.5) * 14 + lift * 4, pt.y + (rand() - 0.5) * 12, r, rand() * 72, rand() < 0.35, p);
    }
    if (rand() < 0.2) flowers += bud(pt.x + 8, pt.y + 6, 4, rand() * 360, p);
  });
  // heavier crown at the apex and low florals at the feet
  flowers += blossom(180, 42, 21, 5, false, p) + blossom(152, 52, 15, 20, true, p) + blossom(208, 52, 15, -12, false, p);
  flowers += rose(34, 440, 14, p) + rose(326, 440, 14, p) + hydrangea(52, 446, 18, rand, p) + hydrangea(308, 446, 18, rand, p);
  for (let i = 0; i < 4; i++) flowers += lavender(14 + i * 9, 462, 56 + i * 6, -6, p) + lavender(346 - i * 9, 462, 56 + i * 6, 6, p);
  flowers += sparkle(180, 14, 8, p) + sparkle(60, 84, 5, p) + sparkle(300, 84, 5, p);
  return svg(360, 470, leaves + flowers, p);
}

/**
 * The misty blossom hallway seen after the light burst: nested arches receding to a bright
 * vanishing point, pink pillars, blossom garlands on every arch, a petal-strewn floor. 400 x 800.
 */
export function hallwaySvg(p: SakuraPalette): string {
  const rand = rng(909);
  const cx = 200;
  const vy = 360;
  let body =
    `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="${p.petalPale}"/><stop offset="1" stop-color="${p.lavender}"/></linearGradient>` +
    `<radialGradient id="gl" cx=".5" cy="${n1(vy / 800)}" r=".5"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".7"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="pl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${p.petalMid}"/><stop offset="1" stop-color="${p.petalPale}"/></linearGradient>` +
    `<linearGradient id="fr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset=".35" stop-color="#ffffff" stop-opacity=".7"/><stop offset="1" stop-color="${p.lavender}" stop-opacity=".55"/></linearGradient></defs>` +
    `<rect width="400" height="800" fill="url(#bg)"/>` +
    `<rect y="${vy}" width="400" height="${800 - vy}" fill="url(#fr)"/>`;
  const levels = 6;
  for (let i = levels - 1; i >= 0; i--) {
    const s = 1 - i * 0.15;
    const half = 190 * s;
    const baseY = vy + 320 * s;
    const shoulder = baseY - 420 * s;
    const op = n1(0.25 + (1 - i / levels) * 0.5);
    // pillar bands
    body += `<rect x="${n1(cx - half - 16 * s)}" y="${n1(shoulder)}" width="${n1(16 * s)}" height="${n1(baseY - shoulder)}" fill="url(#pl)" opacity="${n1(Number(op) * 0.55)}"/>`;
    body += `<rect x="${n1(cx + half)}" y="${n1(shoulder)}" width="${n1(16 * s)}" height="${n1(baseY - shoulder)}" fill="url(#pl)" opacity="${n1(Number(op) * 0.55)}"/>`;
    body += `<path d="M${n1(cx - half)} ${n1(baseY)}V${n1(shoulder)}A${n1(half)} ${n1(half)} 0 0 1 ${n1(cx + half)} ${n1(shoulder)}V${n1(baseY)}" fill="none" stroke="url(#fl)" stroke-width="${n1(2.4 * s)}" opacity="${op}"/>`;
    const pts = archPoints(cx, baseY, half, shoulder, 22 + Math.round(10 * s));
    pts.forEach((pt, k) => {
      if (k % 2 === 0) body += leaf(pt.x, pt.y, 24 * s, (pt.x < cx ? -1 : 1) * (40 + rand() * 40));
    });
    pts.forEach((pt, k) => {
      if (k % 2 === 1 || rand() < 0.3) body += blossom(pt.x + (rand() - 0.5) * 10 * s, pt.y + (rand() - 0.5) * 10 * s, (9 + rand() * 7) * s, rand() * 72, rand() < 0.4, p);
    });
  }
  body += `<rect width="400" height="800" fill="url(#gl)"/>`;
  // petals on the floor
  for (let i = 0; i < 26; i++) {
    const y = 560 + rand() * 230;
    const k = (y - 540) / 260;
    body += blossom(20 + rand() * 360, y, 5 + k * 9, rand() * 72, rand() < 0.5, p);
  }
  for (let i = 0; i < 9; i++) body += sparkle(30 + rand() * 340, 60 + rand() * 480, 3 + rand() * 4, p);
  return svg(400, 800, body, p).replace('preserveAspectRatio="xMidYMin meet"', 'preserveAspectRatio="xMidYMid slice"');
}

/** A small white dove in flight, 120 x 60. */
export function doveSvg(p: SakuraPalette): string {
  const body =
    `<defs><linearGradient id="dv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${p.lavender}"/></linearGradient></defs>` +
    `<g fill="url(#dv)" stroke="${p.lavenderDeep}" stroke-width=".8" stroke-linejoin="round">` +
    `<path d="M8 38C26 30 46 34 62 28C74 23 90 24 100 32C94 33 90 35 85 37C89 43 86 50 76 53C58 58 34 54 8 38Z"/>` +
    `<path d="M48 32C52 8 76 -2 100 4C86 10 78 20 70 34Z"/>` +
    `<path d="M40 38C28 28 18 22 6 24C16 28 24 34 28 42Z" opacity=".9"/>` +
    `</g><circle cx="96" cy="32" r="1.4" fill="${p.purple}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 62" preserveAspectRatio="xMidYMid meet">${body}</svg>`;
}

export const artUri = (svgString: string): string => svgDataUri(svgString);
