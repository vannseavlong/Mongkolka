import type { TokenBox } from "../../utils/token-crypto.js";

export interface ConnectionRow {
  couple_id: string;
  google_email?: string;
  refresh_token_enc: string;
  status: string;
  _created_at?: string;
}
export interface DriveModel {
  find(coupleId: string): Promise<ConnectionRow | null>;
  upsert(coupleId: string, data: { google_email: string; refresh_token_enc: string }): Promise<void>;
  setStatus(coupleId: string, status: string, lastError?: string): Promise<unknown>;
  remove(coupleId: string): Promise<unknown>;
}
export interface DriveOAuth {
  authUrl(state: string): string;
  /** Exchanges the consent code; scope is what Google actually granted. */
  exchange(code: string): Promise<{ refreshToken?: string; email?: string; scope?: string }>;
  revoke(refreshToken: string): Promise<void>;
}
export interface CoupleDriveDeps {
  model: DriveModel;
  box: TokenBox;
  oauth: DriveOAuth;
  signState: (coupleId: string) => string;
  /** The couple id the state was issued for, or null when invalid or expired. */
  verifyState: (state: string) => string | null;
  /** Called after any change so cached clients and status are dropped. */
  onChange: (coupleId: string) => void;
}

export type DriveStatus = "not_connected" | "active" | "needs_reconnect";
export interface PublicDriveStatus {
  status: DriveStatus;
  google_email: string | null;
  connected_at: string | null;
}
export type ConnectError = "invalid_state" | "no_refresh_token" | "scope_missing" | "exchange_failed";

export const DRIVE_SCOPES = ["https://www.googleapis.com/auth/drive.file", "openid", "email"];

export function createCoupleDriveCore(deps: CoupleDriveDeps) {
  const { model, box, oauth } = deps;

  return {
    /** Never includes any token material. */
    async status(coupleId: string): Promise<PublicDriveStatus> {
      const row = await model.find(coupleId);
      if (!row || row.status === "disconnected") return { status: "not_connected", google_email: null, connected_at: null };
      return {
        status: row.status === "needs_reconnect" ? "needs_reconnect" : "active",
        google_email: row.google_email || null,
        connected_at: row._created_at ?? null,
      };
    },

    startConnect(coupleId: string): { url: string } {
      return { url: oauth.authUrl(deps.signState(coupleId)) };
    },

    async finishConnect(code: string, state: string): Promise<{ ok: true; coupleId: string } | { ok: false; error: ConnectError }> {
      const coupleId = deps.verifyState(state);
      if (!coupleId) return { ok: false, error: "invalid_state" };
      let result;
      try {
        result = await oauth.exchange(code);
      } catch {
        return { ok: false, error: "exchange_failed" };
      }
      // Google lets people untick individual permissions, so check what was really granted.
      if (!result.scope?.split(" ").includes(DRIVE_SCOPES[0] as string)) return { ok: false, error: "scope_missing" };
      if (!result.refreshToken) return { ok: false, error: "no_refresh_token" };
      await model.upsert(coupleId, {
        google_email: result.email ?? "",
        refresh_token_enc: box.encrypt(result.refreshToken),
      });
      deps.onChange(coupleId);
      return { ok: true, coupleId };
    },

    /** Removes our copy of the token and revokes it at Google. Files stay in the couple's Drive. */
    async disconnect(coupleId: string): Promise<void> {
      const row = await model.find(coupleId);
      if (!row) return;
      await model.remove(coupleId);
      deps.onChange(coupleId);
      try {
        await oauth.revoke(box.decrypt(row.refresh_token_enc));
      } catch (err) {
        console.error(`[couple-drive] could not revoke token for ${coupleId}`, err instanceof Error ? err.message : err);
      }
    },

    async markNeedsReconnect(coupleId: string, reason: string): Promise<void> {
      await model.setStatus(coupleId, "needs_reconnect", reason);
      deps.onChange(coupleId);
    },
  };
}
