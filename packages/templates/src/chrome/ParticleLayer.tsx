"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import type { ParticleDensity, ParticleKind } from "./config";
import { buildParticles, isLowPowerDevice, particleCount, type Particle } from "./particles";
import { ButterflyShape, PetalShape } from "./particle-shapes";
import { usePageVisible } from "./use-page-visible";

export interface ParticleLayerProps {
  kinds: ParticleKind[];
  density: ParticleDensity;
  /** CSS colors cycled over the particles. */
  colors: string[];
  seed?: number;
}

const CLASS_BY_KIND: Record<ParticleKind, string> = {
  petals: "mk-petal",
  dust: "mk-dust",
  bokeh: "mk-bokeh",
  butterflies: "mk-butterfly",
};

function ParticleItem({ p, color }: { p: Particle; color: string }) {
  const style = {
    "--x": `${p.x}%`,
    "--s": `${p.size}px`,
    "--d": `${p.duration}s`,
    "--delay": `${p.delay}s`,
    "--drift": `${p.drift}px`,
    "--rot": `${p.rotate}deg`,
    "--o": p.opacity,
    "--dy": `${(p.id * 13) % 31 - 15}vh`,
    "--y": `${(p.id * 37) % 80 + 5}%`,
    "--c": color,
  } as CSSProperties;
  return (
    <span className={`mk-p ${CLASS_BY_KIND[p.kind]}`} style={style} data-flip={p.kind === "butterflies" ? String(p.flip) : undefined}>
      {p.kind === "petals" ? <PetalShape /> : p.kind === "butterflies" ? <ButterflyShape /> : <i />}
    </span>
  );
}

/**
 * Ambient field of petals / butterflies / gold dust / bokeh, behind a pointer-events:none layer.
 * Built after mount from a fixed seed (so server markup is empty and hydration matches), capped
 * by screen width and device power, paused while the tab is hidden, and absent under reduced motion.
 */
export function ParticleLayer({ kinds, density, colors, seed = 20260529 }: ParticleLayerProps) {
  const reduced = useReducedMotion();
  const visible = usePageVisible();
  const [particles, setParticles] = useState<Particle[]>([]);
  const kindKey = kinds.join("|");

  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowPower = isLowPowerDevice({ hardwareConcurrency: nav.hardwareConcurrency, deviceMemory: nav.deviceMemory });
    const list = kindKey.split("|") as ParticleKind[];
    setParticles(
      list.flatMap((kind, i) =>
        buildParticles(kind, particleCount(kind, { viewportWidth: window.innerWidth, density, lowPower }), seed + i * 101, colors.length),
      ),
    );
  }, [kindKey, density, seed, colors.length]);

  if (reduced !== false || particles.length === 0) return null;

  return (
    <div className="mk-particles" aria-hidden data-paused={visible ? "false" : "true"}>
      {particles.map((p) => (
        <ParticleItem key={`${p.kind}-${p.id}`} p={p} color={colors[p.colorIndex] ?? colors[0] ?? "currentColor"} />
      ))}
    </div>
  );
}
