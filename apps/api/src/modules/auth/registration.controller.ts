import type { Request, Response } from "express";
import { validatePasswordStrength } from "longcelot-sheet-db";
import { CouplesService } from "../couples/couples.service.js";
import { VendorsService } from "../vendors/vendors.service.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readCredentials(body: unknown) {
  const { email, password } = (body ?? {}) as { email?: unknown; password?: unknown };
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return { error: "A valid email is required." } as const;
  }
  if (typeof password !== "string") {
    return { error: "A password is required." } as const;
  }
  const strength = validatePasswordStrength(password);
  if (!strength.valid) {
    return { error: strength.errors.join(" ") } as const;
  }
  return { email: email.trim().toLowerCase(), password } as const;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export const RegistrationController = {
  async registerCouple(req: Request, res: Response) {
    const credentials = readCredentials(req.body);
    if ("error" in credentials) {
      res.status(400).json({ error: credentials.error });
      return;
    }

    const body = req.body as Record<string, unknown>;
    const result = await CouplesService.registerCouple({
      email: credentials.email,
      password: credentials.password,
      partner1Name: readString(body.partner1_name),
      partner2Name: readString(body.partner2_name),
      partner2Email: readString(body.partner2_email),
      weddingDate: readString(body.wedding_date),
    });

    if (!result.ok) {
      res.status(409).json({ error: "An account with this email already exists.", code: "email_taken" });
      return;
    }
    res.status(201).json({ ok: true });
  },

  async registerVendor(req: Request, res: Response) {
    const credentials = readCredentials(req.body);
    if ("error" in credentials) {
      res.status(400).json({ error: credentials.error });
      return;
    }

    const body = req.body as Record<string, unknown>;
    const businessName = readString(body.business_name);
    if (!businessName) {
      res.status(400).json({ error: "Business name is required." });
      return;
    }

    const result = await VendorsService.registerVendor({
      email: credentials.email,
      password: credentials.password,
      businessName,
      categoryId: readString(body.category_id),
      location: readString(body.location),
      description: readString(body.description),
    });

    if (!result.ok) {
      res.status(409).json({ error: "An account with this email already exists.", code: "email_taken" });
      return;
    }
    res.status(201).json({ ok: true });
  },
};
