import type { SakuraPalette } from "../palette";
import { n1 } from "./geometry";

/**
 * SVG string builders for the Sakura artwork. Every shape is drawn from scratch with simple paths;
 * nothing is traced from any reference. Blossoms reuse one petal through `<use>` so a branch stays
 * a few kilobytes (it is inlined as a CSS background on every card).
 */

/** One notched cherry petal pointing up from the origin, unit size 1. Scaled by the blossom's <use>. */
export const PETAL_PATH = "M0 0C-.62 -.3 -.58 -.98 -.13 -1L0 -.86L.13 -1C.58 -.98 .62 -.3 0 0Z";

/** Shared <defs>: petal shape, gradients for blossoms, leaves, roses. Ids are local to each SVG document. */
export function defs(p: SakuraPalette): string {
  return (
    `<defs>` +
    `<path id="pt" d="${PETAL_PATH}"/>` +
    `<g id="bl">${blossomBody("url(#pg)", p)}</g><g id="bw">${blossomBody("url(#pw)", p)}</g>` +
    `<radialGradient id="pg" cx=".5" cy=".92" r=".95"><stop offset="0" stop-color="${p.petalDeep}"/><stop offset=".42" stop-color="${p.petalMid}"/><stop offset="1" stop-color="${p.petalPale}"/></radialGradient>` +
    `<radialGradient id="pw" cx=".5" cy=".92" r=".95"><stop offset="0" stop-color="${p.petalMid}"/><stop offset=".5" stop-color="${p.petalPale}"/><stop offset="1" stop-color="#ffffff"/></radialGradient>` +
    `<radialGradient id="rg" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="${p.petalMid}"/><stop offset=".6" stop-color="${p.accent}"/><stop offset="1" stop-color="${p.petalDeep === p.accent ? p.accent : p.purple}"/></radialGradient>` +
    `<linearGradient id="lf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.leaf}"/><stop offset="1" stop-color="${p.leafDeep}"/></linearGradient>` +
    `<g id="lv0" fill="${p.purple}"><ellipse cx="-2.5" rx="2.5" ry="3.6"/><ellipse cx="2.5" cy="-1.4" rx="2.5" ry="3.6"/></g>` +
    `<g id="lv1" fill="${p.lavenderDeep}"><ellipse cx="-2.5" rx="2.5" ry="3.6"/><ellipse cx="2.5" cy="-1.4" rx="2.5" ry="3.6"/></g>` +
    `<g id="lv2" fill="${p.lavender}"><ellipse cx="-2.5" rx="2.5" ry="3.6"/><ellipse cx="2.5" cy="-1.4" rx="2.5" ry="3.6"/></g>` +
    `<linearGradient id="fl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.foilHi}"/><stop offset=".5" stop-color="${p.foilMid}"/><stop offset="1" stop-color="${p.foilLo}"/></linearGradient>` +
    `</defs>`
  );
}

function blossomBody(fill: string, p: SakuraPalette): string {
  let petals = "";
  for (let i = 0; i < 5; i++) petals += `<use href="#pt" transform="rotate(${i * 72})"/>`;
  let stamens = "";
  for (let i = 0; i < 7; i++) stamens += `M0 0L${n1(Math.sin((i / 7) * 6.283) * 0.36)} ${n1(-Math.cos((i / 7) * 6.283) * 0.36)}`;
  return (
    `<g fill="${fill}" stroke="${p.petalDeep}" stroke-width=".035" stroke-opacity=".55">${petals}` +
    `<circle r=".15" fill="${p.petalDeep}" stroke="none"/><path d="${stamens}" fill="none" stroke="${p.foilMid}" stroke-width=".05"/></g>`
  );
}

/** Five-petal cherry blossom with gold stamens, drawn once in <defs> and placed with <use>. `pale` picks the white-pink variety. */
export function blossom(x: number, y: number, r: number, rot: number, pale: boolean, _p?: SakuraPalette): string {
  void _p;
  return `<use href="#${pale ? "bw" : "bl"}" transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(rot)}) scale(${n1(r)})"/>`;
}

/** A closed bud on a short stem end. */
export function bud(x: number, y: number, r: number, rot: number, p: SakuraPalette): string {
  return (
    `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(rot)})">` +
    `<ellipse cx="0" cy="${n1(-r * 0.7)}" rx="${n1(r * 0.55)}" ry="${n1(r)}" fill="${p.petalMid}"/>` +
    `<path d="M0 ${n1(-r * 1.7)}C${n1(r * 0.6)} ${n1(-r * 1.1)} ${n1(r * 0.4)} ${n1(-r * 0.2)} 0 0C${n1(-r * 0.4)} ${n1(-r * 0.2)} ${n1(-r * 0.6)} ${n1(-r * 1.1)} 0 ${n1(-r * 1.7)}Z" fill="${p.petalDeep}" opacity=".75"/>` +
    `</g>`
  );
}

