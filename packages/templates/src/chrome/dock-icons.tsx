import type { DockIconName } from "./dock-items";

/** Id of the shared gold gradient the icon strokes reference (defined once by <GoldDefs />). */
export const GOLD_GRADIENT_ID = "mk-gold-line";

/** Hidden SVG that defines the stroke gradient. userSpaceOnUse so thin horizontal lines still get color. */
export function GoldDefs({ id = GOLD_GRADIENT_ID }: { id?: string }) {
  return (
    <svg width="0" height="0" aria-hidden focusable="false" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="3" y1="2" x2="21" y2="22">
          <stop offset="0" style={{ stopColor: "var(--mk-gold-hi)" }} />
          <stop offset="0.5" style={{ stopColor: "var(--mk-gold)" }} />
          <stop offset="1" style={{ stopColor: "var(--mk-gold-lo)" }} />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * Original 24x24 gold line icons (1.4px rounded strokes). Drawn for this project, not taken
 * from the reference studio: envelope with a diamond seal, agenda with a timeline, a pin on a
 * lotus-pad ground, framed landscape, gift with a bow, speech bubble with a heart, reply check.
 */
const PATHS: Record<DockIconName, string[]> = {
  invitation: [
    "M3.5 7.6h17v10.9a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z",
    "M3.5 7.6 12 14l8.5-6.4",
    "M12 10.4l1.3 1.8L12 14l-1.3-1.8z",
  ],
  story: [
    "M12 6.4C10 5 7.2 4.6 4 5v13.4c3.2-.4 6 0 8 1.4 2-1.4 4.8-1.8 8-1.4V5c-3.2-.4-6 0-8 1.4z",
    "M12 6.4v13.4",
    "M15.6 10.6s-2.2-1.4-2.2-3a1.2 1.2 0 0 1 2.2-.8 1.2 1.2 0 0 1 2.2.8c0 1.6-2.2 3-2.2 3z",
  ],
  agenda: [
    "M5 5.8h14a1.2 1.2 0 0 1 1.2 1.2v11.6a1.2 1.2 0 0 1-1.2 1.2H5a1.2 1.2 0 0 1-1.2-1.2V7A1.2 1.2 0 0 1 5 5.8z",
    "M3.8 10h16.4",
    "M8.2 3.6v3.6M15.8 3.6v3.6",
    "M7.8 13.4h.01M10.8 13.4h5.4M7.8 16.4h.01M10.8 16.4h3.6",
  ],
  map: [
    "M12 18.6s-5.5-5-5.5-9.2a5.5 5.5 0 0 1 11 0c0 4.2-5.5 9.2-5.5 9.2z",
    "M12 9.4m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0",
    "M8.2 19.2c-1.5.4-2.4 1-2.4 1.7 0 1 2.9 1.7 6.2 1.7s6.2-.7 6.2-1.7c0-.7-.9-1.3-2.4-1.7",
  ],
  gallery: [
    "M4 5.2h16a1 1 0 0 1 1 1v11.6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6.2a1 1 0 0 1 1-1z",
    "M8.6 9.4m-1.6 0a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0-3.2 0",
    "M3 16.6l5-4.4 3.8 3.1 3.2-2.7 6 4.2",
  ],
  gift: [
    "M3.5 9h17v3.4h-17z",
    "M5 12.4v7.4a.9.9 0 0 0 .9.9h12.2a.9.9 0 0 0 .9-.9v-7.4",
    "M12 9v11.7",
    "M12 9C10.8 6.2 9.4 4.4 7.9 4.4a2 2 0 0 0 0 4.6zM12 9c1.2-2.8 2.6-4.6 4.1-4.6a2 2 0 0 1 0 4.6z",
  ],
  wishes: [
    "M5 4.6h14a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-6.2L8.6 20.4v-3.8H5A1.5 1.5 0 0 1 3.5 15.1V6.1A1.5 1.5 0 0 1 5 4.6z",
    "M12 13.5s-3-1.9-3-4a1.7 1.7 0 0 1 3-1.1 1.7 1.7 0 0 1 3 1.1c0 2.1-3 4-3 4z",
  ],
  rsvp: [
    "M12 12m-8.4 0a8.4 8.4 0 1 0 16.8 0a8.4 8.4 0 1 0-16.8 0",
    "M8.2 12.3l2.6 2.6 5-5.4",
  ],
};

export function DockIcon({ name, gradientId = GOLD_GRADIENT_ID }: { name: DockIconName; gradientId?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={`url(#${gradientId})`} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
      {PATHS[name].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
