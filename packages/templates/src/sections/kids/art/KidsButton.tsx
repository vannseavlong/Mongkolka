import type { CSSProperties, ReactNode } from "react";
import type { Theme } from "../../../types";
import { ROUNDED_FONT } from "../../../chrome/fonts";
import { mixHex, withAlpha } from "../../../chrome/gold";

interface Props {
  theme: Theme;
  children: ReactNode;
  onClick?: () => void;
  /** An https link; renders an anchor that opens in a new tab. */
  href?: string;
  /** Gentle breathing pulse (the opening's call to action). */
  pulse?: boolean;
  /** Marks the primary "open the invitation" action so the shared chrome can start the music from it. */
  primaryOpen?: boolean;
  disabled?: boolean;
}

/** The kids skin's pill button: berry gradient, white bubbly label, a chunky 3D edge that presses down. */
export function KidsButton({ theme, children, onClick, href, pulse, primaryOpen, disabled }: Props) {
  const berry = theme.accent_color;
  const style = {
    backgroundImage: `linear-gradient(180deg, ${mixHex(berry, "#ff7a96", 40)} 0%, ${berry} 100%)`,
    color: "#fff",
    fontFamily: ROUNDED_FONT,
    border: "3px solid rgba(255,255,255,.85)",
    textShadow: "0 1px 2px rgba(110,10,50,.45)",
    ["--kd-btn-shade" as string]: mixHex(berry, "#3a0618", 70),
    ["--kd-btn-glow" as string]: withAlpha(berry, 0.55),
    boxShadow: `0 10px 0 -2px ${mixHex(berry, "#3a0618", 70)}, 0 16px 26px -10px ${withAlpha(berry, 0.55)}`,
  } as CSSProperties;
  const cls = `kd-btn ${pulse ? "kd-pop " : ""}inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-9 py-3.5 text-lg font-bold no-underline`;
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cls} style={style} {...(primaryOpen ? { "data-mk-open": "" } : {})}>
      {children}
    </button>
  );
}
