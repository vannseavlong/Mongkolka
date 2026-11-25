import { api } from "@/lib/api";

/** Data layer: raw API shapes and the one mapping to the model the screens use. */
export const DRIVE_KEY = "/couple/api/drive";

export type DriveState = "not_connected" | "active" | "needs_reconnect";

interface DriveStatusDto {
  enabled: boolean;
  status: DriveState;
  google_email: string | null;
  connected_at: string | null;
}

export interface DriveConnection {
  /** False when the server has no Drive storage configured. */
  available: boolean;
  state: DriveState;
  email: string | null;
  connectedAt: Date | null;
}

export function toDriveConnection(dto: DriveStatusDto): DriveConnection {
  const at = dto.connected_at ? new Date(dto.connected_at) : null;
  return {
    available: dto.enabled,
    state: dto.status,
    email: dto.google_email,
    connectedAt: at && !Number.isNaN(at.getTime()) ? at : null,
  };
}

export async function fetchDriveConnection(): Promise<DriveConnection> {
  return toDriveConnection(await api.get<DriveStatusDto>(DRIVE_KEY));
}

/** The Google consent URL; the caller sends the browser there. */
export async function startDriveConnect(): Promise<string> {
  return (await api.post<{ url: string }>(`${DRIVE_KEY}/connect`)).url;
}

export function disconnectDrive(): Promise<void> {
  return api.delete<void>(DRIVE_KEY);
}
