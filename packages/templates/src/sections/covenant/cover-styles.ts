/**
 * Covenant cover CSS (injected once, like the opening's). Transform, opacity, stroke and mask only.
 * A garden in soft mist: a light halo, foliage clusters, chandeliers, doves or butterflies,
 * and the couple's names floating in the clear middle. On reveal the camera pushes through (the world zooms and blurs
 * away) while an iris opens from the centre over the opening gate that mounts beneath; where @property is
 * missing it falls back to a fade. Every animation is off under reduced motion: the scene shows still.
 */
export const COVENANT_COVER_CSS = `
@property --iris{syntax:'<percentage>';inherits:false;initial-value:0%}
.cvc{position:fixed;inset:0;z-index:60;overflow:hidden;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(180deg,var(--cv-wash),var(--cv-ground) 40%,#fff 100%);transition:opacity .35s ease calc(var(--rv) - .35s)}
.cvc.is-reveal{opacity:0;pointer-events:none;-webkit-mask-image:radial-gradient(circle farthest-corner at 50% 50%,transparent var(--iris),#000 calc(var(--iris) + 1.2%));mask-image:radial-gradient(circle farthest-corner at 50% 50%,transparent var(--iris),#000 calc(var(--iris) + 1.2%));animation:cvc-iris var(--rv) cubic-bezier(.45,.05,.25,1) both}
.cvc-world{position:absolute;inset:0;transition:transform var(--rv) cubic-bezier(.4,0,.2,1),filter var(--rv) ease-in,opacity var(--rv) ease-in}
.cvc.is-reveal .cvc-world{transform:scale(1.55);filter:blur(7px);opacity:.2}
.cvc-mist{position:absolute;inset:-10%;background:radial-gradient(40% 30% at 20% 30%,rgba(255,255,255,.75),transparent 70%),radial-gradient(45% 32% at 80% 55%,rgba(255,236,242,.8),transparent 70%),radial-gradient(50% 30% at 40% 85%,rgba(255,255,255,.7),transparent 70%);animation:cvc-drift 16s ease-in-out infinite alternate}
.cvc-mist.two{background:radial-gradient(35% 28% at 70% 22%,rgba(255,255,255,.6),transparent 70%),radial-gradient(40% 30% at 15% 70%,rgba(255,232,240,.7),transparent 70%);animation-duration:22s;animation-direction:alternate-reverse}
.cvc-trees{position:absolute;inset:0;background:radial-gradient(26% 46% at 4% 55%,rgba(150,176,140,.45),transparent 70%),radial-gradient(26% 46% at 96% 52%,rgba(150,176,140,.45),transparent 70%),radial-gradient(60% 30% at 50% 100%,rgba(244,188,203,.5),transparent 70%);filter:blur(10px)}
.cvc-halo{position:absolute;left:50%;top:50%;width:min(120vw,860px);aspect-ratio:1;margin:calc(min(120vw,860px) / -2) 0 0 calc(min(120vw,860px) / -2);border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.92),rgba(255,244,248,.6) 38%,transparent 70%);animation:cvc-halo 7s ease-in-out infinite alternate}
.cvc-chand{position:absolute;top:-2px;width:clamp(78px,17vmin,160px);aspect-ratio:120/170;transform-origin:50% 0;animation:cvc-fadein 1.4s ease .8s both,cvc-swing 9s ease-in-out 2s infinite alternate;filter:drop-shadow(0 6px 10px rgba(138,100,24,.25))}
.cvc-chand.l{left:14%}
.cvc-chand.r{right:14%;animation-delay:1s,2.6s}
.cvc-flame{animation:cvc-flicker 1.4s ease-in-out infinite alternate}
.cvc-crystal{transform-box:fill-box;transform-origin:50% 0;animation:cvc-swing 3s ease-in-out infinite alternate}
.cvc-bloom{position:absolute;aspect-ratio:1;transform:translate(-50%,-50%) rotate(var(--r));animation:cvc-bloom 2.6s cubic-bezier(.22,1,.36,1) var(--t) both}
.cvc-bloom.far{filter:blur(1.4px);opacity:.8}
.cvc-bloom>span{display:block;width:100%;height:100%;animation:cvc-sway 9s ease-in-out infinite alternate}
.cvc-leafy{position:absolute;aspect-ratio:2;transform:translate(-50%,-50%) rotate(var(--r));animation:cvc-leaf 2.2s cubic-bezier(.22,1,.36,1) var(--t) both}
.cvc-glass{position:relative;z-index:3;width:var(--pw);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(8px,2svh,18px);padding:0 4%;animation:cvc-glass-in 2s cubic-bezier(.22,1,.36,1) .4s both;transition:opacity .7s ease,transform 1.2s cubic-bezier(.4,0,.2,1)}
.cvc.is-reveal .cvc-glass{position:relative;z-index:3;width:var(--pw);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(8px,2svh,18px);padding:0 4%;animation:cvc-glass-in 2s cubic-bezier(.22,1,.36,1) .4s both;transition:opacity .7s ease,transform 1.2s cubic-bezier(.4,0,.2,1)}
.cvc-draw{stroke-dasharray:1;stroke-dashoffset:1;animation:cvc-draw 2.2s cubic-bezier(.4,.1,.3,1) both}
.cvc-rise{animation:cvc-rise 1.9s cubic-bezier(.22,1,.36,1) var(--at,0ms) both}
.cvc-divider{display:flex;align-items:center;gap:10px;width:70%;animation:cvc-fadein 1s ease 3s both}
.cvc-divider i{flex:1;height:1.5px;background:linear-gradient(90deg,transparent,var(--cv-mid));transform-origin:right;animation:cvc-grow 1.2s ease 3s both}
.cvc-divider i:last-child{background:linear-gradient(270deg,transparent,var(--cv-mid));transform-origin:left}
.cvc-divider b{width:8px;height:8px;transform:rotate(45deg);background:var(--cv-mid)}
.cvc-bf{position:absolute;z-index:2;transform:translate(-50%,-50%) rotate(var(--rot));animation:cvc-arrive 2.2s cubic-bezier(.25,.7,.3,1) var(--t) both}
.cvc-bf-in{width:100%;height:100%;animation:cvc-bob 3.2s ease-in-out var(--t) infinite alternate}
.cvc-fy{position:absolute;left:0;top:0;z-index:2;opacity:0;animation:var(--path) var(--dur) ease-in-out var(--t) infinite}
.cvc .cv-wings{transform-box:view-box;transform-origin:50% 50%;animation:cvc-flap .42s ease-in-out infinite alternate}
.cvc-wing{transform-box:view-box;transform-origin:46% 62%;animation:cvc-beat .7s ease-in-out infinite alternate}
.cvc-sp{position:absolute;z-index:2;opacity:0;animation:cvc-twinkle var(--dur) ease-in-out var(--t) infinite}
.cvc-petal{position:absolute;top:-30px;z-index:2;border-radius:80% 0 80% 0;background:radial-gradient(circle at 30% 30%,#fff,var(--cv-petal) 55%,var(--cv-rose));opacity:0;animation:cvc-fall var(--d) linear var(--t) infinite}
.cvc-bokeh{position:absolute;bottom:-30px;z-index:2;border-radius:50%;background:radial-gradient(circle,rgba(255,243,196,.9),rgba(255,243,196,0) 70%);opacity:0;animation:cvc-rise-up var(--d) ease-in var(--t) infinite}
.cvc.is-still *{animation:none!important;filter:none}
.cvc.is-still .cvc-draw{stroke-dashoffset:0}
.cvc.is-still :is(.cvc-bf,.cvc-bloom,.cvc-leafy,.cvc-glass,.cvc-rise,.cvc-divider,.cvc-divider i,.cvc-chand,.cvc-halo){opacity:1}
@keyframes cvc-iris{to{--iris:100%}}
@keyframes cvc-drift{from{transform:translateX(-4%)}to{transform:translateX(4%)}}
@keyframes cvc-draw{to{stroke-dashoffset:0}}
@keyframes cvc-leaf{from{opacity:0;transform:translate(calc(-50% + var(--ox)),calc(-50% + var(--oy))) rotate(var(--r)) scale(.5)}to{opacity:1;transform:translate(-50%,-50%) rotate(var(--r)) scale(1)}}
@keyframes cvc-fadein{from{opacity:0}to{opacity:1}}
@keyframes cvc-rise{from{opacity:0;transform:translateY(12px);filter:blur(6px)}to{opacity:1;transform:none;filter:blur(0)}}
@keyframes cvc-glass-in{from{opacity:0;transform:scale(.94) translateY(10px)}to{opacity:1;transform:none}}
@keyframes cvc-halo{from{opacity:.55;transform:scale(.96)}to{opacity:.95;transform:scale(1.04)}}
@keyframes cvc-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes cvc-flap{from{transform:scaleX(1)}to{transform:scaleX(.28)}}
@keyframes cvc-beat{from{transform:scaleY(1) rotate(0)}to{transform:scaleY(-.5) rotate(8deg)}}
@keyframes cvc-bob{from{transform:translateY(-7px) rotate(-3deg)}to{transform:translateY(7px) rotate(3deg)}}
@keyframes cvc-swing{from{transform:rotate(-2.5deg)}to{transform:rotate(2.5deg)}}
@keyframes cvc-flicker{from{opacity:.75;transform:scaleY(.9)}to{opacity:1;transform:scaleY(1.12)}}
@keyframes cvc-arrive{from{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) rotate(calc(var(--rot) - 40deg)) scale(.5)}60%{opacity:1}to{opacity:1;transform:translate(-50%,-50%) rotate(var(--rot)) scale(1)}}
@keyframes cvc-bloom{from{opacity:0;transform:translate(calc(-50% + var(--ox)),calc(-50% + var(--oy))) rotate(calc(var(--r) - 25deg)) scale(.55)}to{opacity:1;transform:translate(-50%,-50%) rotate(var(--r)) scale(1)}}
@keyframes cvc-sway{from{transform:rotate(-3deg) scale(.99)}to{transform:rotate(3deg) scale(1.025)}}
@keyframes cvc-twinkle{0%,100%{opacity:0;transform:scale(.5)}50%{opacity:.9;transform:scale(1)}}
@keyframes cvc-fall{0%{opacity:0;transform:translate3d(0,0,0) rotate(0)}10%{opacity:.85}100%{opacity:0;transform:translate3d(var(--x),112svh,0) rotate(var(--r))}}
@keyframes cvc-rise-up{0%{opacity:0;transform:translateY(0) scale(.6)}20%{opacity:.9}100%{opacity:0;transform:translateY(-90svh) scale(1.2)}}
@keyframes cvc-fly-a{0%{opacity:0;transform:translate(-15vw,85vh) rotate(35deg)}8%{opacity:1}30%{transform:translate(20vw,50vh) rotate(8deg)}55%{transform:translate(55vw,64vh) rotate(-14deg)}80%{opacity:1;transform:translate(88vw,26vh) rotate(22deg)}100%{opacity:0;transform:translate(115vw,8vh) rotate(40deg)}}
@keyframes cvc-fly-b{0%{opacity:0;transform:translate(115vw,20vh) rotate(-30deg)}8%{opacity:1}35%{transform:translate(75vw,40vh) rotate(-8deg)}65%{transform:translate(32vw,22vh) rotate(14deg)}92%{opacity:1}100%{opacity:0;transform:translate(-15vw,46vh) rotate(-25deg)}}
@keyframes cvc-fly-c{0%{opacity:0;transform:translate(105vw,95vh) rotate(-20deg)}10%{opacity:1}40%{transform:translate(70vw,72vh) rotate(10deg)}70%{transform:translate(30vw,80vh) rotate(-10deg)}92%{opacity:1}100%{opacity:0;transform:translate(-18vw,60vh) rotate(-35deg)}}
@media (prefers-reduced-motion:reduce){.cvc *{animation:none!important}.cvc .cvc-draw{stroke-dashoffset:0}.cvc :is(.cvc-bf,.cvc-bloom,.cvc-leafy,.cvc-glass,.cvc-rise,.cvc-divider,.cvc-divider i,.cvc-chand,.cvc-halo){opacity:1}}
`;
