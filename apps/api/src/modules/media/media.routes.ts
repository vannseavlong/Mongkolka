import { Router } from "express";
import { driveEnabled, driveRuntime } from "../../services/drive/drive.runtime.js";
import { RateLimiter } from "../../utils/rate-limit.js";
import { createMediaCore } from "./media.core.js";

/** Mounted at /media. Public: invitation sites are public, so these URLs are too. */
export const mediaRouter = Router();

const limiter = new RateLimiter(60_000);
const PER_IP_PER_MINUTE = 600;

mediaRouter.get("/:coupleId/:fileId", async (req, res) => {
  if (!driveEnabled()) return void res.status(404).end();
  if (!limiter.hit(req.ip ?? "unknown", PER_IP_PER_MINUTE)) return void res.status(429).end();

  const rt = driveRuntime();
  let result;
  try {
    result = await createMediaCore({ drive: rt.gateway, isConnected: rt.isConnected })(
      req.params.coupleId as string,
      req.params.fileId as string,
      req.headers["if-none-match"],
    );
  } catch (err) {
    console.error("[media] read failed", err instanceof Error ? err.message : err);
    return void res.status(502).end();
  }
  if (result.status === 404) return void res.status(404).end();

  // A file id never changes content, so the browser and any CDN may keep it for a year.
  res.set({
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
    "Cross-Origin-Resource-Policy": "cross-origin",
    ...(result.etag ? { ETag: result.etag } : {}),
  });
  if (result.status === 304) return void res.status(304).end();
  res.set({ "Content-Type": result.mimeType, ...(result.size ? { "Content-Length": String(result.size) } : {}) });
  result.stream.on("error", () => res.destroy()).pipe(res);
});
