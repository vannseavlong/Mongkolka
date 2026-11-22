import type { Theme } from "../../../types";
import { withAlpha } from "../../../chrome/gold";
import { scatterSparkles } from "../kids-logic";
import { KIDS_CSS } from "../kids-styles";
import { kidsPalette } from "./palette";
import { Cloud, Sparkle, Star } from "./Scenery";

/**
 * Layered scene behind every shared Khmer section in the kids skin: pastel blobs, a cloud bank along
 * the top and bottom edges, polka dots and a few twinkling stars. Positions come from the section id,
 * so each section has its own sky but server and client markup match. Decorative only (aria-hidden).
 */
export function KidsBackdrop({ theme, id }: { theme: Theme; id?: string }) {
  const pal = kidsPalette(theme);
  const tones = [pal.rose, pal.gold, pal.berry];
  const stars = scatterSparkles(id ?? "kids", 9);
  const flip = (id ?? "").length % 2 === 0;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <style href="mk-kids-css" precedence="mk-kids">
        {KIDS_CSS}
      </style>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            `radial-gradient(60% 34% at ${flip ? "88%" : "12%"} 8%, ${withAlpha(pal.mint, 0.75)}, transparent 72%)`,
            `radial-gradient(56% 30% at ${flip ? "10%" : "90%"} 46%, ${withAlpha(pal.lavender, 0.6)}, transparent 72%)`,
            `radial-gradient(64% 30% at ${flip ? "84%" : "16%"} 92%, ${withAlpha(pal.peach, 0.8)}, transparent 72%)`,
            `radial-gradient(${withAlpha(pal.rose, 0.16)} 2.2px, transparent 2.6px)`,
          ].join(", "),
          backgroundSize: "auto, auto, auto, 26px 26px",
        }}
      />
      <Cloud fill="#fff" shade={withAlpha(pal.rose, 0.18)} width={190} className="kd-drift absolute -top-5 -left-6 opacity-90" />
      <Cloud fill="#fff" shade={withAlpha(pal.lavender, 0.6)} width={150} className="kd-drift absolute -top-3 right-[-34px] opacity-90" style={{ animationDelay: "-12s" }} />
      <Cloud fill="#fff" shade={withAlpha(pal.mint, 0.8)} width={210} className="kd-drift absolute -bottom-9 left-[-30px] opacity-95" style={{ animationDelay: "-20s" }} />
      <Cloud fill="#fff" shade={withAlpha(pal.peach, 0.9)} width={170} className="kd-drift absolute -bottom-7 right-[-24px] opacity-95" style={{ animationDelay: "-5s" }} />
      {stars.map((s, i) => {
        const color = tones[s.tone % tones.length]!;
        const Shape = i % 3 === 0 ? Star : Sparkle;
        return (
          <Shape key={i} color={color} size={s.size} className="kd-twinkle absolute" style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.delay}s`, opacity: 0.55 }} />
        );
      })}
    </div>
  );
}
