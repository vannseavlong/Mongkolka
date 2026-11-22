/**
 * All emerald CSS in one place (injected once with React 19 `<style href precedence>`). Transform and
 * opacity only, so it stays cheap on low-end phones; every animation is off under reduced motion.
 */
export const EMERALD_CSS = `
.em-stage{position:relative;min-height:100svh;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(8px,1.8svh,20px);padding:clamp(26px,5svh,56px) 20px clamp(24px,4svh,44px);text-align:center}
.em-gate{position:relative;width:min(88vw,calc(min(52svh,520px)*0.625));aspect-ratio:400/640;filter:drop-shadow(0 22px 34px rgba(0,0,0,.55))}
.em-clip{position:absolute;inset:0;perspective:1500px}
.em-scene{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 46%,var(--em-glow),var(--em-deep) 72%);overflow:hidden}
.em-reveal{opacity:0;transform:scale(.55) rotate(-40deg);transition:opacity 1.1s ease .5s,transform 1.9s cubic-bezier(.2,.8,.2,1) .4s}
.is-open .em-reveal{opacity:1;transform:scale(1) rotate(0)}
.em-door{position:absolute;top:0;bottom:0;width:50%;transition:transform 1.7s cubic-bezier(.62,0,.22,1);backface-visibility:hidden;will-change:transform}
.em-door-l{left:0;transform-origin:0 50%}
.em-door-r{right:0;transform-origin:100% 50%}
.em-door-r svg{transform:scaleX(-1)}
.is-open .em-door-l{transform:rotateY(86deg)}
.is-open .em-door-r{transform:rotateY(-86deg)}
.em-seal{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);transition:opacity .45s ease,transform .6s ease;z-index:2}
.is-open .em-seal{opacity:0;transform:translate(-50%,-50%) scale(.5)}
.em-fit{width:var(--w,70%)}.em-fit svg{width:100%;height:auto}
.em-spin{animation:em-turn 70s linear infinite}
.em-spin-rev{animation:em-turn 95s linear infinite reverse}
.em-mote{position:absolute;bottom:-8px;border-radius:50%;background:radial-gradient(circle,var(--em-hi),var(--em-mid) 60%,transparent 72%);opacity:0;animation:em-rise var(--d) ease-in var(--t) infinite;pointer-events:none}
.em-spark{position:absolute;left:50%;top:50%;border-radius:50%;background:var(--em-hi);box-shadow:0 0 6px var(--em-mid);opacity:0;pointer-events:none}
.is-open .em-spark{animation:em-burst 1.5s ease-out var(--t) forwards}
.em-cta{cursor:pointer;border:0;border-radius:999px;padding:.85rem 1.7rem;font-size:1rem;line-height:1.6;color:var(--em-deep);background:linear-gradient(135deg,var(--em-hi),var(--em-mid) 50%,var(--em-lo));box-shadow:0 8px 24px -6px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.55),0 0 0 1px var(--em-lo);transition:transform .2s ease,box-shadow .2s ease}
.em-cta:hover{transform:translateY(-1px)}
.em-cta:focus-visible{outline:2px solid var(--em-hi);outline-offset:4px}
.em-fadeout{transition:opacity .6s ease,transform .6s ease}
.is-open .em-fadeout{opacity:0;transform:translateY(8px)}
.em-pulse{animation:em-pulse 2.8s ease-in-out infinite}
.em-hero-in{animation:em-in .9s cubic-bezier(.2,.7,.2,1) both}
@keyframes em-turn{to{transform:rotate(360deg)}}
@keyframes em-rise{0%{opacity:0;transform:translate3d(0,0,0)}12%{opacity:.9}100%{opacity:0;transform:translate3d(var(--x),-95svh,0)}}
@keyframes em-burst{0%{opacity:0;transform:translate(-50%,-50%) scale(.4)}20%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(1)}}
@keyframes em-pulse{0%,100%{box-shadow:0 8px 24px -6px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.55),0 0 0 1px var(--em-lo),0 0 0 0 var(--em-ring)}50%{box-shadow:0 8px 24px -6px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.55),0 0 0 1px var(--em-lo),0 0 0 9px transparent}}
@keyframes em-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
.em-door,.em-seal,.em-reveal,.em-fadeout,.em-cta{transition:none}
.em-spin,.em-spin-rev,.em-mote,.em-pulse,.em-hero-in{animation:none}
.em-mote,.em-spark{display:none}
.is-open .em-door-l,.is-open .em-door-r{transform:none}
}
`;
