"use client";

import { useEffect, useRef, useState } from "react";
import type { CoupleInfo, GuestbookActions } from "../../types";
import { buildIcs } from "../grace/guestbook-logic";

/** Directions / add-to-calendar / share, with a copy-link fallback. Same behaviour as the Grace guestbook. */
export function useGuestbookActions(couple: CoupleInfo, actions: GuestbookActions | undefined) {
  const [copied, setCopied] = useState(false);
  const [manualLink, setManualLink] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function addToCalendar() {
    if (!actions?.calendar) return;
    const blob = new Blob([buildIcs(actions.calendar)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function share() {
    const url = actions?.shareUrl ?? window.location.href.split("?")[0]!;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${couple.partner1Name} & ${couple.partner2Name ?? ""}`.trim(), url });
        return;
      }
    } catch {
      return; // share sheet cancelled
    }
    try {
      if (!navigator.clipboard?.writeText) throw new Error("no clipboard");
      await navigator.clipboard.writeText(url);
      setManualLink(null);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // insecure context or blocked clipboard: show the link so it can be copied by hand
      setManualLink(url);
    }
  }

  function openMaps() {
    if (actions?.mapsUrl) window.open(actions.mapsUrl, "_blank", "noopener,noreferrer");
  }

  return { copied, manualLink, addToCalendar, share, openMaps };
}