export function leaf(x: number, y: number, len: number, rot: number): string {
  const w = len * 0.36;
  return `<path d="M0 0C${n1(w)} ${n1(-len * 0.35)} ${n1(w)} ${n1(-len * 0.8)} 0 ${n1(-len)}C${n1(-w)} ${n1(-len * 0.8)} ${n1(-w)} ${n1(-len * 0.35)} 0 0Z" transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(rot)})" fill="url(#lf)" opacity=".92"/>`;
}

/** A full round rose: layered discs and spiral arcs. */
export function rose(x: number, y: number, r: number, p: SakuraPalette): string {
  return (
    `<g transform="translate(${n1(x)} ${n1(y)})">` +
    `<circle r="${n1(r)}" fill="url(#rg)"/>` +
    `<circle r="${n1(r * 0.7)}" fill="${p.accent}" opacity=".55"/>` +
    `<path d="M${n1(-r * 0.62)} ${n1(-r * 0.1)}C${n1(-r * 0.5)} ${n1(-r * 0.7)} ${n1(r * 0.5)} ${n1(-r * 0.7)} ${n1(r * 0.6)} ${n1(-r * 0.05)}M${n1(-r * 0.4)} ${n1(r * 0.05)}C${n1(-r * 0.3)} ${n1(-r * 0.4)} ${n1(r * 0.3)} ${n1(-r * 0.4)} ${n1(r * 0.38)} ${n1(r * 0.02)}M${n1(-r * 0.2)} ${n1(r * 0.1)}C${n1(-r * 0.12)} ${n1(-r * 0.15)} ${n1(r * 0.14)} ${n1(-r * 0.15)} ${n1(r * 0.18)} ${n1(r * 0.08)}" fill="none" stroke="${p.petalPale}" stroke-width="${n1(Math.max(0.5, r * 0.07))}" stroke-linecap="round" opacity=".8"/>` +
    `</g>`
  );
}

/** Lavender spike: a stem with paired florets climbing its upper half. */
export function lavender(x: number, baseY: number, h: number, lean: number, p: SakuraPalette): string {
  const topX = x + lean;
  let out = `<path d="M${n1(x)} ${n1(baseY)}Q${n1(x + lean * 0.2)} ${n1(baseY - h * 0.5)} ${n1(topX)} ${n1(baseY - h)}" fill="none" stroke="${p.leafDeep}" stroke-width="1.4" stroke-linecap="round"/>`;
  const rows = Math.max(5, Math.round(h / 9));
  for (let i = 0; i < rows; i++) {
    const t = 0.42 + (i / rows) * 0.58;
    const s = 1 - (i / rows) * 0.42;
    out += `<use href="#lv${i % 3}" transform="translate(${n1(x + lean * t * t)} ${n1(baseY - h * t)}) scale(${n1(s)})"/>`;
  }
  return out;
}

/** A hydrangea-like ball of tiny florets (round blobs keep it light). */
export function hydrangea(x: number, y: number, r: number, rand: () => number, p: SakuraPalette): string {
  let out = "";
  const tones = [p.lavender, p.lavenderDeep, p.petalMid, p.lavender, "#e9defa", p.petalLight];
  const count = Math.round(10 + r * 0.6);
  for (let i = 0; i < count; i++) {
    const a = rand() * 6.283;
    const d = Math.sqrt(rand()) * r;
    const c = tones[Math.floor(rand() * tones.length)]!;
    out += `<circle cx="${n1(x + Math.cos(a) * d)}" cy="${n1(y + Math.sin(a) * d * 0.72)}" r="${n1(r * 0.15)}" fill="${c}"/>`;
  }
  return `<g stroke="#ffffff" stroke-width=".5" stroke-opacity=".6">${out}</g>`;
}

/** Small butterfly-free flourish: gold sparkle (four-point star). */
export function sparkle(x: number, y: number, r: number, p: SakuraPalette): string {
  return `<path d="M${n1(x)} ${n1(y - r)}Q${n1(x + r * 0.12)} ${n1(y - r * 0.12)} ${n1(x + r)} ${n1(y)}Q${n1(x + r * 0.12)} ${n1(y + r * 0.12)} ${n1(x)} ${n1(y + r)}Q${n1(x - r * 0.12)} ${n1(y + r * 0.12)} ${n1(x - r)} ${n1(y)}Q${n1(x - r * 0.12)} ${n1(y - r * 0.12)} ${n1(x)} ${n1(y - r)}Z" fill="${p.foilMid}" opacity=".9"/>`;
}
