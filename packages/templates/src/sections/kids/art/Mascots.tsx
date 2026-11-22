import type { CSSProperties } from "react";

/**
 * Three original chibi mascots drawn for this template: a bunny princess, an owlet in a party hat and a
 * bear cub with a birthday cake. Layered SVG; the eyes carry `kd-blink`, the cake flame `kd-flame`, and
 * the whole figure bobs through `kd-bob` (set by the caller). Nothing here follows any third-party character.
 */

interface MascotProps {
  width?: number;
  className?: string;
  style?: CSSProperties;
  /** Ink colour for eyes and mouth (the theme text colour). */
  ink?: string;
  /** Cheek and accent colour. */
  blush?: string;
}

const INK = "#4a1226";

function Eye({ cx, cy, rx = 5.5, ry = 7, ink }: { cx: number; cy: number; rx?: number; ry?: number; ink: string }) {
  return (
    <g className="kd-blink">
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={ink} />
      <circle cx={cx - rx * 0.32} cy={cy - ry * 0.38} r={rx * 0.42} fill="#fff" />
      <circle cx={cx + rx * 0.36} cy={cy + ry * 0.34} r={rx * 0.2} fill="#fff" opacity=".85" />
    </g>
  );
}

export function BunnyPrincess({ width = 140, className, style, ink = INK, blush = "#ff8fb0" }: MascotProps) {
  return (
    <svg width={width} height={(width * 170) / 140} viewBox="0 0 140 170" aria-hidden focusable="false" className={className} style={style}>
      <defs>
        <radialGradient id="kd-b-head" cx="40%" cy="30%" r="80%">
          <stop offset="0" stopColor="#fff0f5" />
          <stop offset="1" stopColor="#ffb7cc" />
        </radialGradient>
        <linearGradient id="kd-b-crown" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff1b0" />
          <stop offset=".55" stopColor="#f6c453" />
          <stop offset="1" stopColor="#d9962b" />
        </linearGradient>
      </defs>
      <ellipse cx="70" cy="166" rx="40" ry="4.5" fill="rgba(160,60,100,.16)" />
      <ellipse cx="42" cy="38" rx="12.5" ry="31" transform="rotate(-14 42 38)" fill="#ffc6d8" />
      <ellipse cx="42" cy="40" rx="6.4" ry="22" transform="rotate(-14 42 40)" fill={blush} opacity=".8" />
      <ellipse cx="99" cy="36" rx="12.5" ry="31" transform="rotate(20 99 36)" fill="#ffc6d8" />
      <ellipse cx="99" cy="38" rx="6.4" ry="22" transform="rotate(20 99 38)" fill={blush} opacity=".8" />
      <ellipse cx="70" cy="141" rx="27" ry="22" fill="#ffd9e5" />
      <ellipse cx="70" cy="145" rx="15.5" ry="13" fill="#fff6f9" />
      <ellipse cx="52" cy="161" rx="13" ry="7" fill="#ffc6d8" />
      <ellipse cx="88" cy="161" rx="13" ry="7" fill="#ffc6d8" />
      <ellipse cx="41" cy="139" rx="7" ry="11.5" transform="rotate(24 41 139)" fill="#ffc6d8" />
      <ellipse cx="99" cy="139" rx="7" ry="11.5" transform="rotate(-24 99 139)" fill="#ffc6d8" />
      <circle cx="70" cy="94" r="43" fill="url(#kd-b-head)" />
      <path d="M53 57 57 38 64 50 70 33 76 50 83 38 87 57Z" fill="url(#kd-b-crown)" stroke="#d9962b" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="70" cy="45" r="2.6" fill="#ff6584" />
      <circle cx="58.5" cy="50" r="1.8" fill="#8fd9c2" />
      <circle cx="81.5" cy="50" r="1.8" fill="#bda3f0" />
      <Eye cx={55} cy={96} ink={ink} />
      <Eye cx={85} cy={96} ink={ink} />
      <ellipse cx="44" cy="109" rx="8.5" ry="5.2" fill={blush} opacity=".55" />
      <ellipse cx="96" cy="109" rx="8.5" ry="5.2" fill={blush} opacity=".55" />
      <path d="M66 104Q70 100.5 74 104Q70 109 66 104Z" fill="#e8587f" />
      <path d="M63.5 111Q67 115 70 111Q73 115 76.5 111" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" />
      <path d="M104 70l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6Z" fill="#fff" opacity=".9" />
    </svg>
  );
}

