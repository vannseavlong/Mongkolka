"use client";

import { useState, type ReactNode } from "react";
import { MapPin } from "lucide-react";
import type { CoupleInfo, MapContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { KHMER_BODY_FONT } from "../../chrome/fonts";
import { goldStops, withAlpha } from "../../chrome/gold";
import { COVENANT_CSS } from "./covenant-styles";
import { covenantPalette } from "./palette";
import { directionsUrl, mapImage, pickText } from "./text-logic";

export interface CovenantMapProps {
  couple?: CoupleInfo;
  theme: Theme;
  content?: MapContent;
  /** The venue's maps link from the details (set by the site, not typed here). */
  mapUrl?: string;
}

/** The map picture: it keeps its own shape, fades in, and opens full size in a new tab when tapped. */
function MapImage({ src, alt, theme }: { src: string; alt: string; theme: Theme }) {
  const { t } = useLanguage();
  const [ready, setReady] = useState(false);
  return (
    <a href={src} target="_blank" rel="noopener noreferrer" aria-label={t("covenant.map.enlarge")} className="block" style={{ cursor: "zoom-in", background: withAlpha(theme.accent_color, 0.08) }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- the couple's own picture on any host */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setReady(true)}
        className="block h-auto w-full"
        style={{ minHeight: ready ? undefined : 240, opacity: ready ? 1 : 0, transform: ready ? "none" : "scale(1.02)", transition: "opacity .6s ease, transform .8s ease" }}
      />
    </a>
  );
}

function Shell({ theme, heading, children }: { theme: Theme; heading: string; children: ReactNode }) {
  const p = covenantPalette(theme);
  return (
    <section id="map" className="px-4 py-14 text-center sm:px-6" style={{ backgroundColor: theme.bg_color, color: theme.text_color, fontFamily: KHMER_BODY_FONT, ["--cv-hi" as string]: p.gold.hi, ["--cv-mid" as string]: p.gold.mid, ["--cv-lo" as string]: p.gold.lo }}>
      <style href="mk-covenant-css" precedence="mk-covenant">
        {COVENANT_CSS}
      </style>
      <h2 className="m-0 mb-7 text-2xl font-semibold" style={{ color: theme.accent_color }}>
        {heading}
      </h2>
      {children}
    </section>
  );
}

function useMap(content?: MapContent, mapUrl?: string) {
  const { t, language } = useLanguage();
  return {
    image: mapImage(content),
    caption: pickText(content?.captionKh, content?.captionEn, language),
    href: directionsUrl(mapUrl),
    heading: t("covenant.map.heading"),
    alt: t("covenant.map.alt"),
    open: t("covenant.map.open"),
  };
}

function Directions({ href, label, theme }: { href: string | null; label: string; theme: Theme }) {
  const g = goldStops(theme.accent_color);
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="cv-link mt-6" style={{ color: "#fff", background: `linear-gradient(135deg, ${g.hi}, ${g.mid} 50%, ${g.lo})`, boxShadow: `0 12px 24px -12px ${withAlpha(g.lo, 0.8)}` }}>
      <MapPin className="size-4" aria-hidden />
      {label}
    </a>
  );
}

/** Paper: the picture on cream paper in a double gold frame, the caption underneath, then the directions button. */
export function CovenantMapPaper({ theme, content, mapUrl }: CovenantMapProps) {
  const m = useMap(content, mapUrl);
  if (!m.image && !m.href) return null;
  const g = goldStops(theme.accent_color);
  return (
    <Shell theme={theme} heading={m.heading}>
      {m.image && (
        <div className="mx-auto max-w-xl p-[4px]" style={{ borderRadius: 14, background: `linear-gradient(160deg, ${g.hi}, ${g.mid} 50%, ${g.lo})`, boxShadow: "0 24px 38px -24px rgba(70,40,30,.6)" }}>
          <div className="overflow-hidden" style={{ borderRadius: 11, boxShadow: "inset 0 0 0 4px #fffaf0", backgroundColor: "#fffaf0", padding: 6 }}>
            <div className="overflow-hidden" style={{ borderRadius: 8 }}>
              <MapImage src={m.image} alt={m.alt} theme={theme} />
            </div>
          </div>
        </div>
      )}
      {m.caption && <p className="m-0 mx-auto mt-4 max-w-md break-words text-[15px] leading-relaxed">{m.caption}</p>}
      <Directions href={m.href} label={m.open} theme={theme} />
    </Shell>
  );
}

/** Postcard: a slightly tilted white card with tape and a gold pin, the picture inside a thin border. */
export function CovenantMapPostcard({ theme, content, mapUrl }: CovenantMapProps) {
  const m = useMap(content, mapUrl);
  if (!m.image && !m.href) return null;
  return (
    <Shell theme={theme} heading={m.heading}>
      {m.image && (
        <div className="relative mx-auto max-w-xl" style={{ transform: "rotate(-1.2deg)" }}>
          <span aria-hidden className="absolute -top-3 left-8 z-10 h-6 w-20 -rotate-6" style={{ background: withAlpha(theme.accent_color, 0.28) }} />
          <span aria-hidden className="absolute -top-4 right-8 z-10 grid size-9 place-items-center rounded-full bg-white" style={{ boxShadow: `0 0 0 2px ${theme.accent_color}` }}>
            <MapPin className="size-5" style={{ color: theme.accent_color }} aria-hidden />
          </span>
          <div className="bg-white p-3 sm:p-4" style={{ boxShadow: "0 24px 38px -20px rgba(60,30,40,.55)", outline: `1px solid ${withAlpha(theme.accent_color, 0.2)}` }}>
            <div style={{ border: `1px solid ${withAlpha(theme.accent_color, 0.5)}` }}>
              <MapImage src={m.image} alt={m.alt} theme={theme} />
            </div>
            {m.caption && <p className="m-0 mt-3 break-words text-[15px]">{m.caption}</p>}
          </div>
        </div>
      )}
      <Directions href={m.href} label={m.open} theme={theme} />
    </Shell>
  );
}
