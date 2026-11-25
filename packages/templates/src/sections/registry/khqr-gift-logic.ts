import type { RegistryContent } from "../../types";

/** Ready-to-show gift data. No JSX, no styling: the rules live here so they test without rendering. */
export interface GiftView {
  imageUrl?: string;
  /** The QR opens this when tapped (the bank app's payment link). https only. */
  linkUrl?: string;
  bank?: string;
  accountName?: string;
  /** As the couple typed it (grouping kept), for display. */
  accountNumberDisplay?: string;
  /** Digits only, what the copy button puts on the clipboard. */
  accountNumberCopy?: string;
}

const clean = (v: unknown): string | undefined => {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t === "" ? undefined : t;
};

/** Only these URL shapes reach an <img src>: https (http for localhost in dev), or a site-relative path. The server enforces https too. */
export function safeImageUrl(value: unknown): string | undefined {
  const v = clean(value);
  if (!v) return undefined;
  if (/^https:\/\//i.test(v)) return v;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//i.test(v)) return v; // local dev storage only
  if (v.startsWith("/") && !v.startsWith("//")) return v;
  if (/^data:image\/(png|jpeg|webp|svg\+xml);/i.test(v)) return v;
  return undefined;
}

/** Only an https link may wrap the QR; anything else (javascript:, http:, relative) is dropped. */
export function safeLinkUrl(value: unknown): string | undefined {
  const v = clean(value);
  return v && /^https:\/\/[^\s]+$/i.test(v) ? v : undefined;
}

/** Digits only: what banking apps accept when pasted. */
export function accountNumberDigits(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

/** The gift view, or null when there is nothing to show (empty state renders nothing). */
export function toGiftView(content?: Partial<RegistryContent> | null): GiftView | null {
  if (!content) return null;
  const display = clean(content.accountNumber);
  const digits = display ? accountNumberDigits(display) : "";
  const view: GiftView = {
    imageUrl: safeImageUrl(content.khqrImageUrl),
    bank: clean(content.bank),
    accountName: clean(content.accountName),
    accountNumberDisplay: digits ? display : undefined,
    accountNumberCopy: digits || undefined,
  };
  const linkUrl = safeLinkUrl(content.khqrLinkUrl);
  if (linkUrl) view.linkUrl = linkUrl;
  return view.imageUrl || view.accountNumberCopy || view.accountName ? view : null;
}

export type CopyOutcome = "copied" | "failed";

interface ClipboardEnv {
  writeText?: (text: string) => Promise<void>;
  legacyCopy?: (text: string) => boolean;
}

/** Copies via the async Clipboard API, falling back to a legacy copy. Never throws, never logs the number. */
export async function copyText(text: string, env: ClipboardEnv): Promise<CopyOutcome> {
  try {
    if (env.writeText) {
      await env.writeText(text);
      return "copied";
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    return env.legacyCopy?.(text) ? "copied" : "failed";
  } catch {
    return "failed";
  }
}
