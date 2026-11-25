export interface DriveResultMessage {
  kind: "success" | "error";
  text: string;
}

const MESSAGES: Record<string, DriveResultMessage> = {
  connected: { kind: "success", text: "Google Drive connected. New uploads now go to your Drive." },
  denied: { kind: "error", text: "You cancelled the Google permission screen, so nothing was connected." },
  scope_missing: {
    kind: "error",
    text: "Google Drive access was left unticked. Connect again and keep the Drive permission ticked.",
  },
  no_refresh_token: {
    kind: "error",
    text: "Google did not give lasting access. Remove Mongkolka under your Google Account > Security > Third-party access, then connect again.",
  },
  invalid_state: { kind: "error", text: "That connection link expired. Please start again." },
  drive_not_configured: { kind: "error", text: "Google Drive storage is not available yet." },
};

const FALLBACK: DriveResultMessage = { kind: "error", text: "Could not connect Google Drive. Please try again." };

/** Turns the `?drive=` value the API redirects back with into a message; null when absent. */
export function driveResultMessage(code: string | null): DriveResultMessage | null {
  if (!code) return null;
  return MESSAGES[code] ?? FALLBACK;
}
