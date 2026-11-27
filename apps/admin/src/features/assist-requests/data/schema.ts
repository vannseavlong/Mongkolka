export type AssistStatus = "pending" | "approved" | "declined" | "revoked" | "cancelled" | "expired";

/** One request as GET /admin/api/assist-requests sends it. */
export interface AssistRequestDto {
  request_id: string;
  couple_id: string;
  couple_name: string;
  note: string;
  status: AssistStatus;
  requested_at: string;
  decided_at: string | null;
  decline_reason: string | null;
  expires_at: string | null;
  revoked_at: string | null;
}

export interface AssistPageDto {
  requests: AssistRequestDto[];
  next_cursor: string | null;
}

export interface AssistRequest {
  id: string;
  coupleName: string;
  note: string;
  status: AssistStatus;
  requestedAt: string;
  decidedAt: string | null;
  declineReason: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
}

export function toAssistRequest(dto: AssistRequestDto): AssistRequest {
  return {
    id: dto.request_id,
    coupleName: dto.couple_name,
    note: dto.note,
    status: dto.status,
    requestedAt: dto.requested_at,
    decidedAt: dto.decided_at,
    declineReason: dto.decline_reason,
    expiresAt: dto.expires_at,
    revokedAt: dto.revoked_at,
  };
}
