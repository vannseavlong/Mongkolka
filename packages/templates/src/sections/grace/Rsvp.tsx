"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { GraceSection, Cross, GoldDivider, Reveal, FoilText, gracePalette, nameFont, DISPLAY_FONT } from "./shared";
import { GraceFormStyle, ERROR_COLOR, cardStyle, fieldStyle, formVars, primaryButtonStyle } from "./rsvp-ui";
import { useLanguage } from "../../i18n";
import { useGuest } from "../../guest-context";
import type { RsvpContent, Theme } from "../../types";
import type { RsvpSubmission } from "../rsvp/Classic";

export interface GraceRsvpProps {
  theme: Theme;
  content?: RsvpContent;
  /** Left to the consuming app: packages/templates never calls fetch() itself. */
  onSubmit: (submission: RsvpSubmission) => Promise<void>;
}

const MAX_GUESTS = 10;

export function GraceRsvp({ theme, content, onSubmit }: GraceRsvpProps) {
  const { t, language } = useLanguage();
  const { name: invitedName } = useGuest();
  const p = gracePalette(theme);

  const [name, setName] = useState(invitedName ?? "");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [tried, setTried] = useState(false);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (invitedName) setName((n) => n || invitedName);
  }, [invitedName]);
  useEffect(() => {
    if (state === "done") doneRef.current?.focus();
  }, [state]);

  const nameError = tried && !name.trim();
  const attendError = tried && attending === null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setTried(true);
    if (!name.trim() || attending === null) return;
    setState("sending");
    // The API only knows plusOne; a bigger party is passed along inside the message so the couple sees the number.
    const party = attending && guests > 1 ? `${t("grace.rsvp.guestsNote")}: ${guests}` : "";
    const note = [message.trim(), party].filter(Boolean).join("\n");
    try {
      await onSubmit({ name: name.trim(), attending, plusOne: attending && guests > 1, message: note || undefined });
      setState("done");
    } catch {
      setState("error");
    }
  }

  const heading = nameFont(language);
  const labelCls = "mb-1.5 block text-base font-medium";

  return (
    <GraceSection theme={theme} id="rsvp" className="text-center" maxWidth="max-w-xl">
      <GraceFormStyle />
      <Reveal>
        <Cross stroke={p.accent} className="mx-auto h-9 w-auto" strokeWidth={3} />
        <h2
          className="mt-4 text-5xl leading-tight sm:text-6xl"
          style={{ fontFamily: heading, color: p.accent }}
        >
          <FoilText theme={theme}>{t("grace.rsvp.heading")}</FoilText>
        </h2>
        {content?.customMessage ? (
          <p className="mx-auto mt-5 max-w-md whitespace-pre-line break-words text-lg" style={{ color: p.text }}>
            {content.customMessage}
          </p>
        ) : null}
        {content?.deadline ? (
          <p className="mt-3 text-base" style={{ color: p.accent }}>
            {t("grace.rsvp.deadlinePrefix")} {content.deadline}
          </p>
        ) : null}
        <GoldDivider theme={theme} className="mt-6" />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="grace-form mt-8 p-6 text-left sm:p-9" style={{ ...cardStyle(theme), ...formVars(theme), fontFamily: DISPLAY_FONT }}>
          {state === "done" ? (
            <div ref={doneRef} tabIndex={-1} role="status" className="py-6 text-center outline-none">
              <Cross stroke={p.accent} className="mx-auto h-10 w-auto" strokeWidth={3} />
              <p className="mt-4 text-4xl" style={{ fontFamily: heading, color: p.accent }}>
                {t("grace.rsvp.thanksTitle")}
                {name.trim() ? `, ${name.trim()}` : ""}
              </p>
              <p className="mt-3 break-words text-lg">{attending ? t("grace.rsvp.thanksYes") : t("grace.rsvp.thanksNo")}</p>
              <button
                type="button"
                onClick={() => setState("idle")}
                className="mt-6 min-h-11 px-4 text-base underline underline-offset-4"
                style={{ color: p.accent }}
              >
                {t("grace.rsvp.change")}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-6">
              <div>
                <label htmlFor="grace-rsvp-name" className={labelCls}>
                  {t("grace.rsvp.nameLabel")}
                </label>
                <input
                  id="grace-rsvp-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  autoComplete="name"
                  required
                  aria-invalid={nameError || undefined}
                  aria-describedby={nameError ? "grace-rsvp-name-err" : undefined}
                  style={fieldStyle(theme, nameError)}
                />
                {nameError && (
                  <p id="grace-rsvp-name-err" className="mt-1.5 text-base" style={{ color: ERROR_COLOR }}>
                    {t("grace.rsvp.nameRequired")}
                  </p>
                )}
              </div>

              <fieldset aria-describedby={attendError ? "grace-rsvp-att-err" : undefined}>
                <legend className={labelCls}>{t("grace.rsvp.attendLegend")}</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      [true, t("grace.rsvp.accept")],
                      [false, t("grace.rsvp.decline")],
                    ] as const
                  ).map(([val, label]) => (
                    <label key={String(val)} className="grace-pill relative block cursor-pointer">
                      <input
                        type="radio"
                        name="grace-rsvp-attending"
                        className="sr-only"
                        checked={attending === val}
                        onChange={() => setAttending(val)}
                        aria-invalid={attendError || undefined}
                      />
                      <span
                        className="grace-pill-face flex min-h-14 items-center justify-center rounded-full px-5 py-3 text-center text-lg"
                        style={{ borderColor: attendError ? ERROR_COLOR : undefined }}
                      >
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
                {attendError && (
                  <p id="grace-rsvp-att-err" className="mt-1.5 text-base" style={{ color: ERROR_COLOR }}>
                    {t("grace.rsvp.attendRequired")}
                  </p>
                )}
              </fieldset>

              {attending === true && (
                <div role="group" aria-labelledby="grace-rsvp-guests-label">
                  <span id="grace-rsvp-guests-label" className={labelCls}>
                    {t("grace.rsvp.guestsLabel")}
                  </span>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      aria-label={t("grace.rsvp.guestsLess")}
                      disabled={guests <= 1}
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="flex size-12 items-center justify-center rounded-full disabled:opacity-40"
                      style={{ border: `1px solid ${p.accent}`, color: p.accent }}
                    >
                      <Minus className="size-5" aria-hidden />
                    </button>
                    <output aria-live="polite" className="min-w-10 text-center text-3xl" style={{ color: p.text, fontVariantNumeric: "lining-nums" }}>
                      {guests}
                    </output>
                    <button
                      type="button"
                      aria-label={t("grace.rsvp.guestsMore")}
                      disabled={guests >= MAX_GUESTS}
                      onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))}
                      className="flex size-12 items-center justify-center rounded-full disabled:opacity-40"
                      style={{ border: `1px solid ${p.accent}`, color: p.accent }}
                    >
                      <Plus className="size-5" aria-hidden />
                    </button>
                    <span className="text-base" style={{ color: p.muted }}>
                      {t("grace.rsvp.guestsHint")}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="grace-rsvp-message" className={labelCls}>
                  {t("grace.rsvp.messageLabel")}
                </label>
                <textarea
                  id="grace-rsvp-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="resize-none"
                  style={fieldStyle(theme)}
                />
              </div>

              <div aria-live="polite">
                {state === "error" && (
                  <p role="alert" className="text-base" style={{ color: ERROR_COLOR }}>
                    {t("grace.rsvp.error")}
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
                {state === "sending" ? t("grace.rsvp.sending") : t("grace.rsvp.submit")}
              </button>
            </form>
          )}
        </div>
      </Reveal>
    </GraceSection>
  );
}
