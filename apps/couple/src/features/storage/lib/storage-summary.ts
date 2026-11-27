import type { DriveConnection } from "../data/drive-api";
import { formatBytes } from "@/features/website/components/asset-library-logic";

export interface SummaryInput {
  /** Image sizes in bytes; null while the list has not loaded (or failed). */
  sizes: number[] | null;
  /** Library limit; the API's answer, or the default until it loads. */
  maxImages: number;
  /** Null while loading or when the status could not be read. */
  drive: DriveConnection | null;
}

export type Level = "ok" | "near" | "full";

export interface StorageSummary {
  count: number | null;
  max: number;
  percent: number;
  level: Level;
  /** Human size such as "12.4 MB"; "—" when unknown. */
  totalLabel: string;
  where: { title: string; detail: string; tone: "ok" | "warn" | "neutral" };
}

/** At or above this share of the library the bar warns before the library is actually full. */
export const NEAR_FULL = 0.9;

export function summarizeStorage({ sizes, maxImages, drive }: SummaryInput): StorageSummary {
  const max = Math.max(1, maxImages);
  const count = sizes ? sizes.length : null;
  const ratio = count === null ? 0 : count / max;
  const total = sizes ? sizes.reduce((sum, n) => sum + (Number.isFinite(n) ? n : 0), 0) : null;
  return {
    count,
    max,
    // Floored below the limit, so the bar never reads 100% while the library is not yet full.
    percent: ratio >= 1 ? 100 : Math.floor(ratio * 100),
    level: ratio >= 1 ? "full" : ratio >= NEAR_FULL ? "near" : "ok",
    totalLabel: total === null ? "—" : formatBytes(total),
    where: whereFiles(drive),
  };
}

function whereFiles(drive: DriveConnection | null): StorageSummary["where"] {
  if (!drive) return { title: "—", detail: "", tone: "neutral" };
  if (!drive.available || drive.state === "not_connected") {
    return {
      title: "Mongkolka",
      detail: drive.available ? "Stored safely for you. Connect Google Drive to keep them in your own account." : "Stored safely for you.",
      tone: "neutral",
    };
  }
  if (drive.state === "needs_reconnect") {
    return { title: "Needs reconnecting", detail: "New uploads are kept by Mongkolka until you reconnect Google Drive.", tone: "warn" };
  }
  return { title: "Google Drive", detail: drive.email ?? "Your own account", tone: "ok" };
}
