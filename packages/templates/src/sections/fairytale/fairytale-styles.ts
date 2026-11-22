/**
 * Keyframes for the fairytale skin (ft-* classes). Transform/opacity only, so it stays cheap on
 * low-end phones; every animation is switched off under prefers-reduced-motion.
 */
export const FAIRYTALE_CSS = `
.ft-wing{transform-box:fill-box;transform-origin:100% 50%;animation:ft-flap 1.15s ease-in-out infinite}
@keyframes ft-flap{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.32)}}
.ft-float{animation:ft-float 6s ease-in-out infinite}
@keyframes ft-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
.ft-flutter{animation:ft-flutter 9s ease-in-out infinite}
@keyframes ft-flutter{0%,100%{transform:translate(0,0) rotate(-6deg)}25%{transform:translate(14px,-18px) rotate(8deg)}50%{transform:translate(4px,-30px) rotate(-4deg)}75%{transform:translate(-12px,-14px) rotate(10deg)}}
.ft-twinkle{animation:ft-twinkle 3.2s ease-in-out infinite}
@keyframes ft-twinkle{0%,100%{opacity:.25;transform:scale(.6)}50%{opacity:1;transform:scale(1.15)}}
.ft-drift{animation:ft-drift 38s linear infinite alternate}
@keyframes ft-drift{from{transform:translateX(-14px)}to{transform:translateX(26px)}}
.ft-rays{transform-origin:50% 0;animation:ft-rays 22s ease-in-out infinite alternate}
@keyframes ft-rays{from{transform:rotate(-3deg)}to{transform:rotate(3deg)}}
.ft-sway{transform-origin:50% 100%;animation:ft-sway 7s ease-in-out infinite alternate}
@keyframes ft-sway{from{transform:rotate(-1.6deg)}to{transform:rotate(1.6deg)}}
.ft-bokeh{animation:ft-bokeh 5s ease-in-out infinite}
@keyframes ft-bokeh{0%,100%{opacity:.15;transform:scale(.8)}50%{opacity:.55;transform:scale(1.15)}}
.ft-pop{transform-origin:50% 100%}
@media (prefers-reduced-motion:reduce){
  .ft-wing,.ft-float,.ft-flutter,.ft-twinkle,.ft-drift,.ft-rays,.ft-sway,.ft-bokeh{animation:none!important}
  .ft-twinkle{opacity:.8}
}
`;
