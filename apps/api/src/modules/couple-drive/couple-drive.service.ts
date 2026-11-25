import jwt from "jsonwebtoken";
import { createOAuthManager } from "longcelot-sheet-db";
import { google } from "googleapis";
import { env } from "../../config/env.js";
import { driveRuntime } from "../../services/drive/drive.runtime.js";
import { createCoupleDriveCore, DRIVE_SCOPES, type DriveOAuth } from "./couple-drive.core.js";
import { CoupleDriveModel } from "./couple-drive.model.js";

const STATE_PURPOSE = "drive-connect";

function buildOAuth(): DriveOAuth {
  const credentials = {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: env.DRIVE_GOOGLE_REDIRECT_URI,
  };
  const manager = createOAuthManager(credentials);
  return {
    authUrl: (state) => manager.getAuthUrl(DRIVE_SCOPES, state),
    async exchange(code) {
      const t = (await manager.getTokens(code)) as { refresh_token?: string; id_token?: string; scope?: string };
      // The id_token came straight from Google's token endpoint over TLS, so decoding is enough.
      const email = t.id_token ? (jwt.decode(t.id_token) as { email?: string } | null)?.email : undefined;
      return { refreshToken: t.refresh_token ?? undefined, email, scope: t.scope };
    },
    async revoke(refreshToken) {
      await new google.auth.OAuth2(credentials.clientId, credentials.clientSecret).revokeToken(refreshToken);
    },
  };
}

let core: ReturnType<typeof createCoupleDriveCore> | undefined;

export function CoupleDriveService() {
  if (core) return core;
  const runtime = driveRuntime();
  core = createCoupleDriveCore({
    model: CoupleDriveModel,
    box: runtime.box,
    oauth: buildOAuth(),
    // Short-lived and purpose-bound so a login JWT can never be replayed as a connect state.
    signState: (coupleId) => jwt.sign({ cid: coupleId, purpose: STATE_PURPOSE }, env.JWT_SECRET, { expiresIn: "10m" }),
    verifyState: (state) => {
      try {
        const p = jwt.verify(state, env.JWT_SECRET) as { cid?: unknown; purpose?: unknown };
        return p.purpose === STATE_PURPOSE && typeof p.cid === "string" ? p.cid : null;
      } catch {
        return null;
      }
    },
    onChange: runtime.invalidate,
  });
  return core;
}
