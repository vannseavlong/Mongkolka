/**
 * All CSS for the chrome, in one string emitted once via a hoisted <style href precedence>.
 * Only transform and opacity are animated (GPU-composited, cheap on low-end phones). Every
 * animation has a reduced-motion override at the bottom. Class prefix `mk-`.
 */
export const CHROME_CSS = `
.mk-gold-ring::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:1px;background:var(--mk-gold-grad);pointer-events:none;
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0)}
[data-mk-lang="kh"],[data-mk-lang="kh"] *{letter-spacing:normal!important;text-transform:none!important}

/* ---------- scroll reveal ---------- */
[data-mk-reveal="pending"]{opacity:0;transform:translate3d(0,30px,0);will-change:opacity,transform}
[data-mk-reveal="in"]{opacity:1;transform:none;transition:opacity .95s cubic-bezier(.22,.7,.2,1),transform .95s cubic-bezier(.22,.7,.2,1)}

/* ---------- bottom dock ---------- */
.mk-dock{position:fixed;left:0;right:0;margin-inline:auto;width:max-content;max-width:calc(100vw - 20px);bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:50;
  display:flex;align-items:stretch;gap:2px;padding:6px;border-radius:28px;
  background:linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,0) 55%),var(--mk-glass);
  -webkit-backdrop-filter:blur(18px) saturate(1.6);backdrop-filter:blur(18px) saturate(1.6);
  box-shadow:0 14px 34px -10px rgba(0,0,0,.5),0 2px 8px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.34),inset 0 -1px 0 rgba(0,0,0,.14);
  animation:mk-dock-in .75s cubic-bezier(.22,.7,.2,1) .35s both}
.mk-dock-btn{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;flex:1 1 0;min-width:48px;min-height:50px;padding:6px 5px 5px;
  border:0;border-radius:22px;background:transparent;color:var(--mk-gold);cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .25s ease}
.mk-dock-btn svg{width:23px;height:23px;flex:none;overflow:visible;opacity:.72;transition:opacity .25s ease,transform .3s cubic-bezier(.3,1.4,.5,1);filter:drop-shadow(0 1px 0 rgba(0,0,0,.25))}
.mk-dock-btn span{max-width:100%;overflow:hidden;text-overflow:ellipsis;font-size:10px;line-height:1.15;font-weight:500;letter-spacing:.05em;white-space:nowrap;color:var(--mk-gold);opacity:.78;transition:opacity .25s ease}
.mk-dock-btn[aria-current="true"]::before{content:"";position:absolute;inset:0;border-radius:inherit;
  background:radial-gradient(120% 90% at 50% 18%,var(--mk-glow),transparent 72%);box-shadow:inset 0 0 0 1px var(--mk-glow)}
.mk-dock-btn[aria-current="true"] svg{opacity:1;transform:translateY(-1px) scale(1.08)}
.mk-dock-btn[aria-current="true"] span{opacity:1;font-weight:600}
.mk-dock-btn:active{transform:scale(.94)}
@media (max-width:400px){.mk-dock-btn{min-width:0;padding:6px 2px 5px}.mk-dock-btn span{font-size:9px;letter-spacing:0}}
.mk-dock-btn:focus-visible,.mk-music:focus-visible{outline:2px solid var(--mk-gold-hi);outline-offset:2px}
@media (hover:hover){.mk-dock-btn:hover svg{opacity:1}.mk-dock-btn:hover span{opacity:1}}
@keyframes mk-dock-in{from{opacity:0;transform:translate3d(0,26px,0)}to{opacity:1;transform:none}}

/* ---------- music toggle ---------- */
.mk-music{position:fixed;top:var(--mk-music-top,64px);z-index:50;width:46px;height:46px;padding:0;border:0;border-radius:50%;color:var(--mk-gold);cursor:pointer;-webkit-tap-highlight-color:transparent;
  background:radial-gradient(circle at 32% 26%,rgba(255,255,255,.22),rgba(255,255,255,0) 60%),var(--mk-glass);
  -webkit-backdrop-filter:blur(14px) saturate(1.5);backdrop-filter:blur(14px) saturate(1.5);
  box-shadow:0 8px 20px -6px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.34),inset 0 -1px 0 rgba(0,0,0,.16);
  display:grid;place-items:center;transition:box-shadow .4s ease,transform .2s ease;animation:mk-pop .6s cubic-bezier(.3,1.4,.5,1) .5s both}
.mk-music[data-corner="top-right"]{right:max(14px,env(safe-area-inset-right,0px))}
.mk-music[data-corner="top-left"]{left:max(14px,env(safe-area-inset-left,0px))}
.mk-music:active{transform:scale(.93)}
.mk-music[data-state="playing"]{box-shadow:0 8px 20px -6px rgba(0,0,0,.5),0 0 0 4px var(--mk-glow),0 0 22px var(--mk-glow),inset 0 1px 0 rgba(255,255,255,.34)}
.mk-music svg{width:30px;height:30px;overflow:visible}
.mk-disc{transform-origin:50% 50%;animation:mk-spin 5.5s linear infinite;animation-play-state:paused}
.mk-music[data-state="playing"] .mk-disc{animation-play-state:running}
.mk-eq rect{transform-box:fill-box;transform-origin:50% 100%;animation:mk-eq 1s ease-in-out infinite alternate;animation-play-state:paused}
.mk-eq rect:nth-child(2){animation-duration:.8s;animation-delay:-.3s}
.mk-eq rect:nth-child(3){animation-duration:1.15s;animation-delay:-.6s}
.mk-eq rect:nth-child(4){animation-duration:.9s;animation-delay:-.15s}
.mk-music[data-state="playing"] .mk-eq rect{animation-play-state:running}
.mk-music:not([data-state="playing"]) .mk-eq rect{transform:scaleY(.3)}
.mk-slash{opacity:0;transition:opacity .25s ease}
.mk-music:not([data-state="playing"]) .mk-slash{opacity:1}
.mk-music[data-hint="true"]::after{content:"";position:absolute;inset:-1px;border-radius:50%;border:1.5px solid var(--mk-gold-hi);animation:mk-ping 2.2s ease-out infinite;pointer-events:none}
@keyframes mk-spin{to{transform:rotate(360deg)}}
@keyframes mk-eq{from{transform:scaleY(.25)}to{transform:scaleY(1)}}
@keyframes mk-ping{0%{transform:scale(1);opacity:.85}100%{transform:scale(1.7);opacity:0}}
@keyframes mk-pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}

/* ---------- particles ---------- */
.mk-particles{position:fixed;inset:0;z-index:40;overflow:hidden;pointer-events:none;contain:layout paint}
.mk-particles[data-paused="true"] *{animation-play-state:paused!important}
.mk-p{position:absolute;top:0;left:var(--x);width:var(--s);height:var(--s);opacity:0;will-change:transform,opacity;color:var(--c)}
.mk-p>*{display:block;width:100%;height:100%}
.mk-petal{animation:mk-fall var(--d) linear var(--delay) infinite}
.mk-petal>*{animation:mk-sway 3.8s ease-in-out infinite alternate}
.mk-dust{animation:mk-rise var(--d) linear var(--delay) infinite}
.mk-dust>*{border-radius:50%;background:radial-gradient(circle,currentColor 0,currentColor 38%,transparent 72%);box-shadow:0 0 6px currentColor;animation:mk-twinkle 2.4s ease-in-out infinite alternate}
.mk-bokeh{top:var(--y);animation:mk-bokeh var(--d) ease-in-out var(--delay) infinite}
.mk-bokeh>*{border-radius:50%;background:radial-gradient(circle at 34% 30%,currentColor 0,currentColor 30%,transparent 68%);box-shadow:inset 0 0 0 1px currentColor}
.mk-butterfly{left:0;top:0;animation:mk-cross var(--d) ease-in-out var(--delay) infinite}
.mk-butterfly[data-flip="true"]{animation-direction:reverse}
.mk-butterfly[data-flip="true"]>*{transform:scaleX(-1)}
.mk-wing-l,.mk-wing-r{transform-origin:16px 12px;animation:mk-flap .42s ease-in-out infinite alternate}
.mk-wing-r{animation-delay:-.05s}
@keyframes mk-fall{0%{transform:translate3d(0,-8vh,0) rotate(0);opacity:0}8%{opacity:var(--o)}92%{opacity:var(--o)}100%{transform:translate3d(var(--drift),108vh,0) rotate(var(--rot));opacity:0}}
@keyframes mk-sway{from{transform:translateX(-12px) rotate(-22deg)}to{transform:translateX(12px) rotate(22deg)}}
@keyframes mk-rise{0%{transform:translate3d(0,108vh,0);opacity:0}10%{opacity:var(--o)}90%{opacity:var(--o)}100%{transform:translate3d(var(--drift),-8vh,0);opacity:0}}
@keyframes mk-twinkle{from{opacity:.35;transform:scale(.7)}to{opacity:1;transform:scale(1.15)}}
@keyframes mk-bokeh{0%{transform:translate3d(0,0,0) scale(.9);opacity:0}22%{opacity:var(--o)}78%{opacity:var(--o)}100%{transform:translate3d(var(--drift),-14vh,0) scale(1.15);opacity:0}}
@keyframes mk-cross{0%{transform:translate3d(-12vw,calc(70vh + var(--dy)),0);opacity:0}6%{opacity:var(--o)}25%{transform:translate3d(22vw,calc(52vh + var(--dy)),0)}50%{transform:translate3d(50vw,calc(64vh + var(--dy)),0)}75%{transform:translate3d(78vw,calc(40vh + var(--dy)),0)}94%{opacity:var(--o)}100%{transform:translate3d(112vw,calc(48vh + var(--dy)),0);opacity:0}}
@keyframes mk-flap{from{transform:scaleX(1)}to{transform:scaleX(.28)}}

@media (prefers-reduced-motion:reduce){
  [data-mk-reveal]{opacity:1!important;transform:none!important;transition:none!important}
  .mk-dock,.mk-music,.mk-disc,.mk-eq rect,.mk-music::after{animation:none!important}
  .mk-particles{display:none!important}
}
@media print{[data-mk-reveal]{opacity:1!important;transform:none!important}.mk-dock,.mk-music,.mk-particles{display:none!important}}
`;
