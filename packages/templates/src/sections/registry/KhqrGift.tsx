"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { RegistryContent, Theme } from "../../types";
import { useLanguage } from "../../i18n";
import { goldGradient, goldStops, mixHex, withAlpha } from "../../chrome/gold";
import { CINZEL_FONT, KHMER_BODY_FONT, MOUL_FONT } from "../../chrome/fonts";
import { copyText, toGiftView, type CopyOutcome } from "./khqr-gift-logic";
import { giftText } from "./khqr-gift-strings";

export interface RegistryKhqrProps {
  theme: Theme;
  content?: RegistryContent;
}

const TOAST_MS = 2400;

/**
 * Gift card: a gold-foil framed plate holding the couple's own KHQR image, bank, account name and
 * number, with a copy button. Display only; nothing is collected or processed. Theme-driven: gold
 * comes from the accent, there is no card around the QR, so every skin gets the same quality.
 */
export function RegistryKhqr({ theme, content }: RegistryKhqrProps) {
  const { language, t: tr } = useLanguage();
  const reduce = useReducedMotion();
  const [outcome, setOutcome] = useState<CopyOutcome | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const gift = toGiftView(content);
  if (!gift) return null;

  const t = (k: Parameters<typeof giftText>[1]) => giftText(language, k);
  const heading = tr("registry.gift.heading"); // the same key the couple's own title overrides
  const stops = goldStops(theme.accent_color);
  const ink = theme.text_color; // sits straight on the page: no card, no frame
  const toastBg = mixHex(theme.accent_color, "#1f1404", 28);
  const isKh = language === "kh";

  async function onCopy() {
    if (!gift?.accountNumberCopy) return;
    const result = await copyText(gift.accountNumberCopy, {
      writeText: navigator.clipboard?.writeText?.bind(navigator.clipboard),
      legacyCopy: legacyCopy,
    });
    setOutcome(result);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOutcome(null), TOAST_MS);
  }

  return (
    <section
      id="gift"
      className="px-5 py-20"
      style={{ backgroundColor: theme.bg_color, color: theme.text_color, fontFamily: isKh ? KHMER_BODY_FONT : undefined }}
    >
      <h2
        className="mb-10 text-center text-2xl"
        style={{ color: theme.accent_color, fontFamily: isKh ? MOUL_FONT : CINZEL_FONT, letterSpacing: isKh ? undefined : "0.14em" }}
      >
        {heading}
      </h2>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto w-full max-w-[24rem]"
      >
        <div className="relative px-3 pb-2 text-center" style={{ color: ink }}>
          {gift.imageUrl && (
            <>
              {(() => {
                // The couple's own image goes in as it is (it usually already carries the bank's frame), just given room.
                const image = (
                  // eslint-disable-next-line @next/next/no-img-element -- user-supplied QR; next/image needs known hosts
                  <img src={gift.imageUrl} alt={t("qrAlt")} className="mx-auto block h-auto w-full rounded-lg object-contain" loading="lazy" />
                );
                return gift.linkUrl ? (
                  <>
                    <a
                      href={gift.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("tapToPay")}
                      className="mx-auto block w-full rounded-lg py-3 outline-none transition-transform active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                      {image}
                    </a>
                    <p className="mt-2 text-xs opacity-80" style={{ fontFamily: isKh ? KHMER_BODY_FONT : undefined }}>
                      {t("tapToPay")}
                    </p>
                  </>
                ) : (
                  <div className="py-3">{image}</div>
                );
              })()}
            </>
          )}

          <dl className="mt-6 space-y-3">
            {gift.bank && <Row label={t("bank")} value={gift.bank} ink={ink} />}
            {gift.accountName && <Row label={t("accountName")} value={gift.accountName} ink={ink} />}
            {gift.accountNumberDisplay && (
              <Row label={t("accountNumber")} value={gift.accountNumberDisplay} ink={ink} big />
            )}
          </dl>

          {gift.accountNumberCopy && (
            <button
              type="button"
              onClick={onCopy}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold outline-none transition-transform active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                background: goldGradient(theme.accent_color, 160),
                color: "#2a1a00",
                boxShadow: `inset 0 1px 0 ${withAlpha("#ffffff", 0.6)}, 0 4px 10px ${withAlpha(stops.lo, 0.45)}`,
                fontFamily: isKh ? KHMER_BODY_FONT : undefined,
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {outcome === "copied" ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15" /></>}
              </svg>
              {outcome === "copied" ? t("copied") : t("copy")}
            </button>
          )}
        </div>
      </motion.div>

      {/* Polite live region: announced by screen readers, shown as a small toast. */}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex justify-center px-4">
        {outcome && (
          <span
            className="rounded-full px-4 py-2 text-sm shadow-lg"
            style={{ backgroundColor: toastBg, color: "#fff6dc", border: `1px solid ${stops.mid}`, fontFamily: isKh ? KHMER_BODY_FONT : undefined }}
          >
            {outcome === "copied" ? t("copiedToast") : t("failedToast")}
          </span>
        )}
      </div>
    </section>
  );
}

function Row({ label, value, ink, big }: { label: string; value: string; ink: string; big?: boolean }) {
  return (
    <div>
      <dt className="text-[0.7rem] uppercase tracking-[0.18em] opacity-75" style={{ color: ink }}>
        {label}
      </dt>
      <dd
        className={big ? "mt-0.5 break-all text-xl font-semibold tabular-nums tracking-[0.08em]" : "mt-0.5 break-words text-base font-medium"}
        style={{ color: ink }}
      >
        {value}
      </dd>
    </div>
  );
}

/** execCommand fallback for browsers/contexts without the async Clipboard API. */
function legacyCopy(text: string): boolean {
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.cssText = "position:fixed;top:0;left:0;opacity:0";
  document.body.appendChild(el);
  el.select();
  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(el);
  }
}
