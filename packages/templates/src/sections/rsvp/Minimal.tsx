"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { RsvpContent, Theme } from "../../types";
import type { RsvpSubmission } from "./Classic";
import { useLanguage } from "../../i18n";

export interface RsvpMinimalProps {
  theme: Theme;
  content?: RsvpContent;
  /** Left to the consuming app — packages/templates never calls fetch() itself. */
  onSubmit: (submission: RsvpSubmission) => Promise<void>;
}

/** An understated, borderless form with underline inputs instead of Classic's boxed fields. */
export function RsvpMinimal({ theme, content, onSubmit }: RsvpMinimalProps) {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [attending, setAttending] = useState(true);

  const fieldStyle = {
    borderBottom: `1px solid ${theme.accent_color}`,
    color: theme.text_color,
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-md px-6 py-20"
      style={{
        backgroundColor: theme.bg_color,
        color: theme.text_color,
        fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
      }}
    >
      <h2 className="mb-1 text-center text-xs font-medium uppercase tracking-[0.3em] opacity-80">
        {t("section.rsvp.heading")}
      </h2>
      {content?.customMessage && (
        <p className="mt-4 text-center text-sm opacity-80">{content.customMessage}</p>
      )}
      {content?.deadline && (
        <p className="mt-2 text-center text-xs opacity-60">
          {t("section.rsvp.deadlinePrefix")} {content.deadline}
        </p>
      )}

      {submitted ? (
        <p className="mt-10 text-center text-sm">{t("section.rsvp.thankYou")}</p>
      ) : (
        <form
          className="mt-10 flex flex-col gap-6"
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
            className="bg-transparent py-2 text-sm outline-none"
            style={fieldStyle}
          />
          <div className="flex flex-col gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" name="attending" checked={attending} onChange={() => setAttending(true)} />
              {t("section.rsvp.attending")}
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="attending" checked={!attending} onChange={() => setAttending(false)} />
              {t("section.rsvp.declining")}
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="plusOne" /> {t("section.rsvp.plusOne")}
            </label>
          </div>
          <textarea
            name="message"
            placeholder={t("section.rsvp.messagePlaceholder")}
            className="resize-none bg-transparent py-2 text-sm outline-none"
            style={fieldStyle}
            rows={2}
          />
          <button
            type="submit"
            disabled={submitting}
            className="self-center text-sm font-medium uppercase tracking-widest underline decoration-1 underline-offset-4 disabled:opacity-50"
            style={{ color: theme.accent_color }}
          >
            {submitting ? t("section.rsvp.submitting") : t("section.rsvp.submit")}
          </button>
        </form>
      )}
    </motion.section>
  );
}
