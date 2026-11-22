import type { CSSProperties, ReactNode } from "react";

/** One small winged pixie facing right (mirrored for the left side). Original drawing; wings flutter via `kd-flap`. */
function Pixie({ hair, dress, flip, delay = 0 }: { hair: string; dress: string; flip?: boolean; delay?: number }) {
  return (
    <svg width="46" height="62" viewBox="0 0 60 80" aria-hidden focusable="false" style={{ transform: flip ? "scaleX(-1)" : undefined, overflow: "visible" }}>
      <g className="kd-flap" style={{ animationDelay: `${delay}s` }}>
        <ellipse cx="22" cy="30" rx="15" ry="9" transform="rotate(-28 22 30)" fill="#fff" opacity=".78" />
        <ellipse cx="25" cy="42" rx="12" ry="7" transform="rotate(18 25 42)" fill="#e8f7ff" opacity=".75" />
      </g>
      <path d="M26 38h14l5 26H21Z" fill={dress} />
      <path d="M22 64q4 5 8 0t8 0t7 0" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".8" />
      <rect x="30" y="60" width="4" height="12" rx="2" fill="#ffd2bd" />
      <rect x="37" y="60" width="4" height="12" rx="2" fill="#ffd2bd" />
      <circle cx="33" cy="26" r="13" fill="#ffe3d0" />
      <circle cx="39" cy="12" r="7" fill={hair} />
      <path d="M20 26a13 13 0 0 1 26-3q-8-2-13-9-4 7-13 12Z" fill={hair} />
      <circle cx="37" cy="28" r="1.9" fill="#4a1226" />
      <circle cx="28.5" cy="28" r="1.9" fill="#4a1226" />
      <ellipse cx="42" cy="33" rx="3" ry="1.9" fill="#ff8fb0" opacity=".6" />
      <path d="M31 33q2.6 2.6 5 0" fill="none" stroke="#4a1226" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M45 46 58 38" stroke="#ffe3d0" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

/** Two pixies carry a ribbon banner between them; the text is HTML so the Khmer/English font wraps naturally. */
export function PixieBanner({ children, ribbon = "#ff7a9c", ribbonShade = "#e0587f", color = "#fff", style }: { children: ReactNode; ribbon?: string; ribbonShade?: string; color?: string; style?: CSSProperties }) {
  return (
    <div className="kd-hover relative mx-auto flex w-full max-w-[22rem] items-center justify-center" style={style}>
      <div className="relative z-10 -mr-2 shrink-0">
        <Pixie hair="#8a5cd0" dress="#bdebdd" />
      </div>
      <div className="relative min-w-0 flex-1">
        <svg viewBox="0 0 220 56" preserveAspectRatio="none" width="100%" height="56" aria-hidden focusable="false" className="absolute inset-0 h-full w-full">
          <path d="M8 8Q110 20 212 8V44Q110 56 8 44Z" fill={ribbon} />
          <path d="M8 8Q110 20 212 8V16Q110 28 8 16Z" fill="#fff" opacity=".22" />
          <path d="M0 14l8-6v36l-8-6 5-6Z" fill={ribbonShade} />
          <path d="M220 14l-8-6v36l8-6-5-6Z" fill={ribbonShade} />
        </svg>
        <p className="relative m-0 flex min-h-14 items-center justify-center px-4 text-center text-[13px] font-bold leading-tight" style={{ color, textShadow: "0 1px 2px rgba(120,20,60,.35)" }}>
          {children}
        </p>
      </div>
      <div className="relative z-10 -ml-2 shrink-0">
        <Pixie hair="#ff9fb8" dress="#d9c8f0" flip delay={0.35} />
      </div>
    </div>
  );
}
