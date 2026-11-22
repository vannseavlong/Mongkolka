import { OPEN_TIMELINE as T } from "./opening-logic";

const cardMs = T.zoom.at + T.zoom.ms - T.rise.at;
const pct = (ms: number) => `${((ms / cardMs) * 100).toFixed(2)}%`;
const riseEnd = pct(T.rise.ms);
const zoomStart = pct(T.zoom.at - T.rise.at);

/**
 * CSS for the Royal Cream skin (class prefix `cr-`). Only transform and opacity are animated, flowers
 * are static SVG (the filter is rasterised once), and reduced motion turns every loop and entrance off.
 * The opening timings come from opening-logic.ts so the CSS and the `onOpen` timer cannot drift apart.
 */
export const CREAM_CSS = `
.cr-gate{position:relative;min-height:100svh;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;isolation:isolate}
.cr-gate[data-open="true"]{animation:cr-gate-out ${T.zoom.ms}ms ease-in ${T.zoom.at}ms forwards}
@keyframes cr-gate-out{to{opacity:0}}
.cr-stack{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;width:100%;padding:72px 20px 150px;text-align:center}
.cr-fade{transition:none}
.cr-gate[data-open="true"] .cr-fade{animation:cr-fadeout ${T.fadeOut.ms}ms ease-out ${T.fadeOut.at}ms forwards}
@keyframes cr-fadeout{to{opacity:0}}

.cr-env-wrap{position:relative;width:var(--w);perspective:1100px;margin:22px 0 6px;cursor:pointer}
.cr-env{position:relative;width:100%;aspect-ratio:10/7;font-size:calc(var(--w) / 33)}
.cr-gate:not([data-open="true"]) .cr-env{animation:cr-bob 6s ease-in-out infinite}
@keyframes cr-bob{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-5px,0)}}
.cr-env-back{position:absolute;inset:0;border-radius:.5em;z-index:0;box-shadow:0 1.6em 2.2em -1.1em rgba(110,70,20,.5),inset 0 0 0 1px var(--cr-gold-a)}
.cr-card{position:absolute;left:5%;width:90%;top:3%;height:90%;z-index:2;border-radius:.4em;padding:1.1em .9em .8em;transform:translate3d(0,0,0);box-shadow:0 .4em 1em -.4em rgba(110,70,20,.4);will-change:transform}
.cr-gate[data-open="true"] .cr-card{animation:cr-card ${cardMs}ms cubic-bezier(.3,.7,.2,1) ${T.rise.at}ms forwards}
@keyframes cr-card{
 0%{transform:translate3d(0,0,0) scale(1);z-index:2}
 ${riseEnd}{transform:translate3d(0,-62%,0) scale(1);z-index:2}
 ${zoomStart}{transform:translate3d(0,-62%,0) scale(1);z-index:6}
 100%{transform:translate3d(0,-46%,0) scale(1.32);z-index:6}
}
.cr-pocket{position:absolute;inset:0;width:100%;height:100%;z-index:3;display:block;pointer-events:none}
.cr-addr{position:absolute;z-index:4;left:50%;bottom:7%;width:56%;transform:translateX(-50%);text-align:center;pointer-events:none}
.cr-flap{position:absolute;left:0;top:0;width:100%;height:55%;z-index:4;transform-origin:50% 0;transform-style:preserve-3d;will-change:transform}
.cr-gate[data-open="true"] .cr-flap{animation:cr-flap ${T.flap.ms}ms cubic-bezier(.5,.05,.3,1) ${T.flap.at}ms forwards}
@keyframes cr-flap{0%{transform:rotateX(0deg);z-index:4}49%{z-index:4}50%{z-index:1}100%{transform:rotateX(180deg);z-index:1}}
.cr-flap-face{position:absolute;inset:0;-webkit-backface-visibility:hidden;backface-visibility:hidden}
.cr-flap-back{transform:rotateX(180deg)}
.cr-seal{position:absolute;left:50%;top:100%;z-index:5;transform:translate(-50%,-62%);filter:drop-shadow(0 .25em .35em rgba(90,55,10,.45))}
.cr-gate[data-open="true"] .cr-seal{animation:cr-seal ${T.seal.ms}ms ease-in ${T.seal.at}ms forwards}
@keyframes cr-seal{0%{transform:translate(-50%,-62%) scale(1)}40%{transform:translate(-50%,-72%) scale(1.14)}100%{transform:translate(-50%,-62%) scale(.35);opacity:0}}

.cr-cta{position:relative;margin-top:26px;border:0;cursor:pointer;border-radius:999px;padding:.95em 2.2em;font-size:15px;color:#fff;
 background-image:linear-gradient(135deg,var(--cr-gold-hi) 0%,var(--cr-gold) 48%,var(--cr-gold-lo) 100%);
 box-shadow:0 10px 22px -10px rgba(110,70,20,.65),inset 0 1px 0 rgba(255,255,255,.55),inset 0 -2px 0 rgba(60,35,0,.25);
 text-shadow:0 1px 1px rgba(60,35,0,.45);transition:transform .2s ease,box-shadow .2s ease}
.cr-cta:hover{transform:translateY(-1px)}
.cr-cta:active{transform:scale(.97)}
.cr-cta:focus-visible{outline:2px solid var(--cr-gold-lo);outline-offset:4px}
.cr-gate:not([data-open="true"]) .cr-cta::after{content:"";position:absolute;inset:-5px;border-radius:999px;border:1px solid var(--cr-gold);opacity:.0;animation:cr-ring 2.8s ease-out infinite}
@keyframes cr-ring{0%{opacity:.55;transform:scale(.96)}100%{opacity:0;transform:scale(1.18)}}

.cr-bf{position:absolute;z-index:1;will-change:transform}
.cr-bf-a{left:8%;top:34%;animation:cr-fly-a 15s ease-in-out infinite}
.cr-bf-b{right:7%;top:54%;animation:cr-fly-b 18s ease-in-out infinite}
.cr-bf-c{left:62%;top:14%;animation:cr-fly-c 21s ease-in-out infinite}
@keyframes cr-fly-a{0%,100%{transform:translate3d(0,0,0) rotate(-8deg)}25%{transform:translate3d(26px,-22px,0) rotate(10deg)}50%{transform:translate3d(8px,-46px,0) rotate(-4deg)}75%{transform:translate3d(-14px,-18px,0) rotate(8deg)}}
@keyframes cr-fly-b{0%,100%{transform:translate3d(0,0,0) rotate(8deg)}30%{transform:translate3d(-30px,-26px,0) rotate(-10deg)}60%{transform:translate3d(-10px,-52px,0) rotate(6deg)}}
@keyframes cr-fly-c{0%,100%{transform:translate3d(0,0,0) rotate(6deg)}35%{transform:translate3d(-24px,18px,0) rotate(-8deg)}70%{transform:translate3d(14px,34px,0) rotate(10deg)}}
.cr-wing{animation:cr-wing .55s ease-in-out infinite alternate}
.cr-wing-r{animation-name:cr-wing-r}
@keyframes cr-wing{from{transform:scaleX(1)}to{transform:scaleX(.38)}}
@keyframes cr-wing-r{from{transform:scaleX(1)}to{transform:scaleX(.38)}}

.cr-in{opacity:0;animation:cr-in 900ms cubic-bezier(.2,.7,.2,1) forwards;animation-delay:var(--d,0ms)}
@keyframes cr-in{from{opacity:0;transform:translate3d(0,14px,0)}to{opacity:1;transform:none}}
.cr-bloom{opacity:0;transform-origin:50% 55%;animation:cr-bloom 1500ms cubic-bezier(.2,.7,.2,1) forwards;animation-delay:var(--d,0ms)}
@keyframes cr-bloom{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}
.cr-sway{animation:cr-sway 9s ease-in-out infinite;transform-origin:0 0}
@keyframes cr-sway{0%,100%{transform:rotate(0deg)}50%{transform:rotate(1.6deg)}}
.cr-cue{animation:cr-cue 2.4s ease-in-out infinite}
@keyframes cr-cue{0%,100%{transform:translate3d(0,0,0);opacity:.55}50%{transform:translate3d(0,6px,0);opacity:1}}
.cr-dust{position:absolute;border-radius:50%;background:radial-gradient(circle,var(--cr-gold-hi),transparent 70%);animation:cr-dust 7s ease-in-out infinite}
@keyframes cr-dust{0%,100%{opacity:.15;transform:translate3d(0,0,0)}50%{opacity:.8;transform:translate3d(0,-10px,0)}}

@media (prefers-reduced-motion:reduce){
 .cr-gate:not([data-open="true"]) .cr-env,.cr-bf,.cr-wing,.cr-sway,.cr-cue,.cr-dust{animation:none}
 .cr-cta::after{display:none}
 .cr-in,.cr-bloom{opacity:1;animation:none}
 .cr-cta{transition:none}
}
`;
