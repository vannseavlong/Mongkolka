import { adapter, setDriveTokenStore } from "../../config/database.js";
import { env } from "../../config/env.js";
import { CoupleDriveModel } from "../../modules/couple-drive/couple-drive.model.js";
import { TtlCache } from "../../utils/ttl-cache.js";
import { createTokenBox, type TokenBox } from "../../utils/token-crypto.js";
import { createDriveTokenStore, driveActorId } from "./drive-token.store.js";
import type { DriveGateway } from "./drive.gateway.js";
import { createLsdbDriveGateway } from "./lsdb-drive.gateway.js";

export interface DriveRuntime {
  box: TokenBox;
  gateway: DriveGateway;
  isConnected(coupleId: string): Promise<boolean>;
  markNeedsReconnect(coupleId: string, reason: string): Promise<void>;
  /** Drops every cache for a couple; call after connect, disconnect or a status change. */
  invalidate(coupleId: string): void;
}

/** Per-couple Drive storage only exists once DRIVE_TOKEN_KEY is set; otherwise everyone uses the default driver. */
export const driveEnabled = () => env.DRIVE_TOKEN_KEY !== "";

let runtime: DriveRuntime | undefined;

/** Built on first use, and it registers the token store with lsdb, so every Drive entry point goes through here. */
export function driveRuntime(): DriveRuntime {
  if (runtime) return runtime;

  const box = createTokenBox([env.DRIVE_TOKEN_KEY, env.DRIVE_TOKEN_KEY_PREV]);
  const store = createDriveTokenStore({ find: (id) => CoupleDriveModel.find(id), box });
  setDriveTokenStore(store);

  const gateway = createLsdbDriveGateway({
    adapter,
    credentials: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET },
    refreshTokenFor: async (id) => {
      const tokens = await store.get(driveActorId(id));
      if (!tokens?.refresh_token) throw new Error("No Drive token");
      return tokens.refresh_token;
    },
  });

  // Short cache: every upload asks "is this couple connected?". Changes invalidate it explicitly.
  const active = new TtlCache<boolean>(30_000, 2_000);
  const invalidate = (coupleId: string) => {
    active.delete(coupleId);
    gateway.evict(coupleId);
  };

  runtime = {
    box,
    gateway,
    invalidate,
    isConnected: (coupleId) =>
      active.getOrLoad(coupleId, async () => (await CoupleDriveModel.find(coupleId))?.status === "active"),
    async markNeedsReconnect(coupleId, reason) {
      await CoupleDriveModel.setStatus(coupleId, "needs_reconnect", reason);
      invalidate(coupleId);
    },
  };
  return runtime;
}
