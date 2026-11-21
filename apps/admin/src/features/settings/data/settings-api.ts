import { api } from "@/lib/api";
import { UPLOAD_LIMITS_KEY, type UploadLimitsPayload, type UploadLimitsView } from "./schema";

export function saveUploadLimits(payload: UploadLimitsPayload) {
  return api.patch<UploadLimitsView>(UPLOAD_LIMITS_KEY, payload);
}
