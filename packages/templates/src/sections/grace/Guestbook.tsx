"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ImagePlus, MapPin, Share2, X } from "lucide-react";
import { GraceSection, Cross, GoldDivider, Reveal, FoilText, gracePalette, nameFont, DISPLAY_FONT } from "./shared";
import { GraceFormStyle, ERROR_COLOR, cardStyle, fieldStyle, formVars, primaryButtonStyle } from "./rsvp-ui";
import { ACCEPTED_PHOTO_TYPES, MAX_WISH, buildIcs, classifyError, validatePhoto, type PhotoErrorKind } from "./guestbook-logic";
import { useLanguage } from "../../i18n";
import { useGuest } from "../../guest-context";
import type { GuestbookResult, Theme } from "../../types";
import type { GuestbookWallProps } from "../ink/Guestbook";

const ERROR_KEY = {
  tooBig: "grace.guestbook.errorTooBig",
  type: "grace.guestbook.errorType",
  limit: "grace.guestbook.errorLimit",
  off: "grace.guestbook.errorOff",
  network: "grace.guestbook.errorNetwork",
} as const;

/** Arch-topped photo inside a double gold frame; falls back to a blush panel if the image fails. */
function ArchPhoto({ theme, src, alt, aspect }: { theme: Theme; src: string; alt: string; aspect: string }) {
  const p = gracePalette(theme);
  const [failed, setFailed] = useState(false);
  const foil = { backgroundColor: p.accent, backgroundImage: p.foilGradient };
  return (
    <div className="rounded-t-[999px] p-[2px]" style={foil}>
      <div className="rounded-t-[999px] p-1" style={{ backgroundColor: p.card }}>
        <div className={`relative w-full overflow-hidden rounded-t-[999px] ${aspect}`} style={{ backgroundColor: p.blush }}>
          {failed ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Cross stroke={p.accent} className="h-10 w-auto" strokeWidth={2} />
            </div>
          ) : (
            <img
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setFailed(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
}

const ASPECTS = ["aspect-[3/4]", "aspect-[4/5]", "aspect-[2/3]", "aspect-square"];

/** Stable per-item aspect: depends only on the id, so adding items never reshapes other tiles. */
function aspectFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return ASPECTS[h % ASPECTS.length]!;
}

export function GraceGuestbook({ couple, theme, guestbook, actions, onSubmit }: GuestbookWallProps) {
  const { t, language } = useLanguage();
  const { name: invitedName } = useGuest();
  const p = gracePalette(theme);

  const [name, setName] = useState((invitedName ?? "").slice(0, 80));
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorKind, setErrorKind] = useState<PhotoErrorKind | null>(null);
  const [tried, setTried] = useState(false);
  const [resultStatus, setResultStatus] = useState<GuestbookResult["status"]>("pending");
  const [copied, setCopied] = useState(false);
  const [manualLink, setManualLink] = useState<string | null>(null);
  const [pickError, setPickError] = useState<PhotoErrorKind | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const wishRef = useRef<HTMLTextAreaElement>(null);
  const photoBtnRef = useRef<HTMLButtonElement>(null);
  const refocus = useRef(false);

  useEffect(() => {
    if (invitedName) setName((n) => n || invitedName.slice(0, 80));
  }, [invitedName]);
  useEffect(() => {
    if (!photo) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);
  useEffect(() => {
    if (state === "done") doneRef.current?.focus();
    if (state === "idle" && refocus.current) {
      refocus.current = false;
      (photoBtnRef.current ?? nameRef.current)?.focus();
    }
  }, [state]);

  const photoById = useMemo(() => new Map((guestbook?.photos ?? []).map((ph) => [ph.photo_id, ph])), [guestbook?.photos]);
  const wishes = guestbook?.wishes ?? [];
  const wishPhotoIds = new Set(wishes.map((w) => w.photo_id).filter(Boolean));
  const loosePhotos = (guestbook?.photos ?? []).filter((ph) => !wishPhotoIds.has(ph.photo_id));
  const hasWall = wishes.length + loosePhotos.length > 0;

  const nameError = tried && !name.trim();
  const needError = tried && !message.trim() && !photo;
  const photoError = pickError;

  function pick(file: File | null) {
    if (!file) return;
    const bad = validatePhoto(file);
    if (fileRef.current) fileRef.current.value = "";
    if (bad) {
      // keep any previously chosen valid photo; just explain why the new file was refused
      setPickError(bad);
      return;
    }
    setPickError(null);
    setErrorKind(null);
    setState((s) => (s === "error" ? "idle" : s));
    setPhoto(file);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setTried(true);
    if (!name.trim()) {
      nameRef.current?.focus();
      return;
    }
    if (!message.trim() && !photo) {
      wishRef.current?.focus();
      return;
    }
    setState("sending");
    setErrorKind(null);
    try {
      const result = await onSubmit({ name: name.trim(), message: message.trim() || undefined, photo: photo ?? undefined });
      setResultStatus(result.status);
      setState("done");
    } catch (err) {
      setErrorKind(classifyError(err));
      setState("error");
    }
  }

  function reset() {
    setMessage("");
    setPhoto(null);
    setTried(false);
    setErrorKind(null);
    setPickError(null);
    refocus.current = true;
    setState("idle");
  }

  function addToCalendar() {
    if (!actions?.calendar) return;
    const blob = new Blob([buildIcs(actions.calendar)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function share() {
    const url = actions?.shareUrl ?? window.location.href.split("?")[0]!;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${couple.partner1Name} & ${couple.partner2Name ?? ""}`.trim(), url });
        return;
      }
    } catch {
      return; // share sheet cancelled
    }
    try {
      if (!navigator.clipboard?.writeText) throw new Error("no clipboard");
      await navigator.clipboard.writeText(url);
      setManualLink(null);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // insecure context or blocked clipboard: show the link so it can be copied by hand
      setManualLink(url);
    }
  }

  const actionButtons = [
    actions?.mapsUrl && {
      key: "maps",
      icon: MapPin,
      label: t("grace.guestbook.directions"),
      onClick: () => window.open(actions.mapsUrl, "_blank", "noopener,noreferrer"),
    },
    actions?.calendar && { key: "cal", icon: Calendar, label: t("grace.guestbook.calendar"), onClick: addToCalendar },
    { key: "share", icon: Share2, label: t("grace.guestbook.share"), onClick: share },
  ].filter(Boolean) as { key: string; icon: typeof MapPin; label: string; onClick: () => void }[];

  const heading = nameFont(language);
  const labelCls = "mb-1.5 block text-base font-medium";
  const note = {
    backgroundColor: p.card,
    border: `1px solid ${p.foilLight}`,
    borderRadius: 16,
    boxShadow: "0 14px 30px -24px rgba(74,44,53,0.4)",
  } as const;
  const photoBy = t("grace.guestbook.photoBy");

  return (
    <GraceSection theme={theme} id="guestbook" ground="white" className="text-center" maxWidth="max-w-5xl">
      <GraceFormStyle />
      <Reveal>
        <h2 className="text-5xl leading-tight sm:text-6xl" style={{ fontFamily: heading, color: p.accent }}>
          <FoilText theme={theme}>{t("grace.guestbook.heading")}</FoilText>
        </h2>
        <GoldDivider theme={theme} className="mt-5" />
        <p className="mx-auto mt-5 max-w-md text-lg" style={{ color: p.text }}>
          {t("grace.guestbook.subheading")}
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div
          className="grace-form mx-auto mt-10 max-w-xl p-6 text-left sm:p-9"
          style={{ ...cardStyle(theme), ...formVars(theme), fontFamily: DISPLAY_FONT, backgroundColor: p.ground }}
        >
          {state === "done" ? (
            <div ref={doneRef} tabIndex={-1} role="status" className="py-6 text-center outline-none">
              <Cross stroke={p.accent} className="mx-auto h-10 w-auto" strokeWidth={3} />
              <p className="mt-4 text-4xl" style={{ fontFamily: heading, color: p.accent }}>
                {t("grace.guestbook.thanksTitle")}
                {name.trim() ? `, ${name.trim()}` : ""}
              </p>
              <p className="mt-3 text-lg">
                {resultStatus === "approved" ? t("grace.guestbook.thanksApproved") : t("grace.guestbook.thanksPending")}
              </p>
              <button type="button" onClick={reset} className="mt-6 min-h-11 px-4 text-base underline underline-offset-4" style={{ color: p.accent }}>
                {t("grace.guestbook.another")}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-6">
              <div>
                <span id="grace-gb-photo-label" className={labelCls}>
                  {t("grace.guestbook.photoLabel")}
                </span>
                <input
                  ref={fileRef}
                  id="grace-gb-file"
                  type="file"
                  accept={ACCEPTED_PHOTO_TYPES.join(",")}
                  className="sr-only"
                  tabIndex={-1}
                  aria-hidden
                  onChange={(e) => pick(e.target.files?.[0] ?? null)}
                />
                {preview ? (
                  <div className="flex items-center gap-4">
                    <div className="w-28 shrink-0">
                      <div className="rounded-t-[999px] p-[2px]" style={{ backgroundColor: p.accent, backgroundImage: p.foilGradient }}>
                        <div className="rounded-t-[999px] p-[3px]" style={{ backgroundColor: p.card }}>
                                                    <img src={preview} alt={t("grace.guestbook.previewAlt")} className="aspect-[3/4] w-full rounded-t-[999px] object-cover" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-1">
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="min-h-11 px-1 text-base underline underline-offset-4"
                        style={{ color: p.accent }}
                      >
                        {t("grace.guestbook.changePhoto")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPhoto(null);
                          setPickError(null);
                          if (fileRef.current) fileRef.current.value = "";
                        }}
                        className="flex min-h-11 items-center gap-2 px-1 text-base"
                        style={{ color: p.text }}
                      >
                        <X className="size-4" aria-hidden />
                        {t("grace.guestbook.removePhoto")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    ref={photoBtnRef}
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    aria-labelledby="grace-gb-photo-label grace-gb-photo-cta"
                    aria-describedby={photoError ? "grace-gb-photo-err" : undefined}
                    className="flex min-h-32 w-full flex-col items-center justify-center gap-2 rounded-2xl px-4 py-6 text-center"
                    style={{
                      border: `1.5px dashed ${photoError ? ERROR_COLOR : p.accent}`,
                      backgroundColor: p.card,
                      color: p.text,
                    }}
                  >
                    <ImagePlus className="size-7" style={{ color: p.accent }} aria-hidden />
                    <span id="grace-gb-photo-cta" className="text-lg">
                      {t("grace.guestbook.addPhoto")}
                    </span>
                    <span className="text-base" style={{ color: p.muted }}>
                      {t("grace.guestbook.addPhotoHint")}
                    </span>
                  </button>
                )}
                {photoError && (
                  <p id="grace-gb-photo-err" role="alert" className="mt-1.5 text-base" style={{ color: ERROR_COLOR }}>
                    {t(ERROR_KEY[photoError])}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="grace-gb-name" className={labelCls}>
                  {t("grace.guestbook.nameLabel")}
                </label>
                <input
                  id="grace-gb-name"
                  ref={nameRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  autoComplete="name"
                  required
                  aria-invalid={nameError || undefined}
                  aria-describedby={nameError ? "grace-gb-name-err" : undefined}
                  style={fieldStyle(theme, nameError)}
                />
                {nameError && (
                  <p id="grace-gb-name-err" role="alert" className="mt-1.5 text-base" style={{ color: ERROR_COLOR }}>
                    {t("grace.guestbook.nameRequired")}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="grace-gb-wish" className={labelCls}>
                  {t("grace.guestbook.wishLabel")}
                </label>
                <textarea
                  id="grace-gb-wish"
                  ref={wishRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, MAX_WISH))}
                  rows={4}
                  maxLength={MAX_WISH}
                  aria-invalid={needError || undefined}
                  aria-describedby={`grace-gb-count${needError ? " grace-gb-need-err" : ""}`}
                  className="resize-none"
                  style={fieldStyle(theme, needError)}
                />
                <p id="grace-gb-count" className="mt-1 text-right text-base" style={{ color: p.muted }}>
                  {MAX_WISH - message.length} {t("grace.guestbook.counter")}
                </p>
                {needError && (
                  <p id="grace-gb-need-err" role="alert" className="mt-1 text-base" style={{ color: ERROR_COLOR }}>
                    {t("grace.guestbook.needSomething")}
                  </p>
                )}
              </div>

              <div aria-live="polite">
                {state === "error" && errorKind && (
                  <p role="alert" className="text-base" style={{ color: ERROR_COLOR }}>
                    {t(ERROR_KEY[errorKind])}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={state === "sending"}
                aria-busy={state === "sending"}
                className="px-6 text-lg font-medium disabled:opacity-60"
                style={primaryButtonStyle(theme)}
              >
                {state === "sending" ? t("grace.guestbook.sending") : t("grace.guestbook.submit")}
              </button>
            </form>
          )}
        </div>
      </Reveal>

      <div className="mt-16">
        <h3 className="text-3xl" style={{ fontFamily: heading, color: p.accent }}>
          {t("grace.guestbook.wallHeading")}
        </h3>
        {hasWall ? (
          <ul className="mt-8 columns-2 gap-3 text-left sm:columns-3 sm:gap-5">
            {wishes.map((w) => {
              const ph = w.photo_id ? photoById.get(w.photo_id) : undefined;
              const aspect = aspectFor(w.wish_id);
              return (
                <li key={w.wish_id} className="mb-3 break-inside-avoid sm:mb-5">
                  <div className={ph ? "p-2.5 sm:p-3" : "p-4 sm:p-5"} style={note}>
                    {ph && <ArchPhoto theme={theme} src={ph.url} alt="" aspect={aspect} />}
                    {w.message && (
                      <p className={`whitespace-pre-line break-words text-lg leading-relaxed ${ph ? "mt-3" : ""}`}>{w.message}</p>
                    )}
                    <p className="mt-2 break-words text-base font-medium" style={{ color: p.accent }}>
                      {w.name}
                    </p>
                  </div>
                </li>
              );
            })}
            {loosePhotos.map((ph) => {
              const aspect = aspectFor(ph.photo_id);
              return (
                <li key={ph.photo_id} className="mb-3 break-inside-avoid sm:mb-5">
                  <div className="p-3" style={note}>
                    <ArchPhoto theme={theme} src={ph.url} alt={ph.uploader_name ? "" : photoBy} aspect={aspect} />
                    {ph.uploader_name && (
                      <p className="mt-2 break-words text-base font-medium" style={{ color: p.accent }}>
                        {ph.uploader_name}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mx-auto mt-8 flex max-w-sm flex-col items-center gap-3 p-8" style={note}>
            <Cross stroke={p.accent} className="h-8 w-auto" strokeWidth={3} />
            <p className="text-lg">{t("grace.guestbook.empty")}</p>
          </div>
        )}
      </div>

      <div className="mt-16">
        <p className="text-base" style={{ color: p.accent }}>
          {t("grace.guestbook.actionsHeading")}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {actionButtons.map(({ key, icon: Icon, label, onClick }) => (
            <button
              key={key}
              type="button"
              onClick={onClick}
              className="grace-focus flex min-h-12 items-center gap-2 rounded-full px-5 text-base"
              style={{ border: `1px solid ${p.accent}`, color: p.text, backgroundColor: p.card, ["--grace-accent" as string]: p.accent }}
            >
              <Icon className="size-4" style={{ color: p.accent }} aria-hidden />
              {label}
            </button>
          ))}
        </div>
        <p role="status" aria-live="polite" className="mt-3 min-h-6 text-base" style={{ color: p.accent }}>
          {copied ? t("grace.guestbook.copied") : ""}
        </p>
        {manualLink && (
          <div className="mx-auto mt-2 max-w-sm text-left">
            <label htmlFor="grace-gb-link" className="mb-1.5 block text-base">
              {t("grace.guestbook.copyManual")}
            </label>
            <input
              id="grace-gb-link"
              readOnly
              value={manualLink}
              onFocus={(e) => e.currentTarget.select()}
              style={fieldStyle(theme)}
            />
          </div>
        )}
      </div>
    </GraceSection>
  );
}
