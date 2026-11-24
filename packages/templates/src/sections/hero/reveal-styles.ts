/**
 * CSS for the three reveal heroes (gift box, envelope, book) and the hero they open onto. Everything is
 * driven by `data-phase` on `.hr` (idle | opening | open), so a sequence is just a list of delayed animations.
 * Transform, opacity and filter only. Reduced motion collapses every animation to its end state.
 */
export const REVEAL_CSS = `
.hr{position:relative;min-height:100svh;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(14px,3svh,28px);background:radial-gradient(90% 80% at 50% 36%,var(--hr-a),var(--hr-b))}
.hr-scene{position:absolute;inset:0;opacity:0;pointer-events:none}
.hr[data-phase=opening] .hr-scene,.hr[data-phase=open] .hr-scene{animation:hr-scene 2.6s cubic-bezier(.22,1,.36,1) var(--sd) both}
.hr[data-phase=open] .hr-scene{pointer-events:auto}
.hr-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hr[data-phase=open] .hr-photo{animation:hr-drift 26s ease-in-out infinite alternate}
.hr-veil{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.22),rgba(0,0,0,.12) 40%,rgba(0,0,0,.6))}
.hr-names{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:0 24px;text-align:center}
.hr-names>*{opacity:0}
.hr[data-phase=opening] .hr-names>*,.hr[data-phase=open] .hr-names>*{animation:hr-rise 1.7s cubic-bezier(.22,1,.36,1) calc(var(--sd) + 900ms) both}
.hr[data-phase=opening] .hr-names>:nth-child(2),.hr[data-phase=open] .hr-names>:nth-child(2){animation-delay:calc(var(--sd) + 1250ms)}
.hr[data-phase=opening] .hr-names>:nth-child(3),.hr[data-phase=open] .hr-names>:nth-child(3){animation-delay:calc(var(--sd) + 1800ms)}
.hr-line{width:64px;height:1px}
.hr-prop{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:clamp(14px,3svh,28px);transition:opacity .6s}
.hr-hint{position:relative;z-index:3;margin:0;font-size:.78rem;letter-spacing:.24em;text-transform:uppercase;color:var(--hr-ink);opacity:.75;animation:hr-pulse 2.4s ease-in-out infinite;transition:opacity .4s}
.hr:not([data-phase=idle]) .hr-hint{animation:none;opacity:0}
.hr[data-phase=open] .hr-prop{opacity:0;pointer-events:none}
@keyframes hr-scene{from{opacity:0;transform:scale(1.28);filter:blur(16px)}to{opacity:1;transform:none;filter:blur(0)}}
@keyframes hr-rise{from{opacity:0;transform:translateY(22px);filter:blur(8px)}to{opacity:1;transform:none;filter:blur(0)}}
@keyframes hr-drift{from{transform:scale(1)}to{transform:scale(1.1)}}
@keyframes hr-pulse{0%,100%{opacity:.4}50%{opacity:.9}}
@keyframes hr-float{from{transform:translateY(-6px) rotate(-.6deg)}to{transform:translateY(8px) rotate(.6deg)}}

/* ---------- gift box ---------- */
.hg-stage{position:relative;z-index:2;width:var(--bw);aspect-ratio:1;cursor:pointer;outline-offset:10px}
.hg-box{position:absolute;inset:0;animation:hr-float 3s ease-in-out infinite alternate;filter:drop-shadow(0 26px 24px rgba(60,30,40,.28))}
.hr[data-phase=opening] .hg-box{animation:hg-shake .7s ease-in-out both}
.hg-box svg{width:100%;height:100%;overflow:visible}
.hg-body,.hg-lid,.hg-bow{transform-box:fill-box;transform-origin:center}
.hr[data-phase=opening] .hg-bow{animation:hg-untie .8s cubic-bezier(.5,0,.8,.4) .7s both}
.hr[data-phase=opening] .hg-lid{animation:hg-lid 1.1s cubic-bezier(.4,0,.3,1) 1.15s both}
.hr[data-phase=opening] .hg-body{animation:hg-body .9s ease-in 2s both}
.hg-glow{position:absolute;left:50%;top:34%;width:90%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,#fff 0,rgba(255,236,190,.9) 26%,rgba(255,236,190,0) 68%);opacity:0;transform:translate(-50%,-50%) scale(.2)}
.hr[data-phase=opening] .hg-glow{animation:hg-glow 1.9s ease-out 1.3s both}
.hg-conf{position:absolute;left:50%;top:34%;width:var(--s);height:calc(var(--s) * .5);background:var(--c);border-radius:1px;opacity:0}
.hr[data-phase=opening] .hg-conf{animation:hg-conf 2.2s cubic-bezier(.15,.7,.3,1) calc(1.3s + var(--d)) both}
@keyframes hg-shake{0%,100%{transform:translateX(0) rotate(0)}15%{transform:translateX(-7px) rotate(-2deg)}30%{transform:translateX(7px) rotate(2deg)}45%{transform:translateX(-5px) rotate(-1.4deg)}60%{transform:translateX(5px) rotate(1.4deg)}80%{transform:translateX(-2px) rotate(-.5deg)}}
@keyframes hg-untie{to{opacity:0;transform:translateY(-30%) scale(1.7) rotate(24deg)}}
@keyframes hg-lid{0%{transform:translateY(0) rotate(0)}30%{transform:translateY(-14%) rotate(-3deg)}100%{opacity:0;transform:translateY(-190%) rotate(-18deg)}}
@keyframes hg-body{to{opacity:0;transform:translateY(16%) scale(.88)}}
@keyframes hg-glow{0%{opacity:0;transform:translate(-50%,-50%) scale(.2)}25%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(3.4)}}
@keyframes hg-conf{0%{opacity:0;transform:translate(-50%,0) rotate(0)}8%{opacity:1}55%{transform:translate(calc(-50% + var(--dx)),var(--dy)) rotate(calc(var(--r) * .6))}100%{opacity:0;transform:translate(calc(-50% + var(--dx) * 1.15),calc(var(--dy) + 360px)) rotate(var(--r))}}

/* ---------- book ---------- */
.hb-stage{position:relative;z-index:2;perspective:2000px;cursor:pointer;outline-offset:10px}
.hb-book{position:relative;width:calc(var(--pw) * 2);height:calc(var(--pw) * 1.36);transform-style:preserve-3d;transform:translateX(calc(var(--pw) * -.5)) rotateX(6deg) rotateY(-14deg);animation:hr-float 3.2s ease-in-out infinite alternate}
.hr[data-phase=opening] .hb-book{animation:hb-shift 1.5s cubic-bezier(.4,0,.2,1) .15s both}
.hr[data-phase=opening] .hb-stage{animation:hb-push 1.3s cubic-bezier(.6,0,.9,.4) 3.4s both}
.hb-page{position:absolute;top:0;width:var(--pw);height:100%;border-radius:2px 8px 8px 2px;overflow:hidden;background:var(--b3)}
.hb-right{left:var(--pw);box-shadow:0 30px 50px -18px rgba(40,20,30,.5),inset 6px 0 14px rgba(0,0,0,.18)}
.hb-right img,.hb-right .hb-fill{width:100%;height:100%;object-fit:cover;display:block}
.hb-left{left:0;opacity:0;border-radius:8px 2px 2px 8px;background:linear-gradient(90deg,var(--b3),var(--b4));box-shadow:inset -6px 0 14px rgba(0,0,0,.14)}
.hb-cover{position:absolute;left:var(--pw);top:-2%;width:var(--pw);height:104%;transform-origin:0 50%;transform-style:preserve-3d}
.hr[data-phase=opening] .hb-cover{animation:hb-cover 1.6s cubic-bezier(.55,.05,.25,1) .35s both}
.hb-face{position:absolute;inset:0;backface-visibility:hidden;border-radius:2px 10px 10px 2px}
.hb-front{background:linear-gradient(145deg,var(--b1),var(--b2));box-shadow:0 30px 50px -18px rgba(40,20,30,.55);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8%;color:var(--b5);text-align:center;padding:10%;overflow:hidden}
.hb-front::before{content:"";position:absolute;inset:7%;border:1.5px solid var(--b5);opacity:.7;border-radius:4px}
.hb-front::after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 40%,rgba(255,255,255,.28) 50%,transparent 60%);transform:translateX(-120%);animation:hb-shine 4.5s ease-in-out 1s infinite}
.hr[data-phase=opening] .hb-front::after{animation:none}
.hb-back{background:linear-gradient(270deg,var(--b3),var(--b4));transform:rotateY(180deg);border-radius:10px 2px 2px 10px;box-shadow:inset 6px 0 14px rgba(0,0,0,.14);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7%;padding:10%;text-align:center;color:var(--b6)}
.hb-leaf{position:absolute;left:var(--pw);top:0;width:var(--pw);height:100%;background:var(--b3);transform-origin:0 50%;border-radius:2px 8px 8px 2px;opacity:0}
.hr[data-phase=opening] .hb-leaf{animation:hb-leaf 1.3s cubic-bezier(.55,.05,.25,1) var(--ld) both}
.hr[data-phase=opening] .hb-left{animation:hb-left .3s ease 1.1s both}
.hb-orn{display:block;width:34%;height:1px;background:var(--b5)}
@keyframes hb-left{to{opacity:1}}
@keyframes hb-shift{from{transform:translateX(calc(var(--pw) * -.5)) rotateX(6deg) rotateY(-14deg)}to{transform:translateX(0) rotateX(0) rotateY(0)}}
@keyframes hb-cover{from{transform:rotateY(0)}to{transform:rotateY(-179deg)}}
@keyframes hb-leaf{0%{opacity:0;transform:rotateY(0)}15%{opacity:.9}85%{opacity:.9}100%{opacity:0;transform:rotateY(-176deg)}}
@keyframes hb-shine{0%,60%{transform:translateX(-120%)}100%{transform:translateX(120%)}}
@keyframes hb-push{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(2.2)}}
@media (prefers-reduced-motion:reduce){.hr *{animation-duration:.01ms!important;animation-delay:0s!important;animation-iteration-count:1!important}}
`;
