import { sakuraPalette } from "../palette";
import { bedVar, branchesVar } from "../sakura-style";
import { svgDataUri } from "./geometry";
import { archGarlandSvg, bedSvg, branchesSvg, doveSvg, hallwaySvg } from "./scenes";

/**
 * The art as CSS. The two scenes every card uses (hanging branches, flower bed) are defined once
 * per accent as custom properties on :root, so a page with eight cards carries them once. The hero
 * garland, hallway and dove are used by one component each and are built on demand.
 */
const cache = new Map<string, string>();
const paletteFor = (accent: string) => sakuraPalette({ accent_color: accent, bg_color: "#f7d6e0" });
const url = (svg: string) => `url("${svgDataUri(svg)}")`;

export function artVarsCss(accent: string): string {
  const hit = cache.get(accent);
  if (hit) return hit;
  const p = paletteFor(accent);
  const css = `:root{${branchesVar(accent)}:${url(branchesSvg(p))};${bedVar(accent)}:${url(bedSvg(p))}}`;
  cache.set(accent, css);
  return css;
}

const single = new Map<string, string>();
function once(key: string, make: () => string): string {
  const hit = single.get(key);
  if (hit) return hit;
  const v = url(make());
  single.set(key, v);
  return v;
}

export const garlandUrl = (accent: string): string => once(`g${accent}`, () => archGarlandSvg(paletteFor(accent)));
export const hallwayUrl = (accent: string): string => once(`h${accent}`, () => hallwaySvg(paletteFor(accent)));
export const doveUrl = (accent: string): string => once(`d${accent}`, () => doveSvg(paletteFor(accent)));

