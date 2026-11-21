import type { LimitKey, LimitRanges, UploadLimitsPayload, UploadLimitsView } from "../data/schema";

export const LIMIT_KEYS: LimitKey[] = ["maxMb", "maxPerCouple", "maxDimension"];

export type FormValues = Record<LimitKey, string>;
export type FormErrors = Partial<Record<LimitKey, string>>;

/** Blank means "use the default", so a field only has text when an override is set. */
export function toFormValues(overrides: UploadLimitsView["overrides"]): FormValues {
  const text = (k: LimitKey) => (overrides[k] === undefined ? "" : String(overrides[k]));
  return { maxMb: text("maxMb"), maxPerCouple: text("maxPerCouple"), maxDimension: text("maxDimension") };
}

export function isDirty(values: FormValues, overrides: UploadLimitsView["overrides"]): boolean {
  const saved = toFormValues(overrides);
  return LIMIT_KEYS.some((k) => values[k].trim() !== saved[k]);
}

/** Turns the form text into the API payload, or per-field messages. Client check is UX only; the API validates again. */
export function buildPayload(
  values: FormValues,
  ranges: LimitRanges,
): { ok: true; payload: UploadLimitsPayload } | { ok: false; errors: FormErrors } {
  const errors: FormErrors = {};
  const payload = {} as UploadLimitsPayload;
  for (const k of LIMIT_KEYS) {
    const raw = values[k].trim();
    if (raw === "") {
      payload[k] = null;
      continue;
    }
    const n = Number(raw);
    const { min, max } = ranges[k];
    if (!Number.isInteger(n) || n < min || n > max) errors[k] = `Enter a whole number from ${min} to ${max}, or leave blank.`;
    else payload[k] = n;
  }
  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, payload };
}
