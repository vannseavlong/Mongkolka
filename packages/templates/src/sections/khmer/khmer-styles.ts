/** CSS for the shared Khmer sections. Class prefix `kh-`. Only transform/opacity are animated; reduced motion turns it all off. */
export const KHMER_CSS = `
.kh-float{animation:kh-float 7s ease-in-out infinite;will-change:transform}
@keyframes kh-float{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-5px,0)}}
.kh-sweep{position:relative;overflow:hidden}
.kh-sweep::after{content:"";position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(100deg,transparent 36%,rgba(255,255,255,.34) 50%,transparent 64%);
  transform:translate3d(-130%,0,0);animation:kh-sweep 6s ease-in-out infinite}
@keyframes kh-sweep{0%,55%{transform:translate3d(-130%,0,0)}100%{transform:translate3d(130%,0,0)}}
.kh-pulse{animation:kh-pulse 2.4s ease-in-out infinite}
@keyframes kh-pulse{0%,100%{opacity:1}50%{opacity:.62}}
.kh-btn{transition:transform .2s ease,box-shadow .2s ease}
.kh-btn:hover{transform:translateY(-1px)}
.kh-btn:active{transform:scale(.97)}
.kh-btn:focus-visible{outline:2px solid currentColor;outline-offset:3px}
@media (prefers-reduced-motion:reduce){
  .kh-float,.kh-pulse{animation:none}
  .kh-sweep::after{animation:none;display:none}
  .kh-btn{transition:none}
}
`;
