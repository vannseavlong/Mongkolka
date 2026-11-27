import { api } from "@/lib/api";
import type { AssistStatus } from "./schema";

export const ASSIST_KEY = "/admin/api/assist-requests";
export const PAGE_SIZE = 50;

export function assistListPath(opts: { status?: AssistStatus; cursor?: string | null } = {}): string {
  const query = new URLSearchParams({ limit: String(PAGE_SIZE) });
  if (opts.status) query.set("status", opts.status);
  if (opts.cursor) query.set("cursor", opts.cursor);
  return `${ASSIST_KEY}?${query}`;
}

const action = (id: string, name: string) => `${ASSIST_KEY}/${encodeURIComponent(id)}/${name}`;

export const acceptRequest = (id: string) => api.post(action(id, "accept"));
export const declineRequest = (id: string, reason: string) => api.post(action(id, "decline"), { reason });
export const revokeRequest = (id: string) => api.post(action(id, "revoke"));

/**
 * The response holds a login token inside `editor_url`. Call this directly and use the value once: never put it in
 * SWR, component state, storage or a log.
 */
export const openEditorSession = (id: string) => api.post<{ editor_url: string; expires_at: string }>(action(id, "session"));
