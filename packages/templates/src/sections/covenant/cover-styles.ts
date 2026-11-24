/**
 * Covenant cover CSS (injected once, like the opening's). Transform, opacity, stroke and mask only.
 * The cover is a fixed overlay: it plays, then `.is-reveal` opens an iris from the centre over the
 * opening gate that mounts beneath (falls back to a fade where @property is missing).
 * Every animation is off under reduced motion: the scene is shown still.
 */
export const COVENANT_COVER_CSS = `
@property --iris{syntax:'<percentage>';inherits:false;initial-value:0%}
.cvc{position:fixed;inset:0;z-index:60;overflow:hidden;display:flex;align-items:center;justify-content:center;text-align:center;cursor:pointer;background:radial-gradient(85% 75% at 50% 40%,#fff,var(--cv-ground) 45%,var(--cv-wash));transition:opacity .35s ease calc(var(--rv) - .35s)}
.cvc.is-reveal{opacity:0;pointer-events:none;-webkit-mask-image:radial-gradient(circle farthest-corner at 50% 46%,transparent var(--iris),#000 calc(var(--iris) + 1.2%));mask-image:radial-gradient(circle farthest-corner at 50% 46%,transparent var(--iris),#000 calc(var(--iris) + 1.2%));animation:cvc-iris var(--rv) cubic-bezier(.55,.05,.35,1) both}
.cvc-rays{position:absolute;left:50%;top:46%;width:230vmax;height:230vmax;margin:-115vmax 0 0 -115vmax;background:repeating-conic-gradient(from 0deg,var(--cv-glow) 0 5deg,transparent 5deg 15deg);-webkit-mask-image:radial-gradient(circle,#000 0,transparent 42%);mask-image:radial-gradient(circle,#000 0,transparent 42%);opacity:.5;animation:cvc-turn 140s linear infinite}
.cvc-frame{position:absolute;inset:14px;pointer-events:none}
.cvc-frame.in{inset:24px}
.cvc-frame rect{fill:none;stroke:var(--cv-mid);stroke-width:1.5;x:1px;y:1px;width:calc(100% - 2px);height:calc(100% - 2px)}
.cvc-frame.in rect{opacity:.45}
.cvc-corner{position:absolute;width:clamp(150px,36vmin,330px);height:clamp(150px,36vmin,330px);pointer-events:none;z-index:1}
.cvc-corner.tl{left:0;top:0}
.cvc-corner.tr{right:0;top:0;transform:scaleX(-1)}
.cvc-corner.bl{left:0;bottom:0;transform:scaleY(-1)}
.cvc-corner.br{right:0;bottom:0;transform:scale(-1,-1)}
.cvc-draw{stroke-dasharray:1;stroke-dashoffset:1;animation:cvc-draw 1.8s cubic-bezier(.4,.1,.3,1) both}
.cvc-ring{animation-duration:2.2s}
.cvc-frame rect.cvc-draw{animation-duration:2.4s}
.cvc-leaf{transform-box:fill-box;transform-origin:0 50%;opacity:0;animation:cvc-leaf .7s cubic-bezier(.2,.9,.3,1.3) both}
.cvc-pop{transform-box:fill-box;transform-origin:center;opacity:0;animation:cvc-pop .9s cubic-bezier(.2,.9,.3,1.4) both}
.cvc-fade-in{opacity:0;animation:cvc-fadein 1.4s ease both}
.cvc-center{position:relative;z-index:3;display:flex;flex-direction:column;align-items:center;gap:clamp(8px,2svh,18px);padding:0 24px;transition:opacity .5s ease,transform .9s ease}
.cvc.is-reveal .cvc-center{opacity:0;transform:scale(1.12)}
.cvc-ringbox{position:relative;width:var(--ring);height:var(--ring)}
.cvc-ringbox>.cvc-ringart{position:absolute;inset:0}
.cvc-mono{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;gap:.08em;animation:cvc-rise 1.4s cubic-bezier(.2,.8,.2,1) 1.2s both}
.cvc-rise{animation:cvc-rise 1.4s cubic-bezier(.2,.8,.2,1) var(--at,0ms) both}
.cvc-divider{display:flex;align-items:center;gap:10px;width:min(60vw,240px);animation:cvc-fadein 1s ease 2.6s both}
.cvc-divider i{flex:1;height:1.5px;background:linear-gradient(90deg,transparent,var(--cv-mid));transform-origin:right;animation:cvc-grow 1.2s ease 2.6s both}
.cvc-divider i:last-child{background:linear-gradient(270deg,transparent,var(--cv-mid));transform-origin:left}
.cvc-divider b{width:9px;height:9px;transform:rotate(45deg);background:var(--cv-mid)}
.cvc-hint{position:absolute;left:0;right:0;bottom:calc(16px + env(safe-area-inset-bottom));z-index:3;margin:0;font-size:12px;letter-spacing:.08em;opacity:.55;pointer-events:none}
.cvc-bf{position:absolute;z-index:2;transform:translate(-50%,-50%) rotate(var(--rot));animation:cvc-arrive 2.2s cubic-bezier(.25,.7,.3,1) var(--t) both}
.cvc-bf-in{width:100%;height:100%;animation:cvc-bob 3.2s ease-in-out var(--t) infinite alternate}
.cvc-fy{position:absolute;left:0;top:0;z-index:2;opacity:0;animation:var(--path) var(--dur) ease-in-out var(--t) infinite}
.cvc .cv-wings{transform-box:view-box;transform-origin:50% 50%;animation:cvc-flap .42s ease-in-out infinite alternate}
.cvc-fl{position:absolute;z-index:1;transform:translate(-50%,-50%);animation:cvc-bloom 1.6s cubic-bezier(.2,.9,.3,1.2) var(--t) both}
.cvc-fl-in{width:100%;height:100%;animation:cvc-sway 6s ease-in-out infinite alternate}
.cvc-wreath{position:absolute;inset:0;z-index:1}
.cvc-wl{position:absolute;width:11%;height:11%;transform:translate(-50%,-50%) rotate(var(--a));opacity:0;animation:cvc-leaf .8s ease both}
.cvc-sp{position:absolute;z-index:1;opacity:0;animation:cvc-twinkle var(--dur) ease-in-out var(--t) infinite}
.cvc-petal{position:absolute;top:-30px;z-index:1;border-radius:80% 0 80% 0;background:radial-gradient(circle at 30% 30%,#fff,var(--cv-petal) 55%,var(--cv-rose));opacity:0;animation:cvc-fall var(--d) linear var(--t) infinite}
.cvc.is-reveal .cvc-bf,.cvc.is-reveal .cvc-fy,.cvc.is-reveal .cvc-fl{transition:opacity .5s ease;opacity:0}
.cvc.is-still *{animation:none!important}
.cvc.is-still .cvc-draw{stroke-dashoffset:0}
.cvc.is-still :is(.cvc-bf,.cvc-fl,.cvc-leaf,.cvc-pop,.cvc-fade-in,.cvc-mono,.cvc-rise,.cvc-divider,.cvc-divider i,.cvc-wl){opacity:1}
@keyframes cvc-iris{to{--iris:100%}}
@keyframes cvc-turn{to{transform:rotate(360deg)}}
@keyframes cvc-draw{to{stroke-dashoffset:0}}
@keyframes cvc-leaf{from{opacity:0;transform:scale(0) rotate(-25deg)}to{opacity:1;transform:none}}
@keyframes cvc-pop{from{opacity:0;transform:scale(0) rotate(-45deg)}to{opacity:1;transform:none}}
@keyframes cvc-fadein{from{opacity:0}to{opacity:1}}
@keyframes cvc-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes cvc-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes cvc-flap{from{transform:scaleX(1)}to{transform:scaleX(.28)}}
@keyframes cvc-bob{from{transform:translateY(-7px) rotate(-3deg)}to{transform:translateY(7px) rotate(3deg)}}
@keyframes cvc-arrive{from{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) rotate(calc(var(--rot) - 40deg)) scale(.5)}60%{opacity:1}to{opacity:1;transform:translate(-50%,-50%) rotate(var(--rot)) scale(1)}}
@keyframes cvc-bloom{from{opacity:0;transform:translate(-50%,-50%) scale(0) rotate(-90deg)}to{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(0)}}
@keyframes cvc-sway{from{transform:rotate(-5deg) scale(.98)}to{transform:rotate(5deg) scale(1.03)}}
@keyframes cvc-twinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0)}50%{opacity:1;transform:scale(1) rotate(90deg)}}
@keyframes cvc-fall{0%{opacity:0;transform:translate3d(0,0,0) rotate(0)}10%{opacity:.85}100%{opacity:0;transform:translate3d(var(--x),112svh,0) rotate(var(--r))}}
@keyframes cvc-fly-a{0%{opacity:0;transform:translate(-15vw,85vh) rotate(35deg)}8%{opacity:1}30%{transform:translate(20vw,50vh) rotate(8deg)}55%{transform:translate(55vw,64vh) rotate(-14deg)}80%{opacity:1;transform:translate(88vw,26vh) rotate(22deg)}100%{opacity:0;transform:translate(115vw,8vh) rotate(40deg)}}
@keyframes cvc-fly-b{0%{opacity:0;transform:translate(115vw,20vh) rotate(-30deg)}8%{opacity:1}35%{transform:translate(75vw,40vh) rotate(-8deg)}65%{transform:translate(32vw,22vh) rotate(14deg)}92%{opacity:1}100%{opacity:0;transform:translate(-15vw,46vh) rotate(-25deg)}}
@keyframes cvc-fly-c{0%{opacity:0;transform:translate(105vw,95vh) rotate(-20deg)}10%{opacity:1}40%{transform:translate(70vw,72vh) rotate(10deg)}70%{transform:translate(30vw,80vh) rotate(-10deg)}92%{opacity:1}100%{opacity:0;transform:translate(-18vw,60vh) rotate(-35deg)}}
@media (prefers-reduced-motion:reduce){.cvc *{animation:none!important}.cvc .cvc-draw{stroke-dashoffset:0}.cvc :is(.cvc-bf,.cvc-fl,.cvc-leaf,.cvc-pop,.cvc-fade-in,.cvc-mono,.cvc-rise,.cvc-divider,.cvc-divider i,.cvc-wl){opacity:1}}
`;
