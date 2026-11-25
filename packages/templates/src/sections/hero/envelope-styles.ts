import { ENVELOPE_STAGES as S, typeStart } from "./envelope-logic";

const EASE_OUT = "cubic-bezier(.22,.61,.36,1)";
const EASE_IO = "cubic-bezier(.45,0,.2,1)";
const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .42 0 0 0 0 .34 0 0 0 0 .26 0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/**
 * Envelope hero CSS. Everything starts hidden and is released together by `data-go` on `.he2`; each stage is a
 * delayed animation from ENVELOPE_STAGES. Transform and opacity only. Reduced motion shows the final composition.
 */
export const ENVELOPE_CSS = `
.he2{position:relative;min-height:100svh;overflow:hidden;display:flex;align-items:center;justify-content:center;padding-top:6svh;box-sizing:border-box;background:var(--bg2);isolation:isolate}
.he2-bg{position:absolute;inset:0;z-index:-2;opacity:0;background:radial-gradient(70% 55% at 28% 10%,rgba(255,255,255,.8),transparent 62%),radial-gradient(95% 85% at 50% 58%,var(--bg1),var(--bg2))}
.he2-grain{position:absolute;inset:0;z-index:-1;opacity:.55;mix-blend-mode:multiply;pointer-events:none;background-image:${NOISE}}
.he2-vig{position:absolute;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(120% 100% at 50% 42%,transparent 55%,rgba(96,70,46,.16))}
.he2-light{position:absolute;inset:-20%;z-index:-1;opacity:0;pointer-events:none;background:radial-gradient(40% 32% at 30% 20%,rgba(255,250,240,.55),transparent 70%)}
.he2[data-go] .he2-bg{animation:he2-fade ${S.scene.ms}ms ease-out ${S.scene.at}ms both}
.he2[data-go] .he2-light{animation:he2-fade 1200ms ease-out ${S.settle.at}ms both,he2-drift 28s ease-in-out ${S.settle.at + 1200}ms infinite alternate}

.he2-stage{position:relative;width:var(--ew);aspect-ratio:1/.68;opacity:0}
.he2[data-go] .he2-stage{animation:he2-enter ${S.envelope.ms}ms ${EASE_OUT} ${S.envelope.at}ms both}
.he2[data-banner][data-go] .he2-stage{animation:he2-enter ${S.envelope.ms}ms ${EASE_OUT} ${S.envelope.at}ms both,he2-push ${S.banner.ms * 0.8}ms cubic-bezier(.6,0,.9,.4) ${S.banner.at}ms forwards}
.he2-shadow{position:absolute;left:4%;right:4%;bottom:-5%;height:11%;border-radius:50%;background:radial-gradient(closest-side,rgba(70,45,28,.5),transparent);filter:blur(9px);opacity:.55}
.he2[data-go] .he2-shadow{animation:he2-relax ${S.settle.ms}ms ease-out ${S.settle.at}ms both}

.he2-back{position:absolute;inset:0;border-radius:3px;background:linear-gradient(180deg,var(--in2),var(--in1));box-shadow:0 34px 48px -28px rgba(70,45,28,.45),0 8px 14px -8px rgba(70,45,28,.3)}

.he2-card{position:absolute;left:50%;bottom:4%;width:calc(var(--ew) * .72);margin-left:calc(var(--ew) * -.36);aspect-ratio:5/7;z-index:2;transform-origin:50% 100%;transform:translateY(0) scale(.64) rotate(1.6deg)}
.he2[data-go] .he2-card{animation:he2-card ${S.card.ms}ms cubic-bezier(.25,.1,.25,1) ${S.card.at}ms both}
.he2-card-in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;overflow:hidden;border-radius:2px;background:linear-gradient(170deg,var(--cd1),var(--cd2));box-shadow:0 1px 0 rgba(255,255,255,.8) inset,0 0 0 1px rgba(120,92,60,.12),0 18px 30px -14px rgba(60,40,24,.4),0 4px 8px -3px rgba(60,40,24,.25);transition:transform .35s ${EASE_OUT},box-shadow .35s ${EASE_OUT}}
.he2-card-in::after{content:"";position:absolute;inset:0;pointer-events:none;mix-blend-mode:multiply;opacity:.5;background-image:${NOISE}}
.he2-card-in::before{content:"";position:absolute;inset:3.2%;pointer-events:none;border:1px solid var(--foil);opacity:.55}
.he2-card-in:hover{transform:translateY(-4px);box-shadow:0 1px 0 rgba(255,255,255,.8) inset,0 0 0 1px rgba(120,92,60,.12),0 26px 38px -14px rgba(60,40,24,.42),0 6px 10px -3px rgba(60,40,24,.25)}
.he2-photo{width:72%;margin-top:8%;aspect-ratio:5/4;object-fit:cover;object-position:50% 28%;display:block;box-shadow:0 0 0 1px rgba(120,92,60,.15)}
.he2-text{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:calc(var(--cw) * .022);padding:0 9% 12%;text-align:center;color:var(--ink);min-height:0}
.he2-t{opacity:0}
.he2[data-go] .he2-t{animation:he2-type ${S.type.ms}ms ${EASE_OUT} var(--d) both}
.he2[data-go] .he2-rule{animation:he2-rule ${S.type.ms}ms ${EASE_OUT} var(--d) both}

.he2-pocket{position:absolute;inset:0;z-index:3;pointer-events:none}
.he2-pocket i{position:absolute;inset:0;border-radius:3px}
.he2-pocket i::after{content:"";position:absolute;inset:0;mix-blend-mode:multiply;opacity:.55;background-image:${NOISE}}
.he2-l{background:linear-gradient(100deg,var(--pp1),var(--pp2));clip-path:polygon(0 0,56% 57%,0 100%)}
.he2-r{background:linear-gradient(260deg,var(--pp3),var(--pp2));clip-path:polygon(100% 0,44% 57%,100% 100%)}
.he2-b{background:linear-gradient(180deg,var(--pp2),var(--pp4));clip-path:polygon(0 100%,50% 48%,100% 100%)}

.he2-flap-shadow{position:absolute;left:0;top:0;width:100%;height:58%;z-index:3;pointer-events:none;background:rgba(60,40,24,.28);filter:blur(4px);transform:translateY(3px);clip-path:polygon(0 0,100% 0,50% 100%)}
.he2[data-go] .he2-flap-shadow{animation:he2-fadeout ${S.flap.ms * .5}ms ease-in ${S.flap.at}ms both}
.he2-flap{position:absolute;left:0;top:0;width:100%;height:58%;z-index:4;transform-origin:50% 0;transform-style:preserve-3d}
.he2-flap i{position:absolute;inset:0;backface-visibility:hidden;clip-path:polygon(0 0,100% 0,50% 100%)}
.he2-flap .out{background:linear-gradient(180deg,var(--fp1),var(--fp2))}
.he2-flap .out::after{content:"";position:absolute;inset:0;mix-blend-mode:multiply;opacity:.55;background-image:${NOISE}}
.he2-flap .in{background:linear-gradient(0deg,var(--in2),var(--in1));transform:rotateY(180deg)}
.he2[data-go] .he2-flap{animation:he2-flap ${S.flap.ms}ms ${EASE_IO} ${S.flap.at}ms both,he2-z ${S.flap.ms}ms step-end ${S.flap.at}ms both}

.he2-seal{position:absolute;left:50%;top:57%;width:13%;aspect-ratio:1;z-index:5;transform:translate(-50%,-50%);border-radius:50%;display:grid;place-items:center;color:var(--foil-ink);font-family:var(--seal-font);font-size:calc(var(--ew) * .05);background:radial-gradient(circle at 34% 28%,var(--foil-hi),var(--foil) 55%,var(--foil-lo));box-shadow:0 0 0 1px rgba(255,255,255,.35) inset,0 0 0 3px rgba(0,0,0,.05) inset,0 5px 8px -2px rgba(50,32,18,.4)}
.he2-seal[data-two]{width:17%;font-size:calc(var(--ew) * .036);letter-spacing:.02em;white-space:nowrap}
.he2-seal::after{content:"";position:absolute;inset:11%;border-radius:50%;border:1px solid rgba(255,255,255,.4)}
.he2[data-go] .he2-seal{animation:he2-seal ${S.seal.ms}ms ease-in ${S.seal.at}ms both}

.he2-banner{position:absolute;inset:0;z-index:6;opacity:0;pointer-events:none;overflow:hidden;background:#000}
.he2-banner img{width:100%;height:100%;object-fit:cover;display:block}
.he2-banner-veil{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.16) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,.18) 55%,rgba(0,0,0,.78) 100%)}
.he2-banner-names{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:12px;padding:0 24px clamp(120px,24svh,220px);text-align:center;color:#fff}
.he2-banner-names>*{opacity:0}
.he2[data-go] .he2-banner{animation:he2-banner ${S.banner.ms}ms ${EASE_OUT} ${S.banner.at}ms both}
.he2[data-go] .he2-banner-names>*{animation:he2-type 900ms ${EASE_OUT} ${S.banner.at + 700}ms both}
.he2[data-go] .he2-banner-names>:nth-child(2){animation-delay:${S.banner.at + 850}ms}
.he2[data-go] .he2-banner-names>:nth-child(3){animation-delay:${S.banner.at + 1050}ms}
@media (orientation:landscape){.he2-banner-veil{background:linear-gradient(90deg,rgba(0,0,0,.66),rgba(0,0,0,.28) 45%,rgba(0,0,0,0) 70%),linear-gradient(180deg,rgba(0,0,0,.14),rgba(0,0,0,0) 30%,rgba(0,0,0,.4) 100%)}.he2-banner-names{align-items:flex-start;text-align:left;padding:0 6vw clamp(80px,20svh,170px)}}
.he2-cue{position:absolute;z-index:7;left:50%;bottom:calc(14px + env(safe-area-inset-bottom));transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px;border:0;background:none;cursor:pointer;color:var(--cue,var(--ink));font-size:.7rem;letter-spacing:.28em;text-transform:uppercase;opacity:0;padding:6px 10px}
.he2-cue i{display:block;width:1px;height:26px;background:currentColor;opacity:.6;transform-origin:50% 0;transition:transform .3s ${EASE_OUT}}
.he2-cue:hover i,.he2-cue:focus-visible i{transform:scaleY(1.3)}
.he2-cue:focus-visible{outline:1px solid var(--foil);outline-offset:2px}
.he2[data-go] .he2-cue{animation:he2-fade ${S.cue.ms}ms ${EASE_OUT} ${S.cue.at}ms both}

@keyframes he2-fade{from{opacity:0}to{opacity:1}}
@keyframes he2-fadeout{to{opacity:0}}
@keyframes he2-push{to{opacity:0;transform:scale(1.5)}}
@keyframes he2-banner{from{opacity:0;transform:scale(1.14)}to{opacity:1;transform:none}}
@keyframes he2-enter{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:none}}
@keyframes he2-flap{to{transform:rotateX(-180deg)}}
@keyframes he2-z{0%{z-index:4}50%{z-index:0}100%{z-index:0}}
@keyframes he2-seal{to{opacity:0;transform:translate(-50%,-62%) scale(.9)}}
@keyframes he2-card{from{transform:translateY(0) scale(.64) rotate(1.6deg)}to{transform:translateY(calc(var(--ew) * -.53)) scale(1) rotate(0)}}
@keyframes he2-type{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes he2-rule{from{opacity:0;transform:scaleX(.2)}to{opacity:1;transform:none}}
@keyframes he2-relax{from{opacity:.55}to{opacity:.4}}
@keyframes he2-drift{from{transform:translate(-3%,-1%)}to{transform:translate(4%,2%)}}
@media (prefers-reduced-motion:reduce){.he2 *{animation-duration:.01ms!important;animation-delay:0s!important;animation-iteration-count:1!important}.he2-light{display:none}}
`;

/** Inline delay for the n-th text element. */
export const typeDelay = (index: number) => `${typeStart(index)}ms`;
