"use client";

import { useState, type ReactNode } from "react";
import type { CoupleInfo, GuestbookData, GuestbookResult, GuestbookSubmission, Theme } from "../../types";
import { GuestProvider, useGuest } from "../../guest-context";
import { useLanguage } from "../../i18n";
import { KHMER_BODY_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { formatCoupleNames } from "../../format";
import { SkinProvider, useSkinOrnaments } from "../khmer/skin-context";
import { mediaTones } from "../skinned/gallery-tones";
import { MediaSection } from "../skinned/gallery-section";
import { SkinCard } from "../skinned/guestbook-card";
import { useGuestbookForm } from "../skinned/guestbook-form";
import { SkinGuestbookForm } from "../skinned/GuestbookSkinForm";
import { PhotoZoom } from "../../photo-zoom";
import { COVENANT_CSS } from "./covenant-styles";
import { Cross } from "./cross";
import { wishesWithWords } from "./memories-logic";
import { LazyImage, masonryRatio } from "./lazy-image";
import { tabFor, wallCounts, wallPhotos, type WallTab } from "./wall-logic";
import { WishCard } from "./wish-card";

export type WallStatus = "loading" | "ready" | "error";

interface PageProps {
  theme: Theme;
  couple: CoupleInfo;
  data?: GuestbookData;
  status: WallStatus;
  /** Link back to the invitation. */
  backHref: string;
  /** The invited guest's name (`?to=`), to prefill forms. */
  guestName?: string;
  /** Same guestbook submit the invitation page uses. When given, the photos tab offers the upload form. */
  onSubmit?: (s: GuestbookSubmission) => Promise<GuestbookResult>;
}

function Back({ href, theme }: { href: string; theme: Theme }) {
  const { t } = useLanguage();
  return (
    <a href={href} className="cv-link" style={{ color: theme.accent_color, border: `1px solid ${withAlpha(theme.accent_color, 0.6)}`, backgroundColor: "#ffffff" }}>
      ← {t("covenant.back")}
    </a>
  );
}

function Notice({ children }: { children: ReactNode }) {
  return (
    <p role="status" className="m-0 mx-auto max-w-sm text-base opacity-80">
      {children}
    </p>
  );
}

function PageFrame({ theme, couple, title, intro, backHref, children }: { theme: Theme; couple: CoupleInfo; title: string; intro: string; backHref: string; children: ReactNode }) {
  const sk = useSkinOrnaments();
  const { language } = useLanguage();
  return (
    <main style={{ minHeight: "100svh", backgroundColor: theme.bg_color, fontFamily: KHMER_BODY_FONT, color: theme.text_color }}>
      <style href="mk-covenant-css" precedence="mk-covenant">
        {COVENANT_CSS}
      </style>
      <div className="px-4 pt-10 text-center">
        <div className="mx-auto w-fit">
          <Cross color={theme.accent_color} size={56} glow />
        </div>
        <p className="m-0 mt-3 text-sm opacity-80" lang={language === "kh" ? "km" : "en"}>
          {formatCoupleNames(couple)}
        </p>
      </div>
      <MediaSection theme={theme} id="wall" heading={title} intro={intro}>
        {children}
        <div className="mt-14 flex justify-center">
          <Back href={backHref} theme={theme} />
        </div>
        <div className="mx-auto mt-10 w-fit opacity-70" aria-hidden>
          <sk.Divider color={theme.accent_color} width={160} />
        </div>
      </MediaSection>
    </main>
  );
}

function WishesBody({ theme, data, status }: Pick<PageProps, "theme" | "data" | "status">) {
  const { t } = useLanguage();
  const photos = new Map((data?.photos ?? []).map((p) => [p.photo_id, p]));
  const wishes = wishesWithWords(data);
  if (status === "loading") return <Notice>{t("covenant.loadingWall")}…</Notice>;
  if (status === "error") return <Notice>{t("covenant.loadFailed")}</Notice>;
  if (wishes.length === 0) return <Notice>{t("covenant.wishes.empty")}</Notice>;
  return (
    <ul data-zoom-group className="m-0 mx-auto max-w-5xl list-none columns-1 gap-5 p-0 pt-2 sm:columns-2 lg:columns-3">
      {wishes.map((w, i) => (
        <li key={w.wish_id} className="mb-5 break-inside-avoid">
          <WishCard theme={theme} wish={w} photo={w.photo_id ? photos.get(w.photo_id) : undefined} index={i} />
        </li>
      ))}
    </ul>
  );
}

/** Photos woven into columns (each box keeps a fixed shape while it loads), the guest's name on a soft scrim. */
function PhotoGrid({ theme, data }: Pick<PageProps, "theme" | "data">) {
  const { t } = useLanguage();
  const photos = wallPhotos(data);
  const accent = theme.accent_color;
  return (
    <ul data-zoom-group className="m-0 mx-auto max-w-5xl list-none columns-2 gap-3 p-0 sm:columns-3 sm:gap-4 lg:columns-4">
      {photos.map((p, i) => (
        <li key={p.photo_id} className="mb-3 break-inside-avoid sm:mb-4">
          <div
            className="cv-photo-card block"
            style={{ borderRadius: 18, boxShadow: `0 0 0 1px ${withAlpha(accent, 0.45)}, 0 16px 28px -20px ${withAlpha(accent, 0.8)}` }}
          >
            <LazyImage zoom src={p.url} alt={p.uploader_name ? `${t("grace.guestbook.photoBy")} ${p.uploader_name}` : t("grace.guestbook.photoBy")} tint={accent} ratio={masonryRatio(i)} eager={i < 4} />
            {p.uploader_name && <span className="cv-photo-name pointer-events-none">{p.uploader_name}</span>}
          </div>
        </li>
      ))}
    </ul>
  );
}

function PhotosBody({ theme, data, status, onSubmit }: Pick<PageProps, "theme" | "data" | "status" | "onSubmit">) {
  const { t } = useLanguage();
  const { name } = useGuest();
  const form = useGuestbookForm(name, onSubmit ?? (async () => ({ status: "pending" as const })));
  const photos = wallPhotos(data);
  return (
    <>
      {onSubmit && (
        <div className="mx-auto mb-12 max-w-xl">
          <SkinCard theme={theme}>
            <SkinGuestbookForm theme={theme} form={form} />
          </SkinCard>
        </div>
      )}
      {status === "loading" ? (
        <Notice>{t("covenant.loadingWall")}…</Notice>
      ) : status === "error" ? (
        <Notice>{t("covenant.loadFailed")}</Notice>
      ) : photos.length === 0 ? (
        <Notice>{t("covenant.photos.empty")}</Notice>
      ) : (
        <PhotoGrid theme={theme} data={data} />
      )}
    </>
  );
}

/** Wishes | Photos switch with the counts, styled as a gold pill group. */
function Tabs({ theme, tab, onTab, data }: { theme: Theme; tab: WallTab; onTab: (t: WallTab) => void; data?: GuestbookData }) {
  const { t } = useLanguage();
  const tone = mediaTones(theme);
  const counts = wallCounts(data);
  const items: { key: WallTab; label: string; n: number }[] = [
    { key: "wishes", label: t("covenant.wall.tabWishes"), n: counts.wishes },
    { key: "photos", label: t("covenant.wall.tabPhotos"), n: counts.photos },
  ];
  return (
    <div role="tablist" aria-label={t("covenant.wall.title")} className="mx-auto mb-10 flex w-fit gap-1 rounded-full p-1" style={{ backgroundColor: "#ffffff", border: `1px solid ${withAlpha(theme.accent_color, 0.4)}` }}>
      {items.map(({ key, label, n }) => {
        const on = tab === key;
        return (
          <button
            key={key}
            role="tab"
            type="button"
            id={`cv-tab-${key}`}
            aria-selected={on}
            aria-controls="cv-wall-panel"
            onClick={() => onTab(key)}
            className="cv-link min-h-11 border-0 px-5 text-base"
            style={on ? { background: `linear-gradient(135deg, ${tone.accent}, ${theme.accent_color})`, color: "#fff", cursor: "pointer" } : { background: "transparent", color: tone.accent, cursor: "pointer" }}
          >
            {label}
            <span className="ml-1.5 text-sm opacity-80">{n}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * The guest sub-page of a Covenant site: one page for everything guests shared, with a Wishes tab (cards) and a Photos
 * tab (woven columns, plus the upload form when the page can submit). `/wishes` and `/photos` open it on each tab.
 * Display and submit rules are the couple's own, exactly as on the invitation page.
 */
export function CovenantWallPage(props: PageProps & { initialTab?: WallTab | string }) {
  const { t } = useLanguage();
  const [tab, setTab] = useState<WallTab>(tabFor(props.initialTab));
  return (
    <SkinProvider skin="covenant">
      <GuestProvider name={props.guestName}>
        <PhotoZoom theme={props.theme}>
        <PageFrame theme={props.theme} couple={props.couple} title={t("covenant.wall.title")} intro={t("covenant.wall.intro")} backHref={props.backHref}>
          <Tabs theme={props.theme} tab={tab} onTab={setTab} data={props.data} />
          <div role="tabpanel" id="cv-wall-panel" aria-labelledby={`cv-tab-${tab}`}>
            {tab === "wishes" ? <WishesBody theme={props.theme} data={props.data} status={props.status} /> : <PhotosBody theme={props.theme} data={props.data} status={props.status} onSubmit={props.onSubmit} />}
          </div>
        </PageFrame>
        </PhotoZoom>
      </GuestProvider>
    </SkinProvider>
  );
}

export const CovenantWishesPage = (props: PageProps) => <CovenantWallPage {...props} initialTab="wishes" />;
export const CovenantPhotosPage = (props: PageProps) => <CovenantWallPage {...props} initialTab="photos" />;
