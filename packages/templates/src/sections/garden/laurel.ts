export interface LaurelLeaf {
  x: number;
  y: number;
  rot: number;
}

/**
 * Positions of laurel leaves for the crest: `perSide` leaves along each half of a circle of radius
 * `r`, from the bottom up to just short of the crown, each turned to follow the circle. Pure.
 */
export function laurel(perSide: number, r: number): LaurelLeaf[] {
  const out: LaurelLeaf[] = [];
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < perSide; i++) {
      const t = (i + 0.5) / perSide; // 0 bottom .. 1 crown
      const a = (Math.PI / 2) + side * t * (Math.PI * 0.88); // radians from the +x axis; start at the bottom (pi/2)
      const x = r * Math.cos(a) * 1;
      const y = r * Math.sin(a);
      const tangent = (a * 180) / Math.PI + (side === 1 ? 90 : -90);
      out.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, rot: Math.round(tangent) });
    }
  }
  return out;
}
