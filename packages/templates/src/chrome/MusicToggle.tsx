"use client";

import type { CSSProperties } from "react";
import type { MusicCorner, MusicIcon } from "./config";
import type { MusicStatus } from "./audio";

export interface MusicToggleProps {
  status: MusicStatus;
  icon: MusicIcon;
  corner: MusicCorner;
  /** Ready-to-read label for the current action ("Play music" / "Pause music"). */
  label: string;
  vars: CSSProperties;
  lang: string;
  onToggle: () => void;
}

function Disc() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden focusable="false">
      <g className="mk-disc">
        <circle cx="16" cy="16" r="14" fill="currentColor" fillOpacity=".18" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeOpacity=".4" strokeWidth=".6" />
        <circle cx="16" cy="16" r="8.6" fill="none" stroke="currentColor" strokeOpacity=".4" strokeWidth=".6" />
        <path d="M6.6 11.4A10.6 10.6 0 0 1 14 5.6" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="16" cy="16" r="5" fill="currentColor" />
        <circle cx="16" cy="16" r="1.2" fill="var(--mk-glass-solid)" />
      </g>
    </svg>
  );
}

function Waves() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden focusable="false">
      <g className="mk-eq" fill="currentColor">
        <rect x="6.5" y="10" width="3.2" height="14" rx="1.6" />
        <rect x="12" y="6" width="3.2" height="18" rx="1.6" />
        <rect x="17.5" y="9" width="3.2" height="15" rx="1.6" />
        <rect x="23" y="12" width="3.2" height="12" rx="1.6" />
      </g>
    </svg>
  );
}

/** Round gold-ringed glass button: a spinning record or an equalizer, with a slash while muted. */
export function MusicToggle({ status, icon, corner, label, vars, lang, onToggle }: MusicToggleProps) {
  const playing = status === "playing";
  return (
    <button
      type="button"
      className="mk-music mk-gold-ring"
      style={vars}
      data-state={playing ? "playing" : "off"}
      data-corner={corner}
      data-hint={status === "idle" || status === "blocked" ? "true" : "false"}
      data-mk-lang={lang}
      aria-label={label}
      aria-pressed={playing}
      onClick={onToggle}
    >
      {icon === "waves" ? <Waves /> : <Disc />}
      <svg viewBox="0 0 32 32" aria-hidden focusable="false" style={{ position: "absolute", inset: 8, width: 30, height: 30, pointerEvents: "none" }}>
        <g className="mk-slash" strokeLinecap="round">
          <path d="M7 25.5 25 6.5" stroke="rgba(0,0,0,.55)" strokeWidth="3.4" />
          <path d="M7 25.5 25 6.5" stroke="currentColor" strokeWidth="1.7" />
        </g>
      </svg>
    </button>
  );
}
