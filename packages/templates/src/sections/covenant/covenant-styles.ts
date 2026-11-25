/**
 * All Covenant CSS in one place (injected once with React 19 `<style href precedence>`). Transform, opacity and
 * clip-path only, so it stays cheap on low-end phones; every animation is off under reduced motion.
 */
export const COVENANT_CSS = `
.cv-stage{position:relative;min-height:100svh;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:clamp(48px,9svh,96px) 34px;text-align:center;background:radial-gradient(75% 45% at 90% 4%,var(--cv-petal),transparent 70%),radial-gradient(70% 40% at 6% 96%,var(--cv-petal),transparent 70%),var(--cv-ground)}
.cv-petal{position:absolute;top:-28px;border-radius:80% 0 80% 0;background:radial-gradient(circle at 30% 30%,#fff,var(--cv-petal) 55%,var(--cv-rose));opacity:0;animation:cv-fall var(--d) linear var(--t) infinite;pointer-events:none}
.cv-line{position:absolute;background:linear-gradient(90deg,var(--cv-lo),var(--cv-hi),var(--cv-lo))}
.cv-line-h{height:1.5px;left:0;right:0}.cv-line-v{width:1.5px;top:0;bottom:0}
.cv-fr{position:absolute;pointer-events:none}
.cv-fr .t{top:0;transform-origin:0 50%;animation:cv-sx var(--ms) ease-out var(--at) both}
.cv-fr .r{right:0;transform-origin:50% 0;animation:cv-sy var(--ms) ease-out calc(var(--at) + var(--ms) * .25) both}
.cv-fr .b{bottom:0;transform-origin:100% 50%;animation:cv-sx var(--ms) ease-out calc(var(--at) + var(--ms) * .5) both}
.cv-fr .l{left:0;transform-origin:50% 100%;animation:cv-sy var(--ms) ease-out calc(var(--at) + var(--ms) * .75) both}
.cv-corner{position:absolute;opacity:0;animation:cv-pop .8s cubic-bezier(.2,.8,.2,1) calc(var(--at) + var(--ms) * .9) both}
.cv-content{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:clamp(12px,2.4svh,24px);max-width:min(92vw,460px);transition:opacity .5s ease,transform .5s ease}
.cv-wipe{animation:cv-wipe var(--ms) cubic-bezier(.3,.7,.2,1) var(--at) both}
.cv-in-l{animation:cv-from-l var(--ms) cubic-bezier(.2,.8,.2,1) var(--at) both}
.cv-in-r{animation:cv-from-r var(--ms) cubic-bezier(.2,.8,.2,1) var(--at) both}
.cv-amp{display:inline-block;animation:cv-amp var(--ms) cubic-bezier(.2,.9,.3,1.3) calc(var(--at) + var(--ms) * .35) both}
.cv-rise{animation:cv-rise var(--ms) cubic-bezier(.2,.8,.2,1) var(--at) both}
.cv-ready{animation:cv-rise .8s cubic-bezier(.2,.8,.2,1) both}
.cv-cta{cursor:pointer;border:0;border-radius:999px;padding:.9rem 1.9rem;line-height:1.6;color:var(--cv-cta-ink);background:linear-gradient(135deg,var(--cv-hi),var(--cv-mid) 50%,var(--cv-lo));box-shadow:0 12px 26px -10px var(--cv-glow),inset 0 1px 0 rgba(255,255,255,.55),0 0 0 1px var(--cv-lo);transition:transform .2s ease}
.cv-cta:hover{transform:translateY(-1px)}
.cv-cta:focus-visible{outline:2px solid var(--cv-mid);outline-offset:4px}
.cv-pulse{animation:cv-pulse 2.6s ease-in-out infinite}
.is-cross .is-cross .cv-content{opacity:0;transform:scale(.96)}
.cv-cross-draw{stroke-dasharray:1;stroke-dashoffset:1;animation:cv-draw 1.1s ease-out .1s forwards}
.cv-cross-fill{opacity:0;animation:cv-fillin .6s ease 1s forwards}
.cv-fluid svg{width:100%!important;height:100%!important}

.cv-hero{position:relative;min-height:100svh;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;text-align:center;color:#fff;background:linear-gradient(160deg,var(--cv-ground),var(--cv-petal))}
.cv-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 28%}
.cv-photo-full{opacity:0}
.is-reveal .cv-photo-full{opacity:1}
.cv-curtain{position:absolute;top:0;bottom:0;width:50.5%;z-index:4;pointer-events:none;background:repeating-linear-gradient(90deg,rgba(255,255,255,0) 0 12px,rgba(140,50,85,.16) 12px 20px,rgba(255,255,255,.2) 20px 28px,rgba(255,255,255,0) 28px 42px),linear-gradient(180deg,#f4bccb,#e8a3b8 55%,#f4bccb);box-shadow:inset 0 0 46px rgba(120,40,70,.28)}
.cv-curtain::before{content:"";position:absolute;left:0;right:0;top:0;height:12px;background:linear-gradient(90deg,var(--cv-lo),var(--cv-hi),var(--cv-lo));box-shadow:0 4px 8px rgba(0,0,0,.2)}
.cv-curtain-l{left:0;border-right:3px solid var(--cv-mid)}
.cv-curtain-r{right:0;border-left:3px solid var(--cv-mid)}
.is-reveal .cv-curtain-l{animation:cv-slide-l 2.1s cubic-bezier(.65,0,.25,1) .35s forwards}
.is-reveal .cv-curtain-r{animation:cv-slide-r 2.1s cubic-bezier(.65,0,.25,1) .35s forwards}
.cv-curtain-label{position:absolute;left:50%;top:46%;z-index:5;display:flex;flex-direction:column;align-items:center;gap:6px;width:min(78vw,420px);transform:translate(-50%,-50%);text-align:center;pointer-events:none;animation:cv-breathe 2.4s ease-in-out infinite}
.is-reveal .cv-curtain-label{animation:cv-label-out .7s ease forwards}
.cv-scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(60,20,36,.28) 0,transparent 26%,transparent 42%,rgba(52,16,32,.72) 100%);opacity:0}
.is-reveal .cv-scrim{animation:cv-fadein 1.2s ease 1.6s forwards}
.cv-hero-text{position:relative;z-index:2;padding:0 20px clamp(104px,16svh,150px);display:flex;flex-direction:column;align-items:center;gap:10px;max-width:min(92vw,720px)}
.cv-hero-text>*{opacity:0}
.is-reveal .cv-hero-text>*{animation:cv-rise 1.1s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(2.2s + var(--i) * .22s)}
.cv-scroll{position:absolute;bottom:clamp(18px,3svh,30px);left:50%;z-index:2;width:22px;height:36px;margin-left:-11px;border:1.5px solid rgba(255,255,255,.8);border-radius:12px;opacity:0}
.is-reveal .cv-scroll{animation:cv-fadein 1s ease 3s forwards}
.cv-scroll::after{content:"";position:absolute;left:50%;top:7px;width:3px;height:7px;margin-left:-1.5px;border-radius:2px;background:#fff;animation:cv-wheel 1.8s ease-in-out infinite}

.cv-verse{position:relative;z-index:3;margin-top:-56px;padding:0 16px 56px;background:linear-gradient(180deg,transparent 0,transparent 56px,var(--cv-ground) 56px)}
.cv-verse-card{position:relative;max-width:640px;margin:0 auto;padding:48px 24px 40px;border-radius:26px;text-align:center}
.cv-play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border:0;padding:0;cursor:pointer;background:transparent}
.cv-play-btn{display:flex;width:72px;height:72px;align-items:center;justify-content:center;border-radius:50%;background:linear-gradient(135deg,var(--cv-hi),var(--cv-mid) 50%,var(--cv-lo));box-shadow:0 0 0 8px rgba(255,255,255,.35),0 16px 30px -10px rgba(0,0,0,.45);transition:transform .2s ease}
.cv-play:hover .cv-play-btn{transform:scale(1.06)}
.cv-play:focus-visible .cv-play-btn{outline:3px solid #fff;outline-offset:4px}
.cv-link{display:inline-flex;min-height:48px;align-items:center;justify-content:center;gap:8px;padding:0 24px;border-radius:999px;text-decoration:none;font-weight:600;transition:transform .2s ease}
.cv-mosaic{grid-auto-rows:7.25rem}
@media (min-width:640px){.cv-mosaic{grid-auto-rows:10rem}}
.cv-tile{position:relative;display:block;overflow:hidden;padding:0;border:0;border-radius:18px;background:var(--cv-petal);cursor:zoom-in;-webkit-tap-highlight-color:transparent;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
.cv-tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.2,.8,.2,1)}
.cv-tile::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(60,20,36,.28));opacity:0;transition:opacity .3s ease}
.cv-tile:focus-visible{outline:2px solid var(--cv-mid);outline-offset:3px}
@media (hover:hover){.cv-tile:hover img{transform:scale(1.06)}.cv-tile:hover::after{opacity:1}}
@media (prefers-reduced-motion:reduce){.cv-tile,.cv-tile img{transition:none}.cv-tile:hover img{transform:none}}
.cv-link:hover{transform:translateY(-1px)}
.cv-link:focus-visible{outline:2px solid var(--cv-mid);outline-offset:3px}
.cv-wish{break-inside:avoid;position:relative;padding:22px 20px 18px;border-radius:22px;text-align:center}

.cv-lazy{position:relative;display:block;width:100%;overflow:hidden;background:linear-gradient(110deg,var(--cv-tint) 30%,var(--cv-tint-hi) 50%,var(--cv-tint) 70%);background-size:220% 100%;animation:cv-shimmer 1.5s linear infinite}
.cv-lazy>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transform:scale(1.05);filter:blur(12px);transition:opacity .7s ease,transform 1s cubic-bezier(.2,.8,.2,1),filter .7s ease;will-change:opacity,transform}
.cv-lazy-fill{position:absolute;inset:0;height:100%}
.cv-lazy[data-ready]{animation:none;background:var(--cv-tint)}
.cv-lazy[data-ready]>img{opacity:1;transform:none;filter:none}
.cv-photo-card{position:relative;overflow:hidden;text-decoration:none;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
.cv-photo-name{position:absolute;left:0;right:0;bottom:0;padding:22px 12px 9px;color:#fff;font-size:13px;text-align:left;overflow-wrap:anywhere;background:linear-gradient(180deg,transparent,rgba(50,16,30,.62))}
@media (hover:hover){.cv-photo-card:hover{transform:translateY(-3px)}}
.cv-photo-card:focus-visible{outline:2px solid var(--cv-mid,#b8892e);outline-offset:3px}
.cv-flow{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding:0 16px;padding:4px 16px 18px;scrollbar-width:none;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}
.cv-flow::-webkit-scrollbar{display:none}
.cv-flow-col{flex:0 0 min(62vw,17rem);display:flex;flex-direction:column;gap:12px;scroll-snap-align:start}
.cv-flow-col>.cv-tile{width:100%}
.cv-nav{display:inline-flex;width:44px;height:44px;align-items:center;justify-content:center;border-radius:50%;border:1px solid var(--cv-line,#d8b46a);background:#fff;color:var(--cv-ink,#8a6418);cursor:pointer;transition:transform .2s ease,opacity .2s ease}
.cv-nav:hover{transform:scale(1.06)}.cv-nav:disabled{opacity:.35;cursor:default;transform:none}
.cv-nav:focus-visible{outline:2px solid var(--cv-ink,#8a6418);outline-offset:3px}
.cv-bar{height:3px;border-radius:3px;background:rgba(0,0,0,.08);overflow:hidden}
.cv-bar>i{display:block;height:100%;border-radius:3px;background:var(--cv-ink,#8a6418);transition:width .3s ease}
.cv-feature{animation:cv-fade .55s ease both}
.cv-thumb{flex:0 0 auto;width:64px;padding:0;border:0;border-radius:12px;overflow:hidden;cursor:pointer;opacity:.6;background:none;transition:opacity .25s ease,transform .25s ease;-webkit-tap-highlight-color:transparent}
.cv-thumb[aria-current="true"]{opacity:1;transform:translateY(-3px)}
.cv-thumb:focus-visible{outline:2px solid var(--cv-ink,#8a6418);outline-offset:2px}
.cv-polaroid{display:block;width:100%;padding:8px 8px 26px;border:0;cursor:zoom-in;background:#fff;box-shadow:0 14px 24px -14px rgba(60,30,40,.55);transition:transform .35s cubic-bezier(.2,.8,.2,1)}
@media (hover:hover){.cv-polaroid:hover{transform:rotate(0deg) translateY(-4px)!important}}
.cv-polaroid:focus-visible{outline:2px solid var(--cv-ink,#8a6418);outline-offset:3px}
@keyframes cv-fade{from{opacity:0;transform:scale(.985)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.cv-flow{scroll-behavior:auto}.cv-feature{animation:none}.cv-thumb,.cv-polaroid,.cv-nav{transition:none}}
.cv-poster{animation:cv-kenburns 14s ease-in-out infinite alternate}
@keyframes cv-kenburns{from{transform:scale(1)}to{transform:scale(1.07)}}
@media (prefers-reduced-motion:reduce){.cv-poster{animation:none}}
@keyframes cv-shimmer{to{background-position:-220% 0}}
@media (prefers-reduced-motion:reduce){.cv-lazy{animation:none}.cv-lazy>img{transition:opacity .2s ease;transform:none;filter:none}}

@keyframes cv-fall{0%{opacity:0;transform:translate3d(0,-10px,0) rotate(var(--r))}10%{opacity:.85}100%{opacity:0;transform:translate3d(var(--x),108svh,0) rotate(calc(var(--r) + 320deg))}}
@keyframes cv-sx{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes cv-sy{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes cv-pop{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:scale(1)}}
@keyframes cv-wipe{from{opacity:.2;filter:blur(4px);clip-path:inset(-35% 100% -35% 0)}to{opacity:1;filter:none;clip-path:inset(-35% 0 -35% 0)}}
@keyframes cv-from-l{from{opacity:0;transform:translateX(-44px)}to{opacity:1;transform:none}}
@keyframes cv-from-r{from{opacity:0;transform:translateX(44px)}to{opacity:1;transform:none}}
@keyframes cv-amp{from{opacity:0;transform:scale(.1) rotate(-90deg)}to{opacity:1;transform:scale(1) rotate(0)}}
@keyframes cv-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes cv-pulse{0%,100%{box-shadow:0 12px 26px -10px var(--cv-glow),inset 0 1px 0 rgba(255,255,255,.55),0 0 0 1px var(--cv-lo),0 0 0 0 var(--cv-glow)}50%{box-shadow:0 12px 26px -10px var(--cv-glow),inset 0 1px 0 rgba(255,255,255,.55),0 0 0 1px var(--cv-lo),0 0 0 10px transparent}}
@keyframes cv-draw{to{stroke-dashoffset:0}}
@keyframes cv-fillin{to{opacity:1}}
@keyframes cv-turn{to{transform:rotate(360deg)}}
@keyframes cv-fadein{to{opacity:1}}
@keyframes cv-slide-l{to{transform:translateX(-103%)}}
@keyframes cv-slide-r{to{transform:translateX(103%)}}
@keyframes cv-breathe{0%,100%{opacity:.7}50%{opacity:1}}
@keyframes cv-label-out{to{opacity:0;transform:translate(-50%,-50%) scale(.96)}}
@keyframes cv-wheel{0%{opacity:0;transform:translateY(0)}30%{opacity:1}100%{opacity:0;transform:translateY(12px)}}
@media (prefers-reduced-motion:reduce){
.cv-petal,.cv-pulse,.cv-curtain-label,.cv-scroll::after,.cv-petal{display:none}
.cv-content,.cv-photo-full{opacity:1}.is-reveal .cv-photo-full,.is-reveal .cv-curtain-l,.is-reveal .cv-curtain-r,.is-reveal .cv-scrim,.is-reveal .cv-hero-text>*,.is-reveal .cv-scroll{animation:none}
}
`;