/** Layout + motion CSS shared by the opening and the hero. Class prefix `sk-`; transform/opacity only. */
export const SAKURA_CSS = `
.sk-layer{position:absolute;left:50%;width:min(100%,720px);transform:translateX(-50%);pointer-events:none;background-repeat:no-repeat;background-size:100% auto}
.sk-top{top:0;aspect-ratio:600/150;background-position:top center;transform-origin:50% 0}
.sk-bottom{bottom:0;aspect-ratio:600/150;background-position:bottom center}
.sk-sway{animation:sk-sway 9s ease-in-out infinite;will-change:transform}
@keyframes sk-sway{0%,100%{transform:translateX(-50%) rotate(-.5deg)}50%{transform:translateX(-50%) rotate(.6deg)}}
.sk-twinkle{position:absolute;width:6px;height:6px;pointer-events:none;background:radial-gradient(circle,#fff6d6 0 28%,rgba(243,229,171,.0) 70%);border-radius:50%;animation:sk-twinkle 3.4s ease-in-out infinite}
@keyframes sk-twinkle{0%,100%{opacity:.15;transform:scale(.6)}50%{opacity:1;transform:scale(1.5)}}
.sk-dove{position:absolute;width:84px;aspect-ratio:120/62;background-size:contain;background-repeat:no-repeat;pointer-events:none;opacity:0;animation:sk-dove 15s linear infinite}
@keyframes sk-dove{0%{opacity:0;transform:translate3d(-12vw,30px,0) rotate(-6deg)}8%{opacity:.95}50%{transform:translate3d(55vw,-20px,0) rotate(3deg)}92%{opacity:.95}100%{opacity:0;transform:translate3d(115vw,-60px,0) rotate(-4deg)}}
.sk-pulse{animation:sk-pulse 2.8s ease-in-out infinite;will-change:transform}
@keyframes sk-pulse{0%,100%{transform:scale(1);filter:drop-shadow(0 0 6px rgba(243,229,171,.55))}50%{transform:scale(1.045);filter:drop-shadow(0 0 20px rgba(255,236,170,.95))}}
.sk-rise{animation:sk-rise 1s cubic-bezier(.2,.7,.2,1) both}
@keyframes sk-rise{from{opacity:0;transform:translate3d(0,14px,0)}to{opacity:1;transform:none}}
.sk-gate{position:relative;min-height:100svh;overflow:hidden;isolation:isolate}
.sk-content{position:relative;z-index:3;transition:opacity .6s ease,transform .8s ease}
.sk-burst,.sk-glow,.sk-flash,.sk-hall,.sk-veil{position:absolute;inset:0;pointer-events:none;opacity:0}
.sk-burst{z-index:4;left:50%;top:50%;inset:auto;width:160vmax;height:160vmax;margin:-80vmax 0 0 -80vmax;
  background:repeating-conic-gradient(from 0deg,rgba(255,244,205,.95) 0 3deg,rgba(255,244,205,0) 3deg 12deg);
  -webkit-mask-image:radial-gradient(circle,#000 0,rgba(0,0,0,.7) 14%,transparent 46%);mask-image:radial-gradient(circle,#000 0,rgba(0,0,0,.7) 14%,transparent 46%)}
.sk-glow{z-index:4;background:radial-gradient(circle at 50% 46%,#fffdf2 0,rgba(255,238,178,.85) 16%,rgba(255,226,236,0) 55%)}
.sk-flash{z-index:6;background:#fff}
.sk-hall{z-index:2;background-size:cover;background-position:center}
.sk-veil{z-index:5;opacity:1;background:radial-gradient(120% 80% at 50% 110%,rgba(200,182,226,.55),transparent 60%),radial-gradient(90% 60% at 50% 0%,rgba(255,255,255,.7),transparent 70%)}
.sk-layer,.sk-dove,.sk-twinkle{transition:opacity .5s ease}
.sk-gate[data-phase=hallway] .sk-layer,.sk-gate[data-phase=leave] .sk-layer,.sk-gate[data-phase=hallway] .sk-dove,.sk-gate[data-phase=leave] .sk-dove,.sk-gate[data-phase=hallway] .sk-twinkle,.sk-gate[data-phase=leave] .sk-twinkle{opacity:0;animation:none}
.sk-gate[data-phase=burst] .sk-content,.sk-gate[data-phase=hallway] .sk-content,.sk-gate[data-phase=leave] .sk-content{opacity:0;transform:scale(1.07);pointer-events:none}
.sk-gate[data-phase=burst] .sk-burst{animation:sk-burst 1.05s ease-in forwards}
.sk-gate[data-phase=burst] .sk-glow{animation:sk-glow 1.05s ease-in forwards}
.sk-gate[data-phase=burst] .sk-flash{animation:sk-flash-in .5s .55s ease-in forwards}
.sk-gate[data-phase=hallway] .sk-flash,.sk-gate[data-phase=leave] .sk-flash{opacity:1;animation:sk-flash-out .75s ease-out forwards}
.sk-gate[data-phase=hallway] .sk-hall,.sk-gate[data-phase=leave] .sk-hall{animation:sk-hall 1.9s cubic-bezier(.2,.6,.2,1) forwards}
.sk-gate[data-phase=leave]{animation:sk-leave .45s ease-in forwards}
@keyframes sk-burst{0%{opacity:0;transform:scale(.1) rotate(0)}30%{opacity:1}100%{opacity:1;transform:scale(1) rotate(40deg)}}
@keyframes sk-glow{0%{opacity:0;transform:scale(.3)}100%{opacity:1;transform:scale(1.4)}}
@keyframes sk-flash-in{from{opacity:0}to{opacity:1}}
@keyframes sk-flash-out{from{opacity:1}to{opacity:0}}
@keyframes sk-hall{0%{opacity:0;transform:scale(1.35)}35%{opacity:1}100%{opacity:1;transform:scale(1.02)}}
@keyframes sk-leave{from{opacity:1}to{opacity:0}}
.sk-btn{position:relative;overflow:hidden;transition:transform .2s ease,box-shadow .2s ease}
.sk-btn:hover{transform:translateY(-1px)}
.sk-btn:active{transform:scale(.97)}
.sk-btn:focus-visible{outline:2px solid #6a3d9a;outline-offset:4px}
.sk-btn::after{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 38%,rgba(255,255,255,.55) 50%,transparent 62%);transform:translateX(-120%);animation:sk-shine 4.5s ease-in-out infinite}
@keyframes sk-shine{0%,60%{transform:translateX(-120%)}100%{transform:translateX(120%)}}
@media (prefers-reduced-motion:reduce){
  .sk-sway,.sk-pulse,.sk-twinkle,.sk-rise,.sk-btn::after{animation:none}
  .sk-dove{display:none}
  .sk-btn::after{display:none}
  .sk-content{transition:none}
}
`;

export const SAKURA_HERO_CSS = `
.sk-hero-frame{position:relative;width:min(84vw,330px);aspect-ratio:360/470}
.sk-photo{position:absolute;left:11.1%;width:77.8%;top:10.6%;height:85.5%;border-radius:50% 50% 0 0/34.8% 34.8% 0 0;padding:2.5px}
.sk-photo-in{width:100%;height:100%;border-radius:inherit;padding:4px;background:#fffafc}
.sk-photo-img{width:100%;height:100%;border-radius:inherit;object-fit:cover;display:block;background:linear-gradient(180deg,#fdf0f4,#e9defa)}
.sk-garland{position:absolute;inset:0;background-size:100% 100%;background-repeat:no-repeat;pointer-events:none;z-index:2}
`;
