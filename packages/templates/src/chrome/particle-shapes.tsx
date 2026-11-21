/**
 * Original particle artwork (inline SVG, `currentColor`). Inline rather than <use>: animations
 * inside a <use> shadow tree are unreliable in Safari, and the counts here are small.
 */

export function PetalShape() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden focusable="false">
      <path d="M10 1C14.6 4 17.2 9.2 14.3 14.7 12.9 17.4 11.1 18.8 10 19 8.9 18.8 7.1 17.4 5.7 14.7 2.8 9.2 5.4 4 10 1z" fill="currentColor" />
      <path d="M10 4.4v11" stroke="#fff" strokeOpacity=".4" strokeWidth=".7" strokeLinecap="round" fill="none" />
    </svg>
  );
}

const WING =
  "M16 11.2C13.4 4.4 6.6 1.6 3.8 4.4 1.9 6.4 3.9 11 8 12.4c-3.2 1.4-4.5 4.8-3 6.9C7.2 22 12.8 19.4 16 13.2z";

export function ButterflyShape() {
  return (
    <svg viewBox="0 0 32 24" aria-hidden focusable="false">
      <g className="mk-wing-l">
        <path d={WING} fill="currentColor" />
        <path d="M14.5 11C11 8.6 8 7.4 5.6 6.4" stroke="#fff" strokeOpacity=".35" strokeWidth=".7" fill="none" strokeLinecap="round" />
      </g>
      <g className="mk-wing-r">
        <g transform="translate(32 0) scale(-1 1)">
          <path d={WING} fill="currentColor" />
          <path d="M14.5 11C11 8.6 8 7.4 5.6 6.4" stroke="#fff" strokeOpacity=".35" strokeWidth=".7" fill="none" strokeLinecap="round" />
        </g>
      </g>
      <ellipse cx="16" cy="12.2" rx="1" ry="6.2" fill="currentColor" />
      <path d="M16 6.2c-.5-2-1.7-3.1-2.8-3.4M16 6.2c.5-2 1.7-3.1 2.8-3.4" stroke="currentColor" strokeWidth=".7" fill="none" strokeLinecap="round" />
    </svg>
  );
}
