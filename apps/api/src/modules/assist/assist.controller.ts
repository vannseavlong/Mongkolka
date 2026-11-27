import type { Response } from "express";
import type { CoupleRequest } from "../../middlewares/couple-context.middleware.js";
import type { AuthedRequest } from "../../middlewares/auth.middleware.js";
import type { Outcome } from "./assist.core.js";
import { AssistService } from "./assist.instance.js";

const STATUS = { invalid: 400, conflict: 409, not_found: 404, rate_limited: 429, forbidden: 403 } as const;

function send<T>(res: Response, result: Outcome<T>, ok = 200, key = "request") {
  if (result.ok) res.status(ok).json({ [key]: result.value });
  else res.status(STATUS[result.code]).json({ error: result.message });
}

const optionalId = (v: unknown) => (typeof v === "string" && v ? v : undefined);
const userId = (req: AuthedRequest) => req.user?.user_id as string;

export const CoupleAssistController = {
  async get(req: CoupleRequest, res: Response) {
    res.json(await AssistService.getForCouple(req.coupleId as string));
  },
  async create(req: CoupleRequest, res: Response) {
    send(res, await AssistService.create(req.coupleId as string, userId(req), req.body?.note), 201);
  },
  async cancel(req: CoupleRequest, res: Response) {
    send(res, await AssistService.cancel(req.coupleId as string, userId(req), optionalId(req.body?.request_id)));
  },
  async revoke(req: CoupleRequest, res: Response) {
    send(res, await AssistService.revoke(req.coupleId as string, userId(req), optionalId(req.body?.request_id)));
  },
};

export const AdminAssistController = {
  async list(req: AuthedRequest, res: Response) {
    const q = req.query;
    const result = await AssistService.listForAdmin({
      status: typeof q.status === "string" ? q.status : undefined,
      cursor: typeof q.cursor === "string" ? q.cursor : undefined,
      limit: typeof q.limit === "string" ? Number(q.limit) : undefined,
    });
    if (result.ok) res.json(result.value);
    else res.status(STATUS[result.code]).json({ error: result.message });
  },
  async accept(req: AuthedRequest, res: Response) {
    send(res, await AssistService.accept(userId(req), req.params.requestId as string));
  },
  async revoke(req: AuthedRequest, res: Response) {
    send(res, await AssistService.adminRevoke(userId(req), req.params.requestId as string));
  },
  async decline(req: AuthedRequest, res: Response) {
    send(res, await AssistService.decline(userId(req), req.params.requestId as string, req.body?.reason));
  },
};