/** The invitation-card opening (card-art.tsx). Reuses the animation classes above. */
export const CARD_CSS = `
.cv-cardstage{position:relative;height:100svh;max-height:100svh;overflow:hidden;box-sizing:border-box;padding:12px;background:var(--cv-band);display:flex}
.cv-card{position:relative;flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:clamp(52px,9svh,84px) clamp(30px,9vw,64px);text-align:center;background:radial-gradient(90% 55% at 50% 0%,rgba(255,255,255,.9),transparent 70%),var(--cv-cream);box-shadow:0 0 0 2px var(--cv-lo),0 0 0 5px var(--cv-cream),0 0 0 6.5px var(--cv-mid);max-width:620px;margin:0 auto;width:100%}
.cv-card .cv-content{max-width:100%;gap:clamp(8px,1.6svh,16px)}
.cv-cardcorner{position:absolute;opacity:0;animation:cv-pop .9s cubic-bezier(.2,.8,.2,1) calc(var(--at) + var(--ms) * .8) both;pointer-events:none}
.cv-cardedge{position:absolute;left:50%;opacity:0;animation:cv-fadein 1s ease calc(var(--at) + var(--ms)) forwards;pointer-events:none}
.cv-guestbox{position:relative;width:100%;padding:clamp(14px,2.6svh,22px) 18px;border:1.5px solid var(--cv-mid);box-shadow:inset 0 0 0 4px var(--cv-cream),inset 0 0 0 5.5px var(--cv-mid);background:rgba(255,255,255,.55)}
.cv-petals{position:absolute;left:-30px;top:6%;bottom:6%;pointer-events:none;opacity:0;animation:cv-fadein 1.4s ease 1s forwards}
@media (prefers-reduced-motion:reduce){.cv-cardcorner,.cv-cardedge,.cv-petals{animation:none;opacity:1}}
`;
