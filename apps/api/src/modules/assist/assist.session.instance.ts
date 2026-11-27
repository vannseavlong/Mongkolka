import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AssistModel } from "./assist.model.js";
import { createAssistSessionService } from "./assist.session.service.js";

export const AssistSession = createAssistSessionService({
  model: AssistModel,
  sign: (payload, ttlSeconds) => jwt.sign(payload, env.JWT_SECRET, { expiresIn: ttlSeconds }),
});
