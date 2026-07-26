"use client";

import { useState } from "react";
import type { RsvpContent, Theme } from "../../types";

export interface RsvpSubmission {
  name: string;
  attending: boolean;
  plusOne: boolean;
  message?: string;
}

export interface RsvpClassicProps {
  theme: Theme;
  content?: RsvpContent;
  /** Left to the consuming app — packages/templates never calls fetch() itself. */
  onSubmit: (submission: RsvpSubmission) => Promise<void>;
}

export function RsvpClassic({ theme, content, onSubmit }: RsvpClassicProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [attending, setAttending] = useState(true);

  return (
    <section
      className="mx-auto max-w-lg px-6 py-20"
      style={{
        backgroundColor: theme.bg_color,
        color: theme.text_color,
        fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
      }}
    >
      <h2 className="mb-2 text-center text-2xl font-medium" style={{ color: theme.accent_color }}>
        RSVP
      </h2>
      {content?.customMessage && (
        <p className="mb-6 text-center text-sm opacity-80">{content.customMessage}</p>
      )}
      {content?.deadline && (
        <p className="mb-6 text-center text-xs opacity-60">Please respond by {content.deadline}</p>
      )}

      {submitted ? (
        <p className="text-center">Thank you for your response!</p>
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
            placeholder="Your name"
            className="rounded-md border px-3 py-2"
            style={{ borderColor: theme.accent_color }}
          />
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="attending"
                checked={attending}
                onChange={() => setAttending(true)}
              />
              Joyfully attending
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="attending"
                checked={!attending}
                onChange={() => setAttending(false)}
              />
              Regretfully declining
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="plusOne" /> Bringing a plus one
          </label>
          <textarea
            name="message"
            placeholder="Message for the couple (optional)"
            className="rounded-md border px-3 py-2"
            style={{ borderColor: theme.accent_color }}
            rows={3}
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md px-4 py-2 font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: theme.accent_color }}
          >
            {submitting ? "Sending…" : "Send RSVP"}
          </button>
        </form>
      )}
    </section>
  );
}
