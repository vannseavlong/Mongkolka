"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { RsvpContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { useGuest } from "../../guest-context";
import { withAlpha } from "../../chrome/gold";
import { OrnateSection } from "../khmer/OrnateSection";
import type { RsvpSubmission } from "../rsvp/Classic";
import { MAX_GUESTS, MAX_MESSAGE, MAX_NAME, buildRsvpSubmission, clampGuests, rsvpErrors } from "./rsvp-logic";
import { useSkinUi } from "./skin-ui-context";
import { errorColorFor } from "./ui-shared";

export interface RsvpSkinProps {
  theme: Theme;
  content?: RsvpContent;
  /** Left to the consuming app: packages/templates never calls fetch() itself. */
  onSubmit: (submission: RsvpSubmission) => Promise<void>;
  /** Wish-only mode: just a name and a message, no attendance or guest count. The wish goes to `onWish`. */
  wishOnly?: boolean;
  onWish?: (wish: { name: string; message: string }) => Promise<void>;
}

const FORM_CSS =
  ".sk-form input:focus-visible,.sk-form textarea:focus-visible,.sk-form button:focus-visible{outline:2px solid var(--sk-accent);outline-offset:2px}" +
  ".sk-pill input:focus-visible+span{outline:2px solid var(--sk-accent);outline-offset:2px}" +
  "@media (prefers-reduced-motion:no-preference){.sk-form button,.sk-pill span{transition:transform .18s,opacity .2s,background-color .2s}.sk-form button:active{transform:scale(.97)}}" +
  ".sk-form button:disabled{opacity:.5}";

/**
 * The RSVP on the active skin's card. Same behaviour as every RSVP in the product (name prefilled from the
 * invitation link, attend yes/no, guest count, note, sending / error / thank-you states); the look of the
 * fields, pills, steppers and button comes from the skin.
 */
