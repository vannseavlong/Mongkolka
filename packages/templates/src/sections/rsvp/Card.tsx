"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { RsvpContent, Theme } from "../../types";
import type { RsvpSubmission } from "./Classic";
import { useLanguage } from "../../i18n";

export interface RsvpCardProps {
  theme: Theme;
  content?: RsvpContent;
  /** Left to the consuming app — packages/templates never calls fetch() itself. */
  onSubmit: (submission: RsvpSubmission) => Promise<void>;
}

/** An elevated card with an accent-colored header band and pill-style attendance toggle. */
export function RsvpCard({ theme, content, onSubmit }: RsvpCardProps) {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [attending, setAttending] = useState(true);
  const fontFamily = theme.font_style === "serif" ? "serif" : "sans-serif";

  return (
    <section className="px-6 py-20" style={{ backgroundColor: theme.bg_color, fontFamily }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-lg overflow-hidden rounded-2xl shadow-xl"
        style={{ color: theme.text_color }}
      >
        <div
          className="px-8 py-6 text-center"
          style={{ backgroundColor: theme.accent_color, color: theme.bg_color }}
        >
          <h2 className="text-2xl font-medium">{t("section.rsvp.heading")}</h2>
          {content?.deadline && (
            <p className="mt-1 text-xs opacity-90">
              {t("section.rsvp.deadlinePrefix")} {content.deadline}
            </p>
          )}
        </div>
        <div className="p-8">
          {content?.customMessage && (
            <p className="mb-6 text-center text-sm opacity-80">{content.customMessage}</p>
          )}

          {submitted ? (
            <p className="text-center">{t("section.rsvp.thankYou")}</p>
          ) : (
            <form
              className="flex flex-col gap-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
                const plusOne = (form.elements.namedItem("plusOne") as HTMLInputElement).checked;
                setSubmitting(true);
                try {
                  await onSubmit({ name, attending, plusOne, message });
                  setSubmitted(true);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <input
                name="name"
                required
                placeholder={t("section.rsvp.namePlaceholder")}
                className="rounded-xl px-4 py-3 shadow-sm outline-none"
                style={{ backgroundColor: theme.bg_color, border: `1px solid ${theme.accent_color}` }}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAttending(true)}
                  className="flex-1 rounded-full px-3 py-2 text-sm font-medium transition-opacity"
                  style={{
                    backgroundColor: attending ? theme.accent_color : "transparent",
                    color: attending ? theme.bg_color : theme.text_color,
                    border: `1px solid ${theme.accent_color}`,
                  }}
                >
                  {t("section.rsvp.attending")}
                </button>
                <button
                  type="button"
                  onClick={() => setAttending(false)}
                  className="flex-1 rounded-full px-3 py-2 text-sm font-medium transition-opacity"
                  style={{
                    backgroundColor: !attending ? theme.accent_color : "transparent",
                    color: !attending ? theme.bg_color : theme.text_color,
                    border: `1px solid ${theme.accent_color}`,
                  }}
                >
                  {t("section.rsvp.declining")}
                </button>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="plusOne" /> {t("section.rsvp.plusOne")}
              </label>
              <textarea
                name="message"
                placeholder={t("section.rsvp.messagePlaceholder")}
                className="rounded-xl px-4 py-3 shadow-sm outline-none"
                style={{ backgroundColor: theme.bg_color, border: `1px solid ${theme.accent_color}` }}
                rows={3}
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full px-4 py-3 font-medium disabled:opacity-50"
                style={{ backgroundColor: theme.accent_color, color: theme.bg_color }}
              >
                {submitting ? t("section.rsvp.submitting") : t("section.rsvp.submit")}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  );
}
