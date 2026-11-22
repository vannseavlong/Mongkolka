import type { BackdropProps } from "../khmer/skin-ornament-types";
import { Cloud, Hydrangea, Sparkle, Sprig, SunRays } from "./art";
import { FairytaleStyles } from "./FairytaleStyles";
import { bloomsFor } from "./fairytale-logic";

const BOTTOM_HEADS = Array.from({ length: 9 }, (_, i) => ({ x: 20 + i * 45, y: 78 + (i % 2) * 6, r: 22 + (i % 3) * 3, seed: 5 + i * 3 }));

/**
 * Scene art behind every shared section: a sky wash with slow rays and clouds, hydrangea heads
 * along the bottom, blossoms spilling from the top corners and baby's-breath down both sides, so
 * the white card in the middle is framed on all four sides.
 */
export function Backdrop({ color, ground }: BackdropProps) {
  const blooms = bloomsFor(color, ground);
  return (
    <>
      <FairytaleStyles />
      <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(180deg, #d3e3f3 0%, #eaf4fb 24%, ${ground} 62%, #d3e3f3 100%)` }} />
      <div className="absolute inset-x-0 top-0 h-3/5 opacity-80">
        <SunRays opacity={0.5} />
      </div>
      <div className="ft-drift absolute left-[4%] top-[7%]">
        <Cloud width={110} opacity={0.85} />
      </div>
      <div className="ft-drift absolute right-[2%] top-[22%]" style={{ animationDirection: "alternate-reverse" }}>
        <Cloud width={84} opacity={0.7} />
      </div>
      <svg viewBox="0 0 400 100" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-0 w-full" style={{ height: 96 }} aria-hidden focusable="false">
        {BOTTOM_HEADS.map((h) => (
          <Hydrangea key={h.seed} x={h.x} y={h.y} r={h.r} blooms={blooms} seed={h.seed} count={10} />
        ))}
        <Sprig x={50} y={40} scale={0.5} rotate={-12} />
        <Sprig x={300} y={44} scale={0.5} rotate={14} />
      </svg>
      <svg viewBox="0 0 400 80" preserveAspectRatio="xMidYMin slice" className="absolute inset-x-0 top-0 w-full" style={{ height: 72 }} aria-hidden focusable="false">
        <Hydrangea x={8} y={6} r={30} blooms={blooms} seed={19} count={13} leaves={false} />
        <Hydrangea x={392} y={6} r={30} blooms={blooms} seed={29} count={13} leaves={false} />
        <Sprig x={44} y={-6} scale={0.5} rotate={-70} />
        <Sprig x={356} y={-6} scale={0.5} rotate={70} />
      </svg>
      <div className="ft-sway absolute left-0 top-[34%] hidden sm:block">
        <svg width="44" height="120" viewBox="0 0 60 80" aria-hidden focusable="false">
          <Sprig x={-6} y={0} />
        </svg>
      </div>
      <div className="ft-sway absolute right-0 top-[44%] hidden sm:block" style={{ transform: "scaleX(-1)" }}>
        <svg width="44" height="120" viewBox="0 0 60 80" aria-hidden focusable="false">
          <Sprig x={-6} y={0} />
        </svg>
      </div>
      <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden focusable="false">
        <Sparkle x={60} y={120} size={5} delay={0.4} />
        <Sparkle x={340} y={90} size={6} delay={1.3} />
        <Sparkle x={320} y={280} size={5} delay={2.1} />
        <Sparkle x={80} y={300} size={4} delay={0.9} />
      </svg>
    </>
  );
}