export function RsvpSkin({ theme, content, onSubmit, wishOnly = false, onWish }: RsvpSkinProps) {
  const { t } = useLanguage();
  const { name: invitedName } = useGuest();
  const ui = useSkinUi();
  const err = errorColorFor(theme);

  const [name, setName] = useState((invitedName ?? "").slice(0, MAX_NAME));
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [tried, setTried] = useState(false);
  const doneRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const attendRef = useRef<HTMLInputElement>(null);
  const refocus = useRef(false);

  useEffect(() => {
    if (invitedName) setName((n) => n || invitedName.slice(0, MAX_NAME));
  }, [invitedName]);
  useEffect(() => {
    if (state === "done") doneRef.current?.focus();
    if (state === "idle" && refocus.current) {
      refocus.current = false;
      nameRef.current?.focus();
    }
  }, [state]);

  const errors = wishOnly ? { name: !name.trim(), attending: false } : rsvpErrors({ name, attending });
  const messageMissing = wishOnly && !message.trim();
  const nameError = tried && errors.name;
  const attendError = tried && errors.attending;
  const messageError = tried && messageMissing;
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const label = { color: ui.labelColor(theme) };
  const labelCls = "mb-1.5 block text-[15px] font-semibold";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setTried(true);
    if (errors.name) return nameRef.current?.focus();
    if (errors.attending) return attendRef.current?.focus();
    if (messageMissing) return messageRef.current?.focus();
    setState("sending");
    try {
      if (wishOnly) await onWish?.({ name: name.trim(), message: message.trim() });
      else await onSubmit(buildRsvpSubmission({ name, attending, guests, message }));
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <OrnateSection theme={theme} id="rsvp" heading={wishOnly ? t("covenant.wish.heading") : t("grace.rsvp.heading")}>
      <style>{FORM_CSS}</style>
      {!wishOnly && content?.customMessage ? <p className="m-0 mb-2 whitespace-pre-line break-words text-[15px] leading-relaxed">{content.customMessage}</p> : null}
      {!wishOnly && content?.deadline ? (
        <p className="m-0 mb-4 text-sm font-semibold" style={{ color: theme.accent_color }}>
          {t("grace.rsvp.deadlinePrefix")} {content.deadline}
        </p>
      ) : null}

      <div className="sk-form text-left" style={{ ["--sk-accent" as string]: theme.accent_color }}>
        {state === "done" ? (
          <div ref={doneRef} tabIndex={-1} role="status" className="py-4 text-center outline-none">
            <div className="mx-auto w-fit" aria-hidden>
              <ui.Mark color={theme.accent_color} size={56} />
            </div>
            <p className="m-0 mt-3 text-xl font-semibold" style={{ color: theme.accent_color }}>
              {t("grace.rsvp.thanksTitle")}
              {name.trim() ? `, ${name.trim()}` : ""}
            </p>
            <p className="m-0 mt-2 break-words text-[15px]">{wishOnly ? t("covenant.wish.thanks") : attending ? t("grace.rsvp.thanksYes") : t("grace.rsvp.thanksNo")}</p>
            <button
              type="button"
              onClick={() => {
                refocus.current = true;
                setState("idle");
              }}
              className="mt-4 min-h-11 px-4 text-sm underline underline-offset-4"
              style={{ color: theme.accent_color }}
            >
              {wishOnly ? t("covenant.wish.another") : t("grace.rsvp.change")}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="flex flex-col gap-5">
            <div>
              <label htmlFor="sk-rsvp-name" className={labelCls} style={label}>
                {t("grace.rsvp.nameLabel")}
              </label>
              <input
                id="sk-rsvp-name"
                ref={nameRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={MAX_NAME}
                autoComplete="name"
                required
                aria-invalid={nameError || undefined}
                aria-describedby={nameError ? "sk-rsvp-name-err" : undefined}
                style={ui.field(theme, nameError)}
              />
              {nameError && (
                <p id="sk-rsvp-name-err" role="alert" className="m-0 mt-1.5 text-sm" style={{ color: err }}>
                  {t("grace.rsvp.nameRequired")}
                </p>
              )}
            </div>

            {!wishOnly && (
            <fieldset className="m-0 border-0 p-0" aria-describedby={attendError ? "sk-rsvp-att-err" : undefined}>
              <legend className={labelCls} style={label}>
                {t("grace.rsvp.attendLegend")}
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    [true, t("grace.rsvp.accept")],
                    [false, t("grace.rsvp.decline")],
                  ] as const
                ).map(([val, text], idx) => (
                  <label key={String(val)} className="sk-pill relative block cursor-pointer">
                    <input
                      type="radio"
                      ref={idx === 0 ? attendRef : undefined}
                      name="sk-rsvp-attending"
                      className="sr-only"
                      checked={attending === val}
                      onChange={() => setAttending(val)}
                      aria-invalid={attendError || undefined}
                    />
                    <span className="flex min-h-14 items-center justify-center px-4 py-3 text-center text-[15px] font-medium" style={ui.chip(theme, attending === val, attendError)}>
                      {text}
                    </span>
                  </label>
                ))}
              </div>
              {attendError && (
                <p id="sk-rsvp-att-err" role="alert" className="m-0 mt-1.5 text-sm" style={{ color: err }}>
                  {t("grace.rsvp.attendRequired")}
                </p>
              )}
            </fieldset>
            )}

            {!wishOnly && attending === true && (
              <div role="group" aria-labelledby="sk-rsvp-guests-label">
                <span id="sk-rsvp-guests-label" className={labelCls} style={label}>
                  {t("grace.rsvp.guestsLabel")}
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    aria-label={t("grace.rsvp.guestsLess")}
                    disabled={guests <= 1}
                    onClick={() => setGuests((g) => clampGuests(g - 1))}
                    className="flex size-11 items-center justify-center rounded-full"
                    style={ui.stepper(theme)}
                  >
                    <Minus className="size-5" aria-hidden />
                  </button>
                  <output aria-live="polite" className="min-w-8 text-center text-2xl font-semibold" style={{ fontVariantNumeric: "lining-nums" }}>
                    {guests}
                  </output>
                  <button
                    type="button"
                    aria-label={t("grace.rsvp.guestsMore")}
                    disabled={guests >= MAX_GUESTS}
                    onClick={() => setGuests((g) => clampGuests(g + 1))}
                    className="flex size-11 items-center justify-center rounded-full"
                    style={ui.stepper(theme)}
                  >
                    <Plus className="size-5" aria-hidden />
                  </button>
                  <span className="text-sm" style={{ color: withAlpha(theme.text_color, 0.7) }}>
                    {t("grace.rsvp.guestsHint")}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="sk-rsvp-message" className={labelCls} style={label}>
                {wishOnly ? t("covenant.wish.messageLabel") : t("grace.rsvp.messageLabel")}
              </label>
              <textarea
                id="sk-rsvp-message"
                ref={messageRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={wishOnly ? 5 : 3}
                maxLength={MAX_MESSAGE}
                className="resize-none"
                aria-invalid={messageError || undefined}
                aria-describedby={messageError ? "sk-rsvp-message-err" : undefined}
                style={ui.field(theme, messageError)}
              />
              {messageError && (
                <p id="sk-rsvp-message-err" role="alert" className="m-0 mt-1.5 text-sm" style={{ color: err }}>
                  {t("covenant.wish.messageRequired")}
                </p>
              )}
            </div>

            <div aria-live="polite">
              {state === "error" && (
                <p role="alert" className="m-0 text-sm" style={{ color: err }}>
                  {t("grace.rsvp.error")}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={state === "sending"}
              aria-busy={state === "sending"}
              className="px-6 text-[17px] font-semibold"
              style={ui.button(theme)}
            >
              {state === "sending" ? t("grace.rsvp.sending") : wishOnly ? t("covenant.wish.submit") : t("grace.rsvp.submit")}
            </button>
          </form>
        )}
      </div>
    </OrnateSection>
  );
}
