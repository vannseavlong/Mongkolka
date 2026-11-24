"use client";

import type { ReactNode } from "react";
import type { CoupleInfo, GuestbookData, GuestbookResult, GuestbookSubmission, Theme } from "../../types";
import { GuestProvider, useGuest } from "../../guest-context";
import { useLanguage } from "../../i18n";
import { KHMER_BODY_FONT } from "../../chrome/fonts";
import { withAlpha } from "../../chrome/gold";
import { formatCoupleNames } from "../../format";
import { SkinProvider, useSkinOrnaments } from "../khmer/skin-context";
import { mediaFor } from "../skinned/gallery-media";
import { MediaSection } from "../skinned/gallery-section";
import { SkinCard } from "../skinned/guestbook-card";
import { useGuestbookForm } from "../skinned/guestbook-form";
import { SkinGuestbookForm } from "../skinned/GuestbookSkinForm";
import { COVENANT_CSS } from "./covenant-styles";
import { Cross } from "./cross";
import { wishesWithWords } from "./memories-logic";
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
    <ul className="m-0 mx-auto max-w-5xl list-none columns-1 gap-6 p-0 pt-4 text-left sm:columns-2 lg:columns-3">
      {wishes.map((w, i) => (
        <li key={w.wish_id} className="mb-8 break-inside-avoid">
          <WishCard theme={theme} wish={w} photo={w.photo_id ? photos.get(w.photo_id) : undefined} index={i} />
        </li>
      ))}
    </ul>
  );
}

/** Every approved wish as a card, newest first. Fully client-side; the data comes from the guestbook endpoint. */
export function CovenantWishesPage(props: PageProps) {
  const { t } = useLanguage();
  return (
    <SkinProvider skin="covenant">
      <GuestProvider name={props.guestName}>
        <PageFrame theme={props.theme} couple={props.couple} title={t("covenant.wishes.title")} intro={t("covenant.wishes.intro")} backHref={props.backHref}>
          <WishesBody theme={props.theme} data={props.data} status={props.status} />
        </PageFrame>
      </GuestProvider>
    </SkinProvider>
  );
}

function PhotosBody({ theme, data, status, onSubmit }: Pick<PageProps, "theme" | "data" | "status"> & { onSubmit: (s: GuestbookSubmission) => Promise<GuestbookResult> }) {
  const { t } = useLanguage();
  const { name } = useGuest();
  const sk = useSkinOrnaments();
  const media = mediaFor(sk);
  const form = useGuestbookForm(name, onSubmit);
  const photos = (data?.photos ?? []).filter((p) => !!p.url);
  return (
    <>
      <SkinCard theme={theme}>
        <SkinGuestbookForm theme={theme} form={form} />
      </SkinCard>
      <div className="mt-16">
        {status === "loading" ? (
          <Notice>{t("covenant.loadingWall")}…</Notice>
        ) : status === "error" ? (
          <Notice>{t("covenant.loadFailed")}</Notice>
        ) : photos.length === 0 ? (
          <Notice>{t("covenant.photos.empty")}</Notice>
        ) : (
          <ul className="m-0 mx-auto grid max-w-5xl list-none grid-cols-2 gap-x-4 gap-y-8 p-0 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((p, i) => (
              <li key={p.photo_id}>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="sk-tile block" aria-label={p.uploader_name ?? t("grace.guestbook.photoBy")}>
                  <media.Frame theme={theme} index={i} variant="gallery" aspect="aspect-[4/5]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover" />
                  </media.Frame>
                </a>
                {p.uploader_name && <p className="m-0 mt-2 break-words text-sm opacity-80">{p.uploader_name}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

/**
 * The guest photo page: the upload form (the couple's own rules decide whether it is on, pending or auto-approved,
 * exactly as for every other template) and every approved photo. `onSubmit` is the same guestbook submit the
 * invitation page uses.
 */
export function CovenantPhotosPage(props: PageProps & { onSubmit: (s: GuestbookSubmission) => Promise<GuestbookResult> }) {
  const { t } = useLanguage();
  return (
    <SkinProvider skin="covenant">
      <GuestProvider name={props.guestName}>
        <PageFrame theme={props.theme} couple={props.couple} title={t("covenant.photos.title")} intro={t("covenant.photos.intro")} backHref={props.backHref}>
          <PhotosBody theme={props.theme} data={props.data} status={props.status} onSubmit={props.onSubmit} />
        </PageFrame>
      </GuestProvider>
    </SkinProvider>
  );
}
