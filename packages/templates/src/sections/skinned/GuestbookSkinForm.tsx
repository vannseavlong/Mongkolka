"use client";

import { ImagePlus, X } from "lucide-react";
import type { Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { useSkinOrnaments } from "../khmer/skin-context";
import { ACCEPTED_PHOTO_TYPES, MAX_WISH } from "../grace/guestbook-logic";
import { mediaFor } from "./gallery-media";
import { mediaTones } from "./gallery-tones";
import { ERROR_KEY } from "./guestbook-wall-logic";
import type { useGuestbookForm } from "./guestbook-form";

type Form = ReturnType<typeof useGuestbookForm>;

const LABEL = "mb-1.5 block text-base font-medium";

/** The guest form (photo, name, wish, submit) and its thank-you state, styled by the active skin. */
export function SkinGuestbookForm({ theme, form }: { theme: Theme; form: Form }) {
  const { t, language } = useLanguage();
  const sk = useSkinOrnaments();
  const media = mediaFor(sk);
  const tone = mediaTones(theme);
  const { refs, errors } = form;

  if (form.phase === "done") {
    return (
      <div ref={refs.doneRef} tabIndex={-1} role="status" className="py-4 text-center outline-none">
        <div className="mx-auto mb-3 w-fit">
          <sk.Crest color={theme.accent_color} ground={theme.bg_color} label="♥" size={64} />
        </div>
        <p className="m-0 text-2xl" style={sk.heading(theme, language)}>
          {t("grace.guestbook.thanksTitle")}
          {form.name.trim() ? `, ${form.name.trim()}` : ""}
        </p>
        <p className="mt-3 text-base leading-relaxed">
          {form.resultStatus === "approved" ? t("grace.guestbook.thanksApproved") : t("grace.guestbook.thanksPending")}
        </p>
        <button type="button" onClick={form.reset} className="sk-link mt-5 min-h-11 bg-transparent px-4 text-base underline underline-offset-4" style={{ color: tone.accent }}>
          {t("grace.guestbook.another")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={form.submit} noValidate className="flex flex-col gap-6">
      <div>
        <span id="sk-gb-photo-label" className={LABEL}>
          {t("grace.guestbook.photoLabel")}
        </span>
        <input
          ref={refs.fileRef}
          id="sk-gb-file"
          type="file"
          accept={ACCEPTED_PHOTO_TYPES.join(",")}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => form.pick(e.target.files?.[0] ?? null)}
        />
        {form.preview ? (
          <div className="flex items-center gap-4">
            <div className="w-28 shrink-0">
              <media.Frame theme={theme} index={0} variant="preview" aspect="aspect-[3/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.preview} alt={t("grace.guestbook.previewAlt")} className="absolute inset-0 h-full w-full object-cover" />
              </media.Frame>
            </div>
            <div className="flex flex-col items-start gap-1">
              <button type="button" onClick={() => refs.fileRef.current?.click()} className="sk-link min-h-11 bg-transparent px-1 text-base underline underline-offset-4" style={{ color: tone.accent }}>
                {t("grace.guestbook.changePhoto")}
              </button>
              <button type="button" onClick={form.removePhoto} className="sk-link flex min-h-11 items-center gap-2 bg-transparent px-1 text-base">
                <X className="size-4" aria-hidden />
                {t("grace.guestbook.removePhoto")}
              </button>
            </div>
          </div>
        ) : (
          <button
            ref={refs.photoBtnRef}
            type="button"
            onClick={() => refs.fileRef.current?.click()}
            aria-labelledby="sk-gb-photo-label sk-gb-photo-cta"
            aria-describedby={form.pickError ? "sk-gb-photo-err" : undefined}
            className="sk-field flex min-h-32 w-full flex-col items-center justify-center gap-2 px-4 py-6 text-center"
            style={{ ...media.field(theme, !!form.pickError), borderStyle: "dashed", color: tone.ink }}
          >
            <ImagePlus className="size-7" style={{ color: tone.accent }} aria-hidden />
            <span id="sk-gb-photo-cta" className="text-lg">
              {t("grace.guestbook.addPhoto")}
            </span>
            <span className="text-base" style={{ color: tone.muted }}>
              {t("grace.guestbook.addPhotoHint")}
            </span>
          </button>
        )}
        {form.pickError && (
          <p id="sk-gb-photo-err" role="alert" className="mt-1.5 text-base" style={{ color: tone.error }}>
            {t(ERROR_KEY[form.pickError])}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="sk-gb-name" className={LABEL}>
          {t("grace.guestbook.nameLabel")}
        </label>
        <input
          id="sk-gb-name"
          ref={refs.nameRef}
          value={form.name}
          onChange={(e) => form.setName(e.target.value)}
          maxLength={80}
          autoComplete="name"
          required
          aria-invalid={errors.name || undefined}
          aria-describedby={errors.name ? "sk-gb-name-err" : undefined}
          className="sk-field"
          style={media.field(theme, errors.name)}
        />
        {errors.name && (
          <p id="sk-gb-name-err" role="alert" className="mt-1.5 text-base" style={{ color: tone.error }}>
            {t("grace.guestbook.nameRequired")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="sk-gb-wish" className={LABEL}>
          {t("grace.guestbook.wishLabel")}
        </label>
        <textarea
          id="sk-gb-wish"
          ref={refs.wishRef}
          value={form.message}
          onChange={(e) => form.setMessage(e.target.value.slice(0, MAX_WISH))}
          rows={4}
          maxLength={MAX_WISH}
          aria-invalid={errors.empty || undefined}
          aria-describedby={`sk-gb-count${errors.empty ? " sk-gb-need-err" : ""}`}
          className="sk-field resize-none"
          style={media.field(theme, errors.empty)}
        />
        <p id="sk-gb-count" className="mt-1 text-right text-base" style={{ color: tone.muted }}>
          {MAX_WISH - form.message.length} {t("grace.guestbook.counter")}
        </p>
        {errors.empty && (
          <p id="sk-gb-need-err" role="alert" className="mt-1 text-base" style={{ color: tone.error }}>
            {t("grace.guestbook.needSomething")}
          </p>
        )}
      </div>

      <div aria-live="polite">
        {form.phase === "error" && form.errorKind && (
          <p role="alert" className="text-base" style={{ color: tone.error }}>
            {t(ERROR_KEY[form.errorKind])}
          </p>
        )}
      </div>

      <button type="submit" disabled={form.phase === "sending"} aria-busy={form.phase === "sending"} className="sk-btn mx-auto w-full text-lg sm:w-auto" style={media.button(theme)}>
        {form.phase === "sending" ? t("grace.guestbook.sending") : t("grace.guestbook.submit")}
      </button>
    </form>
  );
}
