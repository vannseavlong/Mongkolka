import type { CSSProperties } from "react";

/** An original pastel storybook castle: three roofed towers, a scalloped wall, an arched door, lit windows and pennants. */
export function Castle({ width = 300, className, style, roof = "#ff7a9c", door = "#c82a62" }: { width?: number; className?: string; style?: CSSProperties; roof?: string; door?: string }) {
  return (
    <svg width={width} height={(width * 250) / 300} viewBox="0 0 300 250" aria-hidden focusable="false" className={className} style={style}>
      <defs>
        <linearGradient id="kd-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffe6ef" />
        </linearGradient>
        <linearGradient id="kd-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff7c9" />
          <stop offset="1" stopColor="#ffd78a" />
        </linearGradient>
      </defs>
      {/* back turrets */}
      <g>
        <rect x="8" y="150" width="34" height="86" fill="url(#kd-wall)" />
        <path d="M2 150 25 98 48 150Z" fill="#ffc9a8" />
        <rect x="258" y="150" width="34" height="86" fill="url(#kd-wall)" />
        <path d="M252 150 275 98 298 150Z" fill="#bdebdd" />
      </g>
      {/* wall with scallops */}
      <rect x="34" y="176" width="232" height="60" fill="url(#kd-wall)" />
      <path d="M34 176h232M34 176v-8h12v8h12v-8h12v8h12v-8h12v8h12v-8h12v8m0 0" fill="none" stroke="none" />
      <g fill="url(#kd-wall)">
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x={40 + i * 22.5} y="166" width="14" height="14" rx="3" />
        ))}
      </g>
      {/* side towers */}
      <rect x="52" y="108" width="52" height="128" fill="url(#kd-wall)" />
      <path d="M44 110 78 44 112 110Z" fill="#c9b6ee" />
      <path d="M44 110q8.5 8 17 0t17 0t17 0t17 0" fill="#b9a3e6" />
      <rect x="196" y="108" width="52" height="128" fill="url(#kd-wall)" />
      <path d="M188 110 222 44 256 110Z" fill="#9fe0cb" />
      <path d="M188 110q8.5 8 17 0t17 0t17 0t17 0" fill="#86d3bb" />
      {/* keep */}
      <rect x="104" y="92" width="92" height="144" fill="url(#kd-wall)" />
      <path d="M92 96 150 14 208 96Z" fill={roof} />
      <path d="M92 96q9.7 9 19.3 0t19.3 0t19.3 0t19.3 0t19.3 0t19.3 0" fill="#ff6584" opacity=".75" />
      <path d="M150 14V-2" stroke="#b07a8c" strokeWidth="2" />
      <path d="M150 0l24 7-24 7Z" fill="#f6c453" />
      <circle cx="150" cy="40" r="7" fill="url(#kd-glow)" stroke="#fff" strokeWidth="2" />
      {/* tower pennants */}
      <path d="M78 44V28" stroke="#b07a8c" strokeWidth="2" />
      <path d="M78 28l16 5-16 5Z" fill="#ff8fb0" />
      <path d="M222 44V28" stroke="#b07a8c" strokeWidth="2" />
      <path d="M222 28l16 5-16 5Z" fill="#8fd9c2" />
      {/* windows */}
      <g fill="url(#kd-glow)" stroke="#fff" strokeWidth="2">
        <path d="M70 140v-12a8 8 0 0 1 16 0v12Z" />
        <path d="M214 140v-12a8 8 0 0 1 16 0v12Z" />
        <path d="M141 82v-14a9 9 0 0 1 18 0v14Z" transform="translate(0 40)" />
        <path d="M20 200v-10a5 5 0 0 1 10 0v10Z" />
        <path d="M270 200v-10a5 5 0 0 1 10 0v10Z" />
      </g>
      {/* door */}
      <path d="M128 236v-40a22 22 0 0 1 44 0v40Z" fill={door} />
      <path d="M134 236v-38a16 16 0 0 1 32 0v38Z" fill="#ff8fb0" opacity=".55" />
      <path d="M150 182v54" stroke="#fff" strokeWidth="1.6" opacity=".7" />
      <circle cx="160" cy="216" r="2.2" fill="#f6c453" />
      {/* ground tufts */}
      <ellipse cx="150" cy="240" rx="150" ry="9" fill="#d8f2e6" />
    </svg>
  );
}
