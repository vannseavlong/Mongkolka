/**
 * CSS of the Royal Garden opening and hero. Class prefix `gd-`. Only transform and opacity are
 * animated (cheap on low-end phones); durations come from CSS variables set by the component
 * (see opening-logic.ts). Reduced motion removes every animation.
 */
export const GARDEN_CSS = `
.gd-open{position:relative;min-height:100svh;overflow:hidden;isolation:isolate}
.gd-stage{position:absolute;top:0;bottom:0;left:50%;width:min(100%,520px);transform:translateX(-50%);perspective:1500px;perspective-origin:50% 42%;pointer-events:none;z-index:3}
.gd-leaf{position:absolute;top:0;bottom:0;width:50%;will-change:transform;backface-visibility:hidden;filter:drop-shadow(0 6px 10px rgba(80,50,30,.28))}
.gd-leaf-l{left:0;transform-origin:0 50%}
.gd-leaf-r{right:0;transform-origin:100% 50%}
.gd-leaf-r .gd-leaf-in{transform:scaleX(-1)}
.gd-leaf-in{position:absolute;inset:0}
.gd-leaf-in svg[preserveAspectRatio="none"] path{vector-effect:non-scaling-stroke}
.gd-court{position:absolute;inset:0;z-index:1}
.gd-veil{position:absolute;inset:0;z-index:2;opacity:.5}
.gd-plaque{position:absolute;left:50%;top:50%;z-index:4;transform:translate(-50%,-50%);width:min(84vw,330px);max-height:92svh}
.gd-tagline{position:absolute;left:0;right:0;top:19%;z-index:3;text-align:center;padding:0 22px;opacity:0;pointer-events:none}
.gd-dove{position:absolute;z-index:3;opacity:0;pointer-events:none}
.gd-fade{position:absolute;inset:0;z-index:6;opacity:0;pointer-events:none}
.gd-open[data-phase="opening"] .gd-leaf-l{animation:gd-swing-l var(--gd-swing) cubic-bezier(.62,0,.24,1) forwards}
.gd-open[data-phase="opening"] .gd-leaf-r{animation:gd-swing-r var(--gd-swing) cubic-bezier(.62,0,.24,1) forwards}
.gd-open[data-phase="opening"] .gd-plaque{animation:gd-plaque-out .75s ease forwards;pointer-events:none}
.gd-open[data-phase="opening"] .gd-veil{animation:gd-veil-out calc(var(--gd-swing) * .9) .15s ease forwards}
.gd-open[data-phase="opening"] .gd-tagline{animation:gd-tag 1.3s var(--gd-tag) ease forwards}
.gd-open[data-phase="opening"] .gd-dove{animation:gd-fly 2.8s var(--gd-dove) ease-in-out forwards}
.gd-open[data-phase="opening"] .gd-fade{animation:gd-fade-in var(--gd-fade) var(--gd-fade-delay) ease forwards}
@keyframes gd-swing-l{to{transform:rotateY(-106deg)}}
@keyframes gd-swing-r{to{transform:rotateY(106deg)}}
@keyframes gd-plaque-out{to{opacity:0;transform:translate(-50%,-56%) scale(1.07)}}
@keyframes gd-veil-out{to{opacity:0}}
@keyframes gd-tag{from{opacity:0;transform:translate3d(0,10px,0)}to{opacity:1;transform:translate3d(0,0,0)}}
@keyframes gd-fly{0%{opacity:0;transform:translate3d(-22vw,12svh,0) scale(.55)}18%{opacity:1}80%{opacity:1}100%{opacity:0;transform:translate3d(112vw,-26svh,0) scale(1)}}
@keyframes gd-fade-in{to{opacity:1}}
.gd-btn{transition:transform .2s ease,box-shadow .2s ease;cursor:pointer}
.gd-btn:hover{transform:translateY(-1px)}
.gd-btn:active{transform:scale(.97)}
.gd-btn:focus-visible{outline:2px solid currentColor;outline-offset:4px}
.gd-water{stroke-dasharray:90 22;animation:gd-flow 3.4s linear infinite}
@keyframes gd-flow{to{stroke-dashoffset:-224}}
.gd-breeze{animation:gd-breeze 7s ease-in-out infinite;transform-origin:50% 100%;will-change:transform}
@keyframes gd-breeze{0%,100%{transform:rotate(-1.2deg)}50%{transform:rotate(1.4deg)}}
.gd-drift{animation:gd-drift 9s ease-in-out infinite;will-change:transform}
@keyframes gd-drift{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(8px,-6px,0)}}
.gd-rise{animation:gd-rise 1s ease both}
@keyframes gd-rise{from{opacity:0;transform:translate3d(0,14px,0)}to{opacity:1;transform:translate3d(0,0,0)}}
.gd-cue{animation:gd-cue 2.2s ease-in-out infinite}
@keyframes gd-cue{0%,100%{opacity:.45;transform:translate3d(0,0,0)}50%{opacity:1;transform:translate3d(0,6px,0)}}
@media (prefers-reduced-motion:reduce){
  .gd-open[data-phase] .gd-leaf,.gd-open[data-phase] .gd-plaque,.gd-open[data-phase] .gd-veil,.gd-open[data-phase] .gd-tagline,.gd-open[data-phase] .gd-dove,.gd-open[data-phase] .gd-fade{animation:none}
  .gd-water,.gd-breeze,.gd-drift,.gd-rise,.gd-cue,.gd-btn{animation:none;transition:none}
}
`;
