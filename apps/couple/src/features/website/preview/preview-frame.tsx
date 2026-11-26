"use client";

import { useEffect, useRef, useState } from "react";
import { LanguageProvider, SiteRenderer, skinFromComponents, type CoupleInfo } from "@mongkolka/templates";
import { cn } from "@mongkolka/ui/utils";
import { buildPreviewContent } from "../lib/build-content";
import { FRAME_SOURCE, HOST_SOURCE, type FrameMessage, type HostMessage, type PreviewState } from "./messages";

/** A gallery section with the couple's "photos shown" number raised to the most allowed (24), so every photo shows. */
function withAllPhotos<T extends { section_key: string; content?: unknown }>(section: T): T {
  if (section.section_key !== "gallery" || !section.content || typeof section.content !== "object") return section;
  return { ...section, content: { ...(section.content as Record<string, unknown>), maxPhotos: 24 } };
}

function post(message: FrameMessage) {
  window.parent.postMessage(message, window.location.origin);
}

/**
 * The page that runs inside the builder's preview iframe. It draws the real
 * site (SiteRenderer, same as the public page) from state sent by the builder,
 * and reports clicks back.
 */
export function PreviewFrame() {
  const [state, setState] = useState<PreviewState | null>(null);
  // The opening gate was opened by the couple while previewing it on its own.
  const [opened, setOpened] = useState(false);
  const [prevKey, setPrevKey] = useState("");
  // The builder has no gallery sub-page, so "View all photos" there shows every photo in place (click again to collapse).
  const [allPhotos, setAllPhotos] = useState(false);
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
  // The cover and the opening gate are both full-screen intros, previewed as a whole sequence.
  const selectedIsOpening = selected?.section_key === "opening" || selected?.section_key === "cover";

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
  // Changes when the selected section is edited or restyled, so the preview re-aligns to it after a save.
  const selectedKey = selected ? JSON.stringify([selected.component_id, selected.content]) : "";
  useEffect(() => {
    if (fromFrame.current) {
      fromFrame.current = false;
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const topOf = () => {
      const target = selectedId && document.querySelector<HTMLElement>(`[data-section-id="${CSS.escape(selectedId)}"]`);
      return mode === "page" && target ? target.getBoundingClientRect().top + window.scrollY : 0;
    };
    window.scrollTo({ top: topOf(), behavior: reduce ? "auto" : "smooth" });
    if (mode !== "page") return;
    // `opened`: a section picked while the gate was still shut has nothing to scroll to yet, so go again once the page appears.
    // Photos load after the jump and push the section away from where it was measured. For a moment, whenever the
    // page height changes, put the selected section back at the top (instantly, so it does not fight the scroll).
    const observer = new ResizeObserver(() => window.scrollTo({ top: topOf(), behavior: "auto" }));
    observer.observe(document.body);
    const stop = window.setTimeout(() => observer.disconnect(), 2500);
    return () => {
      window.clearTimeout(stop);
      observer.disconnect();
    };
  }, [selectedId, mode, state?.replay, selectedKey, opened]);

  if (!state) return null;
  const { template, sections, themeOverride, profile } = state;
  // The Covenant template replies with a wish form only (no attendance question).
  const wishOnly = skinFromComponents(template.default_components) === "covenant";

  const couple: CoupleInfo = {
    partner1Name: profile.partner1_name ?? "Partner One",
    partner2Name: profile.partner2_name ?? undefined,
    weddingDate: profile.wedding_date ?? undefined,
  };
  const picked =
    state.mode === "page" ? sections : selected ? (selectedIsOpening && opened ? sections : [selected]) : [];
  const shown = allPhotos ? picked.map(withAllPhotos) : picked;

  return (
    <LanguageProvider key={state.language} initialLanguage={state.language}>
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
        onCoverRevealed={() => setOpened(true)}
        galleryHref="#"
        extraProps={(sectionKey) => (sectionKey === "rsvp" ? { onSubmit: async () => {}, wishOnly: wishOnly, onWish: async () => {} } : {})}
        wrapSection={(section, node) => (
          <div
            data-section-id={section.section_id}
            onClickCapture={(e) => {
              // Selecting must not trigger the section's own links/buttons.
              e.preventDefault();
              e.stopPropagation();
              if (section.section_key === "gallery" && (e.target as HTMLElement).closest('a[href="#"]')) setAllPhotos((v) => !v);
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
