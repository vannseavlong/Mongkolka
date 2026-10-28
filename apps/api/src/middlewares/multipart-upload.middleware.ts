import type { NextFunction, Request, Response } from "express";
import Busboy from "busboy";

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
    let bb: ReturnType<typeof Busboy>;
    try {
      bb = Busboy({ headers: req.headers, limits: { files: 1, fields: 0, fileSize: maxBytes } });
    } catch {
      res.status(400).json({ error: "bad_request" });
      return;
    }
    let tooLarge = false;
    let extraFile = false;
    let done = false;
    const finish = (fn: () => void) => {
      if (done) return;
      done = true;
      fn();
    };

    bb.on("file", (name, stream, info) => {
      if (name !== field || req.uploadedFile) {
        extraFile = true;
        stream.resume();
        return;
      }
      const chunks: Buffer[] = [];
      stream.on("data", (c: Buffer) => chunks.push(c));
      stream.on("limit", () => {
        tooLarge = true;
      });
      stream.on("end", () => {
        if (!tooLarge) req.uploadedFile = { buffer: Buffer.concat(chunks), mimeType: info.mimeType.toLowerCase() };
      });
    });
    bb.on("filesLimit", () => {
      extraFile = true;
    });
    bb.on("error", () => finish(() => res.status(400).json({ error: "bad_request" })));
    bb.on("close", () =>
      finish(() => {
        if (tooLarge) res.status(413).json({ error: "too_large" });
        else if (extraFile || !req.uploadedFile) res.status(400).json({ error: "expected_one_file", field });
        else next();
      }),
    );
    req.pipe(bb);
  };
}
