import type { OAuthTokens, TokenStore } from "longcelot-sheet-db";
import type { TokenBox } from "../../utils/token-crypto.js";
import { DriveNotConnectedError } from "./drive-errors.js";

/**
 * lsdb's actor id for a couple's Drive. The prefix keeps this store from answering for the
 * ordinary user ids lsdb also passes to tokenStore.get() when it creates actor sheets.
 */
export const DRIVE_ACTOR_PREFIX = "drive:";
export const driveActorId = (coupleId: string) => `${DRIVE_ACTOR_PREFIX}${coupleId}`;

export interface ConnectionRecord {
  status: string;
  refresh_token_enc: string;
}

/**
 * For a drive: actor it returns the couple's refresh token or throws. It never returns null,
 * because lsdb treats null as "use the shared admin Drive" and a couple's files must never
 * land there. Other ids get null, which keeps lsdb's existing behaviour for them.
 */
export function createDriveTokenStore(deps: {
  find: (coupleId: string) => Promise<ConnectionRecord | null>;
  box: TokenBox;
}): TokenStore {
  return {
    async get(actorId): Promise<OAuthTokens | null> {
      if (!actorId.startsWith(DRIVE_ACTOR_PREFIX)) return null;
      const coupleId = actorId.slice(DRIVE_ACTOR_PREFIX.length);
      const row = await deps.find(coupleId);
      if (!row || row.status !== "active") throw new DriveNotConnectedError(coupleId);
      return { refresh_token: deps.box.decrypt(row.refresh_token_enc) };
    },
    async set() {
      // Access tokens are refreshed in memory; the refresh token only changes on reconnect.
    },
  };
}
