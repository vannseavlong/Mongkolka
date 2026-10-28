import type { NextFunction, Request, Response } from "express";
import Busboy from "busboy";

const MULTIPART_OVERHEAD_BYTES = 64 * 1024;

export interface UploadedFile {
  buffer: Buffer;
  mimeType: string;
}
export interface MultipartRequest extends Request {
  uploadedFile?: UploadedFile;
}

/**
 * Reads exactly one file part named `field` into memory, capped at `maxBytes`.
 * The client filename is dropped on purpose; callers must not trust it.
 */
export function singleFileUpload(field: string, maxBytes: number) {
  return (req: MultipartRequest, res: Response, next: NextFunction) => {
    if (!req.is("multipart/form-data")) {
      res.status(415).json({ error: "unsupported_type" });
      return;
    }
    // Cheap early reject; the allowance covers multipart boundaries and headers.
    const declared = Number(req.headers["content-length"]);
    if (Number.isFinite(declared) && declared > maxBytes + MULTIPART_OVERHEAD_BYTES) {
      res.set("Connection", "close").status(413).json({ error: "too_large" });
      req.resume();
      return;
    }
    let bb: ReturnType<typeof Busboy>;
    try {
      bb = Busboy({ headers: req.headers, limits: { files: 1, fields: 0, fileSize: maxBytes } });
    } catch {
      res.status(400).json({ error: "bad_request" });
      return;
    }
    let extraFile = false;
    let done = false;
    const finish = (fn: () => void) => {
      if (done) return;
      done = true;
      req.off("aborted", onAbort);
      req.off("error", onAbort);
      fn();
    };
    /** Stop parsing and discard the rest of the body without buffering it. */
    const stopReading = () => {
      req.unpipe(bb);
      bb.destroy();
      req.resume();
    };
    const onAbort = () => finish(() => stopReading());
    req.on("aborted", onAbort);
    req.on("error", onAbort);

    bb.on("file", (name, stream, info) => {
      if (name !== field || req.uploadedFile) {
        extraFile = true;
        stream.resume();
        return;
      }
      const chunks: Buffer[] = [];
      // A truncated body (client abort) errors the file stream; the abort handler already responded.
      stream.on("error", () => undefined);
      stream.on("data", (c: Buffer) => chunks.push(c));
      stream.on("limit", () => {
        chunks.length = 0;
        finish(() => {
          stopReading();
          res.set("Connection", "close").status(413).json({ error: "too_large" });
        });
      });
      stream.on("end", () => {
        if (!done) req.uploadedFile = { buffer: Buffer.concat(chunks), mimeType: info.mimeType.toLowerCase() };
      });
    });
    bb.on("filesLimit", () => {
      extraFile = true;
    });
    bb.on("error", () => finish(() => res.status(400).json({ error: "bad_request" })));
    bb.on("close", () =>
      finish(() => {
        if (extraFile || !req.uploadedFile) res.status(400).json({ error: "expected_one_file", field });
        else next();
      }),
    );
    req.pipe(bb);
  };
}
