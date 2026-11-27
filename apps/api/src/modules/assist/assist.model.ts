import { adminContext } from "../../config/database.js";
import type { AssistRow } from "./assist.core.js";

export interface AssistLogRow {
  log_id: string;
  request_id: string;
  couple_id: string;
  actor_id: string;
  actor_role: string;
  action: string;
  method?: string;
  path?: string;
  at: string;
}

/** All data-layer calls for assisted editing live here. */
export const AssistModel = {
  async listByCouple(coupleId: string) {
    return (await adminContext().table("assist_requests").findMany({ where: { couple_id: coupleId } })) as unknown as AssistRow[];
  },

  async list(status?: string) {
    return (await adminContext().table("assist_requests").findMany(status ? { where: { status } } : undefined)) as unknown as AssistRow[];
  },

  findById(requestId: string) {
    return adminContext().table("assist_requests").findOne({ where: { request_id: requestId } }) as Promise<AssistRow | null>;
  },

  create(row: Record<string, unknown>) {
    return adminContext().table("assist_requests").create(row);
  },

  update(requestId: string, data: Record<string, unknown>) {
    return adminContext().table("assist_requests").update({ where: { request_id: requestId }, data });
  },

  appendLog(row: Record<string, unknown>) {
    return adminContext().table("assist_log").create(row);
  },

  async logByCouple(coupleId: string) {
    return (await adminContext().table("assist_log").findMany({ where: { couple_id: coupleId } })) as unknown as AssistLogRow[];
  },

  findCouple(coupleId: string) {
    return adminContext().table("couples").findOne({ where: { couple_id: coupleId } });
  },

  async listCouples() {
    return adminContext().table("couples").findMany();
  },
};
