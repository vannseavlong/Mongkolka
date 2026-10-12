"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { RsvpContent, Theme } from "../../types";
import type { RsvpSubmission } from "../rsvp/Classic";
import { useLanguage } from "../../i18n";
import { DISPLAY_FONT, Eyebrow, InkSection, LABEL_FONT, mix } from "./shared";

export interface RsvpReplyProps {
  theme: Theme;
  content?: RsvpContent;
  onSubmit: (submission: RsvpSubmission) => Promise<void>;
}

/** A reply card with a perforated header, postage-stamp mark and underlined fields. */
export function RsvpReply({ theme, content, onSubmit }: RsvpReplyProps) {
  const { t } = useLanguage();
  const [attending, setAttending] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const foil = theme.accent_color;
  const field = {
    borderBottom: `1px solid ${mix(theme.text_color, 45)}`,
    fontFamily: DISPLAY_FONT,
  } as const;

  return (
    <InkSection theme={theme} id="rsvp" className="px-5 py-28 sm:px-10">
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: -1.2 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative mx-auto max-w-xl px-7 pb-10 pt-14 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] sm:px-12"
        style={{ backgroundColor: mix(theme.bg_color, 100), outline: `1px solid ${mix(foil, 70)}`, outlineOffset: -10 }}
      >
        {/* perforation */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-5 border-t-2 border-dashed"
          style={{ borderColor: mix(theme.text_color, 30) }}
        />
        {/* stamp */}
        <div
          aria-hidden
          className="absolute right-6 top-10 flex size-14 rotate-6 items-center justify-center border-2 border-dashed text-[8px] uppercase tracking-widest"
          style={{ borderColor: foil, color: foil, fontFamily: LABEL_FONT }}
        >
          R.S.V.P
        </div>

        <header className="mb-8 pr-16">
          <Eyebrow color={foil}>{t("section.rsvp.heading")}</Eyebrow>
          <h2 className="mt-3 text-4xl font-light italic">{t("ink.replyCard")}</h2>
          {content?.deadline && (
            <p className="mt-2 text-sm opacity-70">
              {t("section.rsvp.deadlinePrefix")} {content.deadline}
            </p>
          )}
          {content?.customMessage && <p className="mt-4 text-base opacity-80">{content.customMessage}</p>}
        </header>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-10 text-center"
            role="status"
          >
            <p className="text-3xl italic">{t("section.rsvp.thankYou")}</p>
          </motion.div>
        ) : (
          <form
            className="flex flex-col gap-7"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const data = new FormData(form);
              setSubmitting(true);
              setError(false);
              try {
                await onSubmit({
                  name: String(data.get("name") ?? ""),
                  attending,
                  plusOne: data.get("plusOne") === "on",
                  message: String(data.get("message") ?? "") || undefined,
                });
                setSubmitted(true);
              } catch {
                setError(true);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <input
              name="name"
              required
              placeholder={t("section.rsvp.namePlaceholder")}
              className="bg-transparent pb-2 text-2xl italic outline-none placeholder:opacity-40"
              style={field}
            />

            <div className="grid grid-cols-2 gap-3" role="radiogroup">
              {[
                { value: true, label: t("section.rsvp.attending") },
                { value: false, label: t("section.rsvp.declining") },
              ].map((opt) => {
                const active = attending === opt.value;
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setAttending(opt.value)}
                    className="px-3 py-4 text-sm leading-snug transition"
                    style={{
                      border: `1px solid ${active ? theme.text_color : mix(theme.text_color, 35)}`,
                      backgroundColor: active ? theme.text_color : "transparent",
                      color: active ? theme.bg_color : theme.text_color,
                      fontFamily: LABEL_FONT,
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <label className="flex items-center gap-3 text-base" style={{ fontFamily: LABEL_FONT }}>
              <input type="checkbox" name="plusOne" className="size-4" style={{ accentColor: foil }} />
              {t("section.rsvp.plusOne")}
            </label>

            <textarea
              name="message"
              rows={3}
              placeholder={t("section.rsvp.messagePlaceholder")}
              className="resize-none bg-transparent pb-2 text-lg italic outline-none placeholder:opacity-40"
              style={field}
            />

            {error && (
              <p role="alert" className="text-sm" style={{ color: "#b3261e" }}>
                Something went wrong — please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-4 text-xs font-medium uppercase tracking-[0.4em] transition disabled:opacity-50"
              style={{ backgroundColor: theme.text_color, color: foil, fontFamily: LABEL_FONT }}
            >
              {submitting ? t("section.rsvp.submitting") : t("section.rsvp.submit")}
            </button>
          </form>
        )}
      </motion.div>
    </InkSection>
  );
}
