import { ALLOWED_MIME } from "../guest-photos/guest-photos.limits.js";

export { ALLOWED_MIME };

export const ASSET_LIMITS = {
  maxPerCouple: 100,
  /** 8 MB per asset, stated here on purpose rather than inherited from guest-photo defaults. */
  maxBytes: 8 * 1024 * 1024,
  /** Reject absurd pixel sizes (decompression-bomb style) when the header can be read. */
  maxDimension: 12000,
} as const;
