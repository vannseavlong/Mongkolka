/**
 * Covenant cover CSS (injected once, like the opening's). Transform and opacity only. The scene is a fixed
 * overlay: it plays, then `.is-reveal` fades it away over the opening gate that mounts beneath.
 * Every animation is off under reduced motion (the scene is shown still).
 */
export const COVENANT_COVER_CSS = `
.cvc{position:fixed;inset:0;z-index:60;overflow:hidden;display:flex;align-items:center;justify-content:center;text-align:center;cursor:pointer;background:radial-gradient(80% 70% at 50% 42%,var(--cv-ground),var(--cv-wash));transition:opacity var(--rv) ease var(--rvd)}
.cvc.is-reveal{opacity:0;pointer-events:none}
.cvc-frame{position:absolute;inset:14px;border:1.5px solid var(--cv-mid);opacity:.55;animation:cvc-fade 1.4s ease-out both}
.cvc-frame.in{inset:24px;opacity:.3}
.cvc-names{position:relative;z-index:3;display:flex;flex-direction:column;align-items:center;gap:6px;padding:0 28px;max-width:min(92vw,460px);transition:opacity .6s ease,transform .8s ease}
.cvc.is-reveal .cvc-names{opacity:0;transform:scale(1.06)}
.cvc-rise{animation:cvc-rise 1.4s cubic-bezier(.2,.8,.2,1) var(--at,0ms) both}
.cvc-hint{position:absolute;left:0;right:0;bottom:calc(16px + env(safe-area-inset-bottom));z-index:3;margin:0;font-size:12px;letter-spacing:.08em;opacity:.55;pointer-events:none}
.cvc-bf{position:absolute;z-index:2;transform:translate(-50%,-50%) rotate(var(--rot));animation:cvc-arrive 2.2s cubic-bezier(.25,.7,.3,1) var(--t) both}
.cvc-bf-in{width:100%;height:100%;animation:cvc-bob 3.2s ease-in-out var(--t) infinite alternate}
.cvc-bf .cv-wings{transform-box:view-box;transform-origin:50% 50%;animation:cvc-flap .42s ease-in-out infinite alternate}
.cvc.is-reveal .cvc-bf{animation:cvc-away 1.1s cubic-bezier(.5,0,.9,.4) var(--away) both}
.cvc-fl{position:absolute;z-index:1;transform:translate(-50%,-50%);animation:cvc-bloom 1.6s cubic-bezier(.2,.9,.3,1.2) var(--t) both}
.cvc-fl-in{width:100%;height:100%;animation:cvc-spin 24s linear infinite}
.cvc.is-reveal .cvc-fl{animation:cvc-burst 1s ease-in var(--away) both}
.cvc.is-still *{animation:none!important}
.cvc.is-still .cvc-bf,.cvc.is-still .cvc-fl{opacity:1}
@keyframes cvc-fade{from{opacity:0}}
@keyframes cvc-rise{from{opacity:0;transform:translateY(14px)}}
@keyframes cvc-flap{from{transform:scaleX(1)}to{transform:scaleX(.28)}}
@keyframes cvc-bob{from{transform:translateY(-7px) rotate(-3deg)}to{transform:translateY(7px) rotate(3deg)}}
@keyframes cvc-arrive{from{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) rotate(calc(var(--rot) - 40deg)) scale(.5)}60%{opacity:1}to{opacity:1;transform:translate(-50%,-50%) rotate(var(--rot)) scale(1)}}
@keyframes cvc-away{to{opacity:0;transform:translate(calc(-50% + var(--dx) * .6),-160vh) rotate(calc(var(--rot) + 25deg)) scale(.8)}}
@keyframes cvc-bloom{from{opacity:0;transform:translate(-50%,-50%) scale(0) rotate(-90deg)}to{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(0)}}
@keyframes cvc-spin{to{transform:rotate(360deg)}}
@keyframes cvc-burst{to{opacity:0;transform:translate(-50%,-50%) scale(1.7)}}
@media (prefers-reduced-motion:reduce){.cvc *{animation:none!important}.cvc-bf,.cvc-fl{opacity:1!important}}
`;
