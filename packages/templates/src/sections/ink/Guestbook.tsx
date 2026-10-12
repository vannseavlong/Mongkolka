"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Calendar, Check, ImagePlus, MapPin, Share2, X } from "lucide-react";
import type {
  CoupleInfo,
  GuestbookActions,
  GuestbookData,
  GuestbookResult,
  GuestbookSubmission,
  Theme,
} from "../../types";
import { useLanguage } from "../../i18n";
import { useGuest } from "../../guest-context";
import { DISPLAY_FONT, Eyebrow, InkSection, LABEL_FONT, Ornament, mix } from "./shared";

export interface GuestbookWallProps {
  couple: CoupleInfo;
  theme: Theme;
  /** Approved photos + wishes, fetched by the consuming app. */
  guestbook?: GuestbookData;
  actions?: GuestbookActions;
  /** Left to the consuming app (resize/upload the photo, then post the wish). */
  onSubmit: (submission: GuestbookSubmission) => Promise<GuestbookResult>;
}

const MAX_WISH = 500;

function buildIcs(c: NonNullable<GuestbookActions["calendar"]>): string {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const start = new Date(c.start);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
  const esc = (v: string) => v.replace(/[\;,]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mongkolka//Wedding//EN",
    "BEGIN:VEVENT",
    `UID:${fmt(start)}-${Math.abs(hash(c.title))}@mongkolka`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${esc(c.title)}`,
    c.location ? `LOCATION:${esc(c.location)}` : "",
    c.description ? `DESCRIPTION:${esc(c.description)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

/**
 * Wishes + photo wall, a form to add to it, and a row of "do something" actions
 * (directions, add to calendar, share) so the page ends on something useful rather
 * than just a form.
 */
export function GuestbookWall({ couple, theme, guestbook, actions, onSubmit }: GuestbookWallProps) {
  const { t } = useLanguage();
  const { name: invitedName } = useGuest();
  const foil = theme.accent_color;

  const [name, setName] = useState(invitedName ?? "");
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [giftOn, setGiftOn] = useState(false);
  const [giftAmount, setGiftAmount] = useState("");
  const [giftCurrency, setGiftCurrency] = useState<"USD" | "KHR">("USD");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [resultStatus, setResultStatus] = useState<GuestbookResult["status"]>("pending");
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (invitedName && !name) setName(invitedName);
    // only seed once the invited name is known
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const photoById = useMemo(
    () => new Map((guestbook?.photos ?? []).map((p) => [p.photo_id, p])),
    [guestbook?.photos],
  );
  // Wall = wishes (with their photo, if approved) followed by photos that came without a wish.
  const wishPhotoIds = new Set((guestbook?.wishes ?? []).map((w) => w.photo_id).filter(Boolean));
  const loosePhotos = (guestbook?.photos ?? []).filter((p) => !wishPhotoIds.has(p.photo_id));
  const hasWall = (guestbook?.wishes.length ?? 0) + loosePhotos.length > 0;

  const canSubmit = name.trim().length > 0 && (message.trim() || photo || (giftOn && Number(giftAmount) > 0));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || state === "sending") return;
    setState("sending");
    try {
      const result = await onSubmit({
        name: name.trim(),
        message: message.trim() || undefined,
        photo: photo ?? undefined,
        gift: giftOn && Number(giftAmount) > 0 ? { amount: Number(giftAmount), currency: giftCurrency } : undefined,
      });
      setResultStatus(result.status);
      setState("done");
    } catch {
      setState("error");
    }
  }

  function reset() {
    setMessage("");
    setPhoto(null);
    setGiftOn(false);
    setGiftAmount("");
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
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user cancelled the share sheet — nothing to do */
    }
  }

  const fieldStyle = {
    borderBottom: `1px solid ${mix(theme.text_color, 40)}`,
    fontFamily: DISPLAY_FONT,
  } as const;

  const actionButtons = [
    actions?.mapsUrl && {
      key: "maps",
      icon: MapPin,
      label: t("guestbook.directions"),
      onClick: () => window.open(actions.mapsUrl, "_blank", "noopener,noreferrer"),
    },
    actions?.calendar && { key: "cal", icon: Calendar, label: t("guestbook.calendar"), onClick: addToCalendar },
    { key: "share", icon: Share2, label: copied ? t("guestbook.copied") : t("guestbook.share"), onClick: share },
  ].filter(Boolean) as { key: string; icon: typeof MapPin; label: string; onClick: () => void }[];

  return (
    <InkSection theme={theme} id="guestbook" className="px-5 py-28 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-14 text-center">
          <Eyebrow color={foil}>{t("guestbook.eyebrow")}</Eyebrow>
          <h2 className="mt-4 text-[clamp(2.5rem,7vw,4.5rem)] font-light italic">{t("guestbook.heading")}</h2>
          <p className="mx-auto mt-4 max-w-md text-lg opacity-75">{t("guestbook.subheading")}</p>
          <Ornament color={foil} className="mt-6" />
        </header>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,26rem)_1fr]">
          {/* --- form --- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="self-start p-7 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.4)]"
            style={{ outline: `1px solid ${mix(foil, 70)}`, outlineOffset: -8, backgroundColor: mix(theme.bg_color, 100) }}
          >
            <AnimatePresence mode="wait">
              {state === "done" ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center"
                  role="status"
                >
                  <span
                    className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full"
                    style={{ backgroundColor: foil, color: theme.text_color }}
                  >
                    <Check className="size-6" />
                  </span>
                  <p className="text-3xl italic">
                    {t("guestbook.thanksTitle")}
                    {name.trim() ? `, ${name.trim()}` : ""}
                  </p>
                  <p className="mt-3 text-base opacity-75">
                    {resultStatus === "approved" ? t("guestbook.thanksApproved") : t("guestbook.thanksPending")}
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-6 text-xs uppercase tracking-[0.35em] underline-offset-4 hover:underline"
                    style={{ color: foil, fontFamily: LABEL_FONT }}
                  >
                    {t("guestbook.another")}
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} className="flex flex-col gap-6">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={80}
                    placeholder={t("guestbook.yourName")}
                    className="bg-transparent pb-2 text-2xl italic outline-none placeholder:opacity-40"
                    style={fieldStyle}
                  />
                  <div>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, MAX_WISH))}
                      rows={4}
                      placeholder={t("guestbook.message")}
                      className="w-full resize-none bg-transparent pb-2 text-lg italic outline-none placeholder:opacity-40"
                      style={fieldStyle}
                    />
                    <p className="mt-1 text-right text-[10px] tracking-widest opacity-50" style={{ fontFamily: LABEL_FONT }}>
                      {message.length}/{MAX_WISH}
                    </p>
                  </div>

                  {/* photo picker */}
                  <div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="sr-only"
                      onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                    />
                    {preview ? (
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt="" className="max-h-56 w-full object-cover" />
                        <button
                          type="button"
                          aria-label={t("guestbook.removePhoto")}
                          onClick={() => {
                            setPhoto(null);
                            if (fileRef.current) fileRef.current.value = "";
                          }}
                          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full"
                          style={{ backgroundColor: theme.text_color, color: theme.bg_color }}
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="flex w-full items-center justify-center gap-3 border border-dashed py-6 text-sm transition hover:opacity-80"
                        style={{ borderColor: mix(foil, 80), fontFamily: LABEL_FONT }}
                      >
                        <ImagePlus className="size-5" style={{ color: foil }} />
                        {t("guestbook.addPhoto")}
                      </button>
                    )}
                  </div>

                  {/* reported gift */}
                  <div>
                    <label className="flex cursor-pointer items-center gap-3 text-base" style={{ fontFamily: LABEL_FONT }}>
                      <input
                        type="checkbox"
                        checked={giftOn}
                        onChange={(e) => setGiftOn(e.target.checked)}
                        className="size-4"
                        style={{ accentColor: foil }}
                      />
                      {t("guestbook.gift")}
                    </label>
                    {giftOn && (
                      <div className="mt-3">
                        <div className="flex items-end gap-3">
                          <input
                            type="number"
                            inputMode="decimal"
                            min={0}
                            value={giftAmount}
                            onChange={(e) => setGiftAmount(e.target.value)}
                            placeholder={t("guestbook.giftAmount")}
                            className="w-full bg-transparent pb-2 text-xl outline-none placeholder:opacity-40"
                            style={fieldStyle}
                          />
                          <div className="flex shrink-0">
                            {(["USD", "KHR"] as const).map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => setGiftCurrency(c)}
                                className="px-3 py-2 text-xs tracking-widest"
                                style={{
                                  fontFamily: LABEL_FONT,
                                  border: `1px solid ${mix(theme.text_color, 35)}`,
                                  backgroundColor: giftCurrency === c ? theme.text_color : "transparent",
                                  color: giftCurrency === c ? theme.bg_color : theme.text_color,
                                }}
                              >
                                {c === "USD" ? "$ USD" : "៛ KHR"}
                              </button>
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-xs opacity-60" style={{ fontFamily: LABEL_FONT }}>
                          {t("guestbook.giftNote")}
                        </p>
                      </div>
                    )}
                  </div>

                  {state === "error" && (
                    <p role="alert" className="text-sm" style={{ color: "#b3261e" }}>
                      {t("guestbook.error")}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={!canSubmit || state === "sending"}
                    className="px-6 py-4 text-xs font-medium uppercase tracking-[0.4em] transition disabled:opacity-40"
                    style={{ backgroundColor: theme.text_color, color: foil, fontFamily: LABEL_FONT }}
                  >
                    {state === "sending" ? t("guestbook.sending") : t("guestbook.submit")}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* --- wall --- */}
          <div>
            <Eyebrow color={foil} className="mb-6">
              {t("guestbook.wall")}
            </Eyebrow>
            {hasWall ? (
              <ul className="columns-1 gap-5 sm:columns-2">
                {(guestbook?.wishes ?? []).map((w) => {
                  const p = w.photo_id ? photoById.get(w.photo_id) : undefined;
                  return (
                    <li
                      key={w.wish_id}
                      className="mb-5 break-inside-avoid p-4"
                      style={{ border: `1px solid ${mix(theme.text_color, 18)}` }}
                    >
                      {p && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.url} alt="" className="mb-3 w-full object-cover" loading="lazy" />
                      )}
                      <p className="text-lg italic leading-relaxed">“{w.message}”</p>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.3em]" style={{ color: foil, fontFamily: LABEL_FONT }}>
                        — {w.name}
                      </p>
                    </li>
                  );
                })}
                {loosePhotos.map((p) => (
                  <li key={p.photo_id} className="mb-5 break-inside-avoid p-2" style={{ border: `1px solid ${mix(foil, 60)}` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt="" className="w-full object-cover" loading="lazy" />
                    {p.uploader_name && (
                      <p className="mt-2 text-[11px] uppercase tracking-[0.3em]" style={{ color: foil, fontFamily: LABEL_FONT }}>
                        {p.uploader_name}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg italic opacity-60">{t("guestbook.empty")}</p>
            )}
          </div>
        </div>

        {/* --- actions --- */}
        <div className="mt-20 text-center">
          <Eyebrow color={foil}>{t("guestbook.actionsHeading")}</Eyebrow>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {actionButtons.map(({ key, icon: Icon, label, onClick }) => (
              <button
                key={key}
                type="button"
                onClick={onClick}
                className="flex items-center gap-3 px-5 py-3 text-xs uppercase tracking-[0.3em] transition hover:opacity-80"
                style={{ border: `1px solid ${foil}`, fontFamily: LABEL_FONT }}
              >
                <Icon className="size-4" style={{ color: foil }} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </InkSection>
  );
}
