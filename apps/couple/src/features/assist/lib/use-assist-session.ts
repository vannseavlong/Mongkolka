"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { assistSession, minutesLeft, type AssistState } from "@/lib/assist-session";
import { useApiQuery } from "@/lib/use-api-query";

const ADMIN_URL =
  process.env.NEXT_PUBLIC_ADMIN_URL ??
  (process.env.NODE_ENV === "production" ? "https://admin-mongkolka.web.app" : "http://localhost:3001");
export const ADMIN_REQUESTS_URL = `${ADMIN_URL.replace(/\/$/, "")}/assist-requests`;

const SERVER: AssistState = { status: "none" };

export function useAssistState(): AssistState {
  return useSyncExternalStore(assistSession.subscribe, assistSession.get, () => SERVER);
}

/** True while an admin is using this tab, for hiding what only the couple may do. The API refuses it anyway. */
export function useIsAssisting(): boolean {
  return useAssistState().status === "active";
}

export function exitAssist() {
  assistSession.end("exited");
  window.location.assign(ADMIN_REQUESTS_URL);
}

export function signInInstead() {
  assistSession.forget();
  // A full load, so nothing cached from the help session carries over.
  window.location.assign("/");
}

/** What the banner shows. Also ends the session on time, so an expired token is not kept. */
export function useAssistBanner() {
  const state = useAssistState();
  const [now, setNow] = useState(() => Date.now());
  const active = state.status === "active";

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      setNow(Date.now());
      assistSession.get(); // ends it once the token's time is up
    }, 15_000);
    return () => clearInterval(timer);
  }, [active]);

  const { data } = useApiQuery<{ profile: { partner1_name?: string | null; partner2_name?: string | null } }>(
    active ? "/couple/api/profile" : null,
  );
  const names = [data?.profile.partner1_name, data?.profile.partner2_name].filter(Boolean).join(" & ");

  return {
    active,
    coupleName: names || "this couple",
    minutes: state.status === "active" ? minutesLeft(state.expiresAt, now) : 0,
  };
}
