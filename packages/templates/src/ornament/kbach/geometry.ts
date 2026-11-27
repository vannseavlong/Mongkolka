/** Pure path math for the Khmer ornament. Floral and geometric motifs only: no figures or shrines. */

const f = (n: number) => Number(n.toFixed(2));

/** A pointed lotus petal standing on (x, y); negative height points it downwards. */
export function petalPath(x: number, y: number, width: number, height: number): string {
  const half = width / 2;
  return [
    `M${f(x)} ${f(y)}`,
    `C${f(x - half)} ${f(y - height * 0.15)} ${f(x - half)} ${f(y - height * 0.62)} ${f(x)} ${f(y - height)}`,
    `C${f(x + half)} ${f(y - height * 0.62)} ${f(x + half)} ${f(y - height * 0.15)} ${f(x)} ${f(y)}Z`,
  ].join("");
}

/** A flame leaf (phni phleung) rising from (0, 0): a fat base, an S-shaped back and a hooked tip. */
export const FLAME_PATH = "M0 0C-11-6-13-19-5-28C0-34 1-42-3-50C11-43 17-31 12-22C10-18 5-18 5-23C0-18 2-11 8-9C12-8 15-10 17-14C17-5 10 1 0 0Z";

export interface Flame {
  x: number;
  y: number;
  turn: number;
  scale: number;
}

/** Flames along the top edge of a corner, shrinking away from it; the left edge is their mirror image. */
export function cornerFlames(count = 6): Flame[] {
  return Array.from({ length: count }, (_, i) => {
    const scale = f(1.3 - i * 0.17);
    return { x: f(34 + i * 31 - i * i * 1.6), y: f(40 - i * 4.2), turn: f(38 + i * 7), scale };
  });
}
