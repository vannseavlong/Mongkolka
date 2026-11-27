import { api } from "@/lib/api";

/** Data layer: raw API shapes and the one mapping to the model the screen uses. */
export const ASSIST_KEY = "/couple/api/assist";

export type AssistStatus = "pending" | "approved" | "declined" | "revoked" | "cancelled" | "expired";

interface RequestDto {
  request_id: string;
  note: string;
  status: AssistStatus;
  requested_at: string;
  decided_at: string | null;
  decline_reason: string | null;
  expires_at: string | null;
  revoked_at: string | null;
}

interface ActivityDto {
  at: string;
  actor_role: "couple" | "admin";
  action: string;
  method: string | null;
  path: string | null;
}

interface AssistDto {
  request: RequestDto | null;
  activity: ActivityDto[];
}

export interface AssistRequest {
  id: string;
  note: string;
  status: AssistStatus;
  requestedAt: Date;
  expiresAt: Date | null;
  declineReason: string | null;
}

export interface AssistActivity {
  at: Date;
  by: "couple" | "admin";
  action: string;
  path: string | null;
}

export interface Assist {
  request: AssistRequest | null;
  activity: AssistActivity[];
}

/** An unreadable date becomes null rather than an Invalid Date that prints "NaN". */
function toDate(value: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toRequest(dto: RequestDto): AssistRequest {
  return {
    id: dto.request_id,
    note: dto.note,
    status: dto.status,
    requestedAt: toDate(dto.requested_at) ?? new Date(0),
    expiresAt: toDate(dto.expires_at),
    declineReason: dto.decline_reason || null,
  };
}

export function toAssist(dto: AssistDto): Assist {
  return {
    request: dto.request ? toRequest(dto.request) : null,
    activity: dto.activity.flatMap((a) => {
      const at = toDate(a.at);
      return at ? [{ at, by: a.actor_role, action: a.action, path: a.path }] : [];
    }),
  };
}

export async function fetchAssist(): Promise<Assist> {
  return toAssist(await api.get<AssistDto>(ASSIST_KEY));
}

export async function createAssist(note: string): Promise<AssistRequest> {
  return toRequest((await api.post<{ request: RequestDto }>(ASSIST_KEY, { note })).request);
}

/** The id is sent so a late duplicate click cannot act on a newer request. */
export async function cancelAssist(requestId: string): Promise<AssistRequest> {
  return toRequest((await api.post<{ request: RequestDto }>(`${ASSIST_KEY}/cancel`, { request_id: requestId })).request);
}

export async function revokeAssist(requestId: string): Promise<AssistRequest> {
  return toRequest((await api.post<{ request: RequestDto }>(`${ASSIST_KEY}/revoke`, { request_id: requestId })).request);
}