export function OwletPartyHat({ width = 120, className, style, ink = INK, blush = "#ff8fb0" }: MascotProps) {
  return (
    <svg width={width} height={(width * 170) / 140} viewBox="0 0 140 170" aria-hidden focusable="false" className={className} style={style}>
      <defs>
        <linearGradient id="kd-o-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eadffa" />
          <stop offset="1" stopColor="#c3aae8" />
        </linearGradient>
        <linearGradient id="kd-o-hat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d3f5ea" />
          <stop offset="1" stopColor="#8fd9c2" />
        </linearGradient>
      </defs>
      <ellipse cx="70" cy="166" rx="38" ry="4.5" fill="rgba(110,70,170,.16)" />
      <path d="M40 68 45 44 58 62Z" fill="#b79fe0" />
      <path d="M100 68 95 44 82 62Z" fill="#b79fe0" />
      <ellipse cx="70" cy="104" rx="43" ry="55" fill="url(#kd-o-body)" />
      <ellipse cx="29" cy="113" rx="10.5" ry="27" transform="rotate(10 29 113)" fill="#b79fe0" />
      <ellipse cx="111" cy="113" rx="10.5" ry="27" transform="rotate(-10 111 113)" fill="#b79fe0" />
      <ellipse cx="70" cy="126" rx="26" ry="30" fill="#f6f0fe" />
      <path d="M56 114q4 5 8 0m4 0q4 5 8 0m-20 12q4 5 8 0m4 0q4 5 8 0m-12 12q4 5 8 0" fill="none" stroke="#cdbcf0" strokeWidth="2" strokeLinecap="round" />
      <circle cx="51" cy="86" r="18" fill="#fff" stroke="#b79fe0" strokeWidth="3" />
      <circle cx="89" cy="86" r="18" fill="#fff" stroke="#b79fe0" strokeWidth="3" />
      <Eye cx={52} cy={87} rx={8} ry={9} ink={ink} />
      <Eye cx={88} cy={87} rx={8} ry={9} ink={ink} />
      <path d="M64 100h12l-6 11Z" fill="#ffb27a" />
      <ellipse cx="38" cy="106" rx="7" ry="4.6" fill={blush} opacity=".5" />
      <ellipse cx="102" cy="106" rx="7" ry="4.6" fill={blush} opacity=".5" />
      <ellipse cx="56" cy="160" rx="10" ry="5.5" fill="#ffb27a" />
      <ellipse cx="84" cy="160" rx="10" ry="5.5" fill="#ffb27a" />
      <g transform="rotate(-9 70 56)">
        <path d="M70 6 50 56H90Z" fill="url(#kd-o-hat)" stroke="#6cc5a8" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M61 30 79 30M56 43 84 43" stroke="#ff8fb0" strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="70" cy="22" r="2.4" fill="#fff" opacity=".9" />
        <ellipse cx="70" cy="56" rx="22" ry="4.4" fill="#ff8fb0" />
        <circle cx="70" cy="6" r="6" fill="#f6c453" />
        <circle cx="68.4" cy="4.4" r="1.8" fill="#fff6c7" />
      </g>
    </svg>
  );
}

export function CubWithCake({ width = 120, className, style, ink = INK, blush = "#ff8fb0" }: MascotProps) {
  return (
    <svg width={width} height={(width * 170) / 140} viewBox="0 0 140 170" aria-hidden focusable="false" className={className} style={style}>
      <defs>
        <radialGradient id="kd-c-head" cx="40%" cy="30%" r="80%">
          <stop offset="0" stopColor="#ffeadb" />
          <stop offset="1" stopColor="#f6b98f" />
        </radialGradient>
        <linearGradient id="kd-c-flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3b0" />
          <stop offset="1" stopColor="#ffa94d" />
        </linearGradient>
      </defs>
      <ellipse cx="70" cy="167" rx="40" ry="4.5" fill="rgba(190,110,60,.18)" />
      <circle cx="36" cy="55" r="15" fill="#f2ad80" />
      <circle cx="36" cy="55" r="7.5" fill="#ffd8c2" />
      <circle cx="104" cy="55" r="15" fill="#f2ad80" />
      <circle cx="104" cy="55" r="7.5" fill="#ffd8c2" />
      <ellipse cx="70" cy="139" rx="31" ry="27" fill="#f6b98f" />
      <ellipse cx="70" cy="143" rx="19" ry="16" fill="#ffe4d2" />
      <circle cx="70" cy="84" r="41" fill="url(#kd-c-head)" />
      <ellipse cx="70" cy="99" rx="18" ry="14" fill="#fff1e6" />
      <ellipse cx="70" cy="93" rx="6.4" ry="4.6" fill="#7a3a2a" />
      <path d="M70 97v5M70 102q-5 5-9 1M70 102q5 5 9 1" fill="none" stroke="#7a3a2a" strokeWidth="2" strokeLinecap="round" />
      <Eye cx={54} cy={81} rx={5} ry={6.5} ink={ink} />
      <Eye cx={86} cy={81} rx={5} ry={6.5} ink={ink} />
      <ellipse cx="42" cy="97" rx="8" ry="5" fill={blush} opacity=".5" />
      <ellipse cx="98" cy="97" rx="8" ry="5" fill={blush} opacity=".5" />
      <ellipse cx="52" cy="165" rx="13" ry="6.5" fill="#f2ad80" />
      <ellipse cx="88" cy="165" rx="13" ry="6.5" fill="#f2ad80" />
      <rect x="47" y="147" width="46" height="19" rx="6" fill="#ff9fb8" />
      <rect x="53" y="134" width="34" height="15" rx="5" fill="#fff8f2" />
      <path d="M47 152q5.8 6 11.5 0t11.5 0t11.5 0t11.5 0" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M53 140q4.3 4 8.5 0t8.5 0t8.5 0t8.5 0" fill="none" stroke="#ff9fb8" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="67.6" y="120" width="4.8" height="15" rx="2.4" fill="#bdebdd" />
      <path className="kd-flame" d="M70 108c-4 4-4 8.6 0 10.6c4-2 4-6.6 0-10.6Z" fill="url(#kd-c-flame)" />
      <ellipse cx="46" cy="148" rx="8" ry="12.5" transform="rotate(-22 46 148)" fill="#f2ad80" />
      <ellipse cx="94" cy="148" rx="8" ry="12.5" transform="rotate(22 94 148)" fill="#f2ad80" />
    </svg>
  );
}
