"use client";

import type { CSSProperties } from "react";
import { DockIcon, GoldDefs } from "./dock-icons";
import type { DockIconName } from "./dock-items";

export interface DockButton {
  key: string;
  icon: DockIconName;
  label: string;
}

export interface DockProps {
  items: DockButton[];
  activeKey: string | null;
  navLabel: string;
  vars: CSSProperties;
  lang: string;
  /** "wide": frosted glass bar across most of the screen. */
  variant?: "wide";
  onSelect: (key: string) => void;
}

/** Bottom glass dock: gold hairline ring, frosted blur, gold line icons, a glow behind the current section. */
export function Dock({ items, activeKey, navLabel, vars, lang, variant, onSelect }: DockProps) {
  return (
    <>
      <nav className={`mk-dock mk-gold-ring${variant === "wide" ? " mk-dock--wide" : ""}`} style={vars} aria-label={navLabel} data-mk-lang={lang}>
        <GoldDefs />
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className="mk-dock-btn"
            aria-current={item.key === activeKey ? "true" : undefined}
            onClick={() => onSelect(item.key)}
          >
            <DockIcon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      {/* Room at the end of the page so the fixed dock never covers the footer. */}
      <div aria-hidden style={{ height: 92 }} />
    </>
  );
}
