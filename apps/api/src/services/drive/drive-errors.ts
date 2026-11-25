/** Thrown by the token store when a couple has no usable Drive connection. */
export class DriveNotConnectedError extends Error {
  constructor(coupleId: string) {
    super(`Couple ${coupleId} has no active Drive connection`);
    this.name = "DriveNotConnectedError";
  }
}

function field(err: unknown, name: string): unknown {
  return err && typeof err === "object" ? (err as Record<string, unknown>)[name] : undefined;
}

/**
 * True when Google says the couple's grant is gone (revoked access, expired or removed refresh
 * token). lsdb does not type these errors, so match what googleapis surfaces.
 */
export function isRevokedGrant(err: unknown): boolean {
  if (err instanceof DriveNotConnectedError) return true;
  const response = field(err, "response") as { data?: { error?: unknown } } | undefined;
  const text = [field(err, "message"), response?.data?.error].filter((v) => typeof v === "string").join(" ");
  return /invalid_grant|invalid_client|unauthorized_client|Token has been expired or revoked/i.test(text);
}

/** True when the Drive file is simply not there (deleted by the couple, or never ours). */
export function isNotFound(err: unknown): boolean {
  return field(err, "code") === 404 || field(err, "status") === 404;
}
