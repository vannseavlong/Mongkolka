/** CSS for the kids skin. Class prefix `kd-`. Only transform and opacity are animated; reduced motion turns every animation off. */
export const KIDS_CSS = `
.kd-bob{animation:kd-bob 3.6s ease-in-out infinite;transform-origin:50% 100%;will-change:transform}
@keyframes kd-bob{0%,100%{transform:translate3d(0,0,0) rotate(0)}50%{transform:translate3d(0,-7px,0) rotate(-1.4deg)}}
.kd-hover{animation:kd-hover 4.2s ease-in-out infinite}
@keyframes kd-hover{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-5px,0)}}
.kd-blink{animation:kd-blink 4.8s infinite;transform-box:fill-box;transform-origin:center}
@keyframes kd-blink{0%,92%,100%{transform:scaleY(1)}95.5%{transform:scaleY(.08)}}
.kd-flame{animation:kd-flame 1.2s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 100%}
@keyframes kd-flame{0%,100%{transform:scale(1,1)}50%{transform:scale(.88,1.12)}}
.kd-flap{animation:kd-flap .5s ease-in-out infinite alternate;transform-box:fill-box;transform-origin:100% 50%}
@keyframes kd-flap{from{transform:scaleX(1)}to{transform:scaleX(.72)}}
.kd-twinkle{animation:kd-twinkle 2.8s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes kd-twinkle{0%,100%{opacity:.3;transform:scale(.7)}50%{opacity:1;transform:scale(1.15)}}
.kd-drift{animation:kd-drift 46s ease-in-out infinite alternate}
@keyframes kd-drift{from{transform:translate3d(-9%,0,0)}to{transform:translate3d(9%,0,0)}}
.kd-pop{animation:kd-pop 2.4s ease-in-out infinite}
@keyframes kd-pop{0%,100%{transform:scale(1);box-shadow:0 10px 0 -2px var(--kd-btn-shade),0 16px 26px -10px var(--kd-btn-glow)}50%{transform:scale(1.045);box-shadow:0 10px 0 -2px var(--kd-btn-shade),0 20px 34px -8px var(--kd-btn-glow)}}
.kd-btn{transition:transform .18s ease}
.kd-btn:active{transform:translateY(4px) scale(.98)}
.kd-btn:focus-visible{outline:3px solid #fff;outline-offset:3px;box-shadow:0 0 0 6px var(--kd-btn-shade)}
.kd-burst{position:absolute;left:50%;top:50%;opacity:0;pointer-events:none;animation:kd-burst .95s cubic-bezier(.2,.8,.3,1) forwards}
@keyframes kd-burst{0%{opacity:0;transform:translate(-50%,-50%) scale(.2) rotate(0)}12%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(1.1) rotate(var(--rot))}}
.kd-flash{position:absolute;inset:0;z-index:40;pointer-events:none;background:radial-gradient(circle at 50% 62%,#fff 0,rgba(255,255,255,.9) 30%,rgba(255,255,255,0) 70%);opacity:0;animation:kd-flash .95s ease-in forwards}
@keyframes kd-flash{0%{opacity:0}45%{opacity:.95}100%{opacity:1}}
.kd-scene-exit{animation:kd-scene-exit .95s ease-in forwards}
@keyframes kd-scene-exit{0%{transform:scale(1);opacity:1}100%{transform:scale(1.12);opacity:0}}
.kd-rise{animation:kd-rise .9s cubic-bezier(.2,.9,.3,1) both}
@keyframes kd-rise{from{opacity:0;transform:translate3d(0,22px,0) scale(.96)}to{opacity:1;transform:none}}
.kd-pulse{animation:kd-pulse 1.8s ease-in-out infinite}
@keyframes kd-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
.kd-ring{animation:kd-ring 7s linear infinite}
@keyframes kd-ring{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){
  .kd-bob,.kd-hover,.kd-blink,.kd-flame,.kd-flap,.kd-twinkle,.kd-drift,.kd-pop,.kd-rise,.kd-pulse,.kd-ring,.kd-scene-exit{animation:none}
  .kd-burst,.kd-flash{display:none}
  .kd-btn{transition:none}
}
`;
