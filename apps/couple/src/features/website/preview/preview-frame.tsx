"use client";

import { useEffect, useRef, useState } from "react";
import { LanguageProvider, SiteRenderer, type CoupleInfo } from "@mongkolka/templates";
import { cn } from "@mongkolka/ui/utils";
import { buildPreviewContent } from "../lib/build-content";
import { FRAME_SOURCE, HOST_SOURCE, type FrameMessage, type HostMessage, type PreviewState } from "./messages";

function post(message: FrameMessage) {
  window.parent.postMessage(message, window.location.origin);
}

/**
 * The page that runs inside the builder's preview iframe. It draws the real
 * site (SiteRenderer, same as the public page) from state sent by the builder,
 * and reports clicks and content height back.
 */
export function PreviewFrame() {
  const [state, setState] = useState<PreviewState | null>(null);
  // The opening gate was opened by the couple while previewing it on its own.
  const [opened, setOpened] = useState(false);
  const [prevKey, setPrevKey] = useState("");
  const fromFrame = useRef(false);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data as HostMessage | undefined;
      if (e.origin !== window.location.origin || e.source !== window.parent || data?.source !== HOST_SOURCE) return;
      setState(data.state);
    };
    window.addEventListener("message", onMessage);
    post({ source: FRAME_SOURCE, type: "ready" });
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const selected = state?.sections.find((s) => s.section_id === state.selectedId) ?? null;
  const selectedIsOpening = selected?.section_key === "opening";

  // Selecting the opening, switching mode or replaying starts the gate over (adjusted during render).
  // In page mode the gate belongs to the whole page, so picking sections must not restart it.
  const gateKey = state ? `${state.mode}|${state.mode === "section" && selectedIsOpening}|${state.replay}` : "";
  const resetKey = gateKey;
  if (resetKey !== prevKey) {
    setPrevKey(resetKey);
    setOpened(false);
  }

  const mode = state?.mode;
  const selectedId = state?.selectedId ?? null;
  useEffect(() => {
    if (fromFrame.current) {
      fromFrame.current = false;
      return;
    }
    const target = selectedId && document.querySelector<HTMLElement>(`[data-section-id="${CSS.escape(selectedId)}"]`);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = mode === "page" && target ? target.getBoundingClientRect().top + window.scrollY : 0;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }, [selectedId, mode, state?.replay]);

  // The opening gate is a full-screen experience, and once it is opened in Section mode the whole page
  // shows: neither is "one section to fit", and fitting would shrink the frame to a sliver. Report one screen.
  const showingWholePage = mode === "section" && selectedIsOpening;

  // Report content height so the builder can fit a whole section without scrolling.
  useEffect(() => {
    const report = () =>
      post({
        source: FRAME_SOURCE,
        type: "height",
        selectedId,
        value: showingWholePage ? window.innerHeight : document.documentElement.scrollHeight,
        viewport: window.innerHeight,
      });
    const observer = new ResizeObserver(report);
    observer.observe(document.body);
    window.addEventListener("resize", report);
    report();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", report);
    };
  }, [selectedId, mode, opened, showingWholePage]);

  if (!state) return null;
  const { template, sections, themeOverride, profile } = state;

  const couple: CoupleInfo = {
    partner1Name: profile.partner1_name ?? "Partner One",
    partner2Name: profile.partner2_name ?? undefined,
    weddingDate: profile.wedding_date ?? undefined,
  };
  const shown =
    state.mode === "page" ? sections : selected ? (selectedIsOpening && opened ? sections : [selected]) : [];

  return (
    <LanguageProvider>
      {/* key: restarts the gate when selecting it again, switching mode or replaying */}
      <SiteRenderer
        key={gateKey}
        template={template}
        sections={shown}
        themeOverride={themeOverride}
        couple={couple}
        buildContent={(sectionKey) => buildPreviewContent(sectionKey, profile)}
        guestGreeting="Guest"
        onOpened={() => setOpened(true)}
        extraProps={(sectionKey) => (sectionKey === "rsvp" ? { onSubmit: async () => {} } : {})}
        wrapSection={(section, node) => (
          <div
            data-section-id={section.section_id}
            onClickCapture={(e) => {
              // Selecting must not trigger the section's own links/buttons.
              e.preventDefault();
              e.stopPropagation();
              if (section.section_id !== selectedId) fromFrame.current = true;
              post({ source: FRAME_SOURCE, type: "select", sectionId: section.section_id });
            }}
            className={cn(
              "cursor-pointer outline-offset-[-3px]",
              state.mode === "page" && section.section_id === selectedId && "outline-3 outline-primary",
            )}
          >
            {node}
          </div>
        )}
      />
    </LanguageProvider>
  );
}
