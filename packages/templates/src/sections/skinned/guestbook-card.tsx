"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Theme } from "../../types";
import { withAlpha } from "../../chrome/gold";
import { useSkinOrnaments } from "../khmer/skin-context";
import { mediaFor } from "./gallery-media";

const CORNER = 46;
const POS: Array<{ key: string; style: CSSProperties }> = [
  { key: "tl", style: { top: 6, left: 6 } },
  { key: "tr", style: { top: 6, right: 6, transform: "scaleX(-1)" } },
  { key: "bl", style: { bottom: 6, left: 6, transform: "scaleY(-1)" } },
  { key: "br", style: { bottom: 6, right: 6, transform: "scale(-1,-1)" } },
];

/** The skin's ornate card (surface, pin-stripe, corner ornaments) that holds the guest form. */
export function SkinCard({ theme, className = "", children }: { theme: Theme; className?: string; children: ReactNode }) {
  const sk = useSkinOrnaments();
  const pad = mediaFor(sk).cardPad;
  return (
    <div className={`relative mx-auto w-full max-w-xl text-left ${className}`.trim()} style={{ borderRadius: sk.radius, color: theme.text_color, ...sk.surface(theme) }}>
      {sk.inset > 0 && (
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{ inset: sk.inset, borderRadius: Math.max(0, sk.radius - sk.inset), border: `1px solid ${withAlpha(theme.accent_color, 0.3)}` }}
        />
      )}
      {sk.corners &&
        POS.map((c) => (
          <div key={c.key} aria-hidden className="pointer-events-none absolute" style={c.style}>
            <sk.Corner color={theme.accent_color} size={CORNER} />
          </div>
        ))}
      <div className="relative px-6 py-14 sm:px-10" style={{ paddingTop: pad?.top, paddingBottom: pad?.bottom }}>
        {children}
      </div>
    </div>
  );
}
