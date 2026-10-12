import { z } from "zod";

export const PHOTO_STATUSES = ["pending", "approved", "hidden"] as const;
export const PHOTO_UPLOAD_MODES = ["off", "auto", "pending"] as const;

export const photoSchema = z.object({
  photo_id: z.string(),
  url: z.string(),
  uploader_name: z.string().nullable(),
  status: z.enum(PHOTO_STATUSES),
  size_bytes: z.number(),
  uploaded_at: z.string().nullable(),
  // Accepted but still being written to the sheet (a few seconds at most).
  queued: z.boolean(),
});

export type Photo = z.infer<typeof photoSchema>;
export type PhotoStatus = (typeof PHOTO_STATUSES)[number];
export type PhotoUploadMode = (typeof PHOTO_UPLOAD_MODES)[number];

export interface PhotoSettings {
  photo_uploads: PhotoUploadMode | null;
  photo_max_per_guest: number | null;
  photo_max_size_mb: number | null;
  photo_rate_per_ip_per_hour: number | null;
}

// Mirrors PHOTO_CEILINGS in apps/api (guest-photos.limits.ts); the API enforces them.
export const PHOTO_CEILINGS = { maxPerGuest: 50, maxSizeMb: 15, ratePerIpPerHour: 200 } as const;
