import { adminContext } from "../../config/database.js";

export interface DriveConnectionRow extends Record<string, unknown> {
  couple_id: string;
  google_email?: string;
  refresh_token_enc: string;
  status: string;
  last_error?: string;
  _created_at?: string;
}

/** All data-layer calls for Drive connections live here. */
export const CoupleDriveModel = {
  find(coupleId: string) {
    return adminContext()
      .table("couple_drive_connections")
      .findOne({ where: { couple_id: coupleId } }) as Promise<DriveConnectionRow | null>;
  },

  async upsert(coupleId: string, data: { google_email: string; refresh_token_enc: string }) {
    const table = adminContext().table("couple_drive_connections");
    const fields = { ...data, status: "active", last_error: "" };
    if (await table.findOne({ where: { couple_id: coupleId } })) {
      await table.update({ where: { couple_id: coupleId }, data: fields });
    } else {
      await table.create({ couple_id: coupleId, ...fields });
    }
  },

  setStatus(coupleId: string, status: string, lastError = "") {
    return adminContext()
      .table("couple_drive_connections")
      .update({ where: { couple_id: coupleId }, data: { status, last_error: lastError.slice(0, 200) } });
  },

  remove(coupleId: string) {
    return adminContext().table("couple_drive_connections").delete({ where: { couple_id: coupleId } });
  },
};
