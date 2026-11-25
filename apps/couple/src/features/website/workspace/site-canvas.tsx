"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, LayoutTemplate, Monitor, Rows3, RotateCcw, Smartphone } from "lucide-react";
import type { PartialTheme, SiteRendererTemplate } from "@mongkolka/templates";
import { toast } from "sonner";
import { Button } from "@mongkolka/ui/button";
import { ApiError } from "@/lib/api";
import { cn } from "@mongkolka/ui/utils";
import type { SiteLanguage, WebsiteSection } from "../data/schema";
import type { PreviewProfile } from "../lib/build-content";
import { saveSiteLanguage } from "../lib/language-api";
import { computeFit, DEVICE_SIZE, type Device } from "../preview/fit";
import {
  FRAME_SOURCE,
  HOST_SOURCE,
  PREVIEW_FRAME_PATH,
  type FrameMessage,
  type HostMessage,
  type PreviewMode,
  type PreviewState,
} from "../preview/messages";

function Segment<T extends string>({
  label,
  value,
  onChange,
  items,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  items: readonly (readonly [T, typeof Monitor | null, string])[];
}) {
  return (
    <div className="flex gap-1 rounded-lg bg-muted p-1" role="group" aria-label={label}>
      {items.map(([v, Icon, text]) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={cn(
            "flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
            value === v ? "bg-background shadow-sm" : "text-muted-foreground",
          )}
        >
          {Icon && <Icon className="size-4" />} {text}
        </button>
      ))}
    </div>
  );
}

/**
 * Live canvas: the real site runs in an iframe laid out at a true device size
 * (so vh, breakpoints and the opening animation behave like the public site)
 * and is scaled to fit the stage. The frame is the same size in Section and Full
 * page mode; a tall section scrolls inside it.
 */
export function SiteCanvas({
  template,
  sections,
  selectedId,
  themeOverride,
  profile,
  onSelect,
  templateName,
  onChooseTemplate,
  defaultLanguage,
}: {
  template: SiteRendererTemplate;
  sections: WebsiteSection[];
  selectedId: string | null;
  themeOverride: PartialTheme | null;
  profile: PreviewProfile;
  onSelect: (sectionId: string) => void;
  templateName: string | null;
  onChooseTemplate: () => void;
  /** The site's default language: what the preview starts in. */
  defaultLanguage: SiteLanguage;
}) {
  const [device, setDevice] = useState<Device>("desktop");
  const [mode, setMode] = useState<PreviewMode>("section");
  const [replay, setReplay] = useState(0);
  // null = follow the site's default language; the couple can flip it to check the other one.
  const [pickedLanguage, setPickedLanguage] = useState<SiteLanguage | null>(null);
  const language = pickedLanguage ?? defaultLanguage;

  // One language switch for the preview and the site: it shows the language now and saves it as the language the public
  // site opens in (guests can still switch). If saving fails the preview goes back to what is saved.
  async function chooseLanguage(next: SiteLanguage) {
    if (next === language) return;
    setPickedLanguage(next);
    try {
      await saveSiteLanguage(next);
      toast.success(next === "kh" ? "Your site now opens in Khmer" : "Your site now opens in English");
    } catch (err) {
      setPickedLanguage(null);
      toast.error(err instanceof ApiError ? err.message : "Couldn't change the language");
    }
  }
  const [stage, setStage] = useState({ width: 0, height: 0 });
  const [ready, setReady] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  });

  const selected = sections.find((s) => s.section_id === selectedId) ?? null;
  const hasOpening = sections.some((s) => (s.section_key === "opening" || s.section_key === "cover") && s.enabled);

  // Size of the stage the frame must fit in.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setStage({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Messages from the frame: ready, and a click on a section.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data as FrameMessage | undefined;
      if (e.origin !== window.location.origin || e.source !== frameRef.current?.contentWindow || data?.source !== FRAME_SOURCE) return;
      if (data.type === "ready") setReady(true);
      else if (data.type === "select") onSelectRef.current(data.sectionId);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Push the current state into the frame whenever anything it draws changes.
  useEffect(() => {
    if (!ready) return;
    const state: PreviewState = { template, sections, themeOverride, profile, selectedId, mode, replay, language };
    const message: HostMessage = { source: HOST_SOURCE, state };
    frameRef.current?.contentWindow?.postMessage(message, window.location.origin);
  }, [ready, template, sections, themeOverride, profile, selectedId, mode, replay, language]);

  const fit = computeFit(device, stage);
  const base = DEVICE_SIZE[device];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b bg-background px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          {hasOpening && (
            <Button size="icon" variant="outline" className="size-9" onClick={() => setReplay((n) => n + 1)} title="Replay intro">
              <RotateCcw className="size-4" />
              <span className="sr-only">Replay intro (cover and opening)</span>
            </Button>
          )}
          <Button variant="outline" onClick={onChooseTemplate} className="min-w-0">
            <LayoutTemplate className="size-4" />
            <span className="max-w-48 truncate">{templateName ? `Template: ${templateName}` : "Choose template"}</span>
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Segment
            label="Site language"
            value={language}
            onChange={chooseLanguage}
            items={[
              ["kh", null, "ខ្មែរ"],
              ["en", null, "EN"],
            ]}
          />
          <Segment
            label="Preview scope"
            value={mode}
            onChange={setMode}
            items={[
              ["section", Rows3, "Section"],
              ["page", FileText, "Full page"],
            ]}
          />
          <Segment
            label="Preview size"
            value={device}
            onChange={setDevice}
            items={[
              ["desktop", Monitor, "Desktop"],
              ["mobile", Smartphone, "Mobile"],
            ]}
          />
        </div>
      </div>
      {selected && !selected.enabled && (
        <p role="status" className="shrink-0 bg-muted px-3 py-2 text-sm text-muted-foreground">
          This section is hidden, so it is not shown on your website. Turn it on in the list.
        </p>
      )}
      <div ref={stageRef} className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-3 sm:p-5">
        {/* Box sized to the scaled frame; the iframe inside is laid out at the real device size. */}
        <div
          className={cn(
            "relative shrink-0 overflow-hidden bg-background shadow-lg",
            device === "mobile" ? "rounded-[2rem] outline-[6px] outline-foreground/85" : "rounded-lg ring-1 ring-border",
          )}
          style={{ width: fit.width * fit.scale, height: fit.height * fit.scale }}
        >
          <iframe
            ref={frameRef}
            src={PREVIEW_FRAME_PATH}
            title="Website preview"
            className="absolute left-0 top-0 origin-top-left border-0 bg-background"
            style={{ width: base.width, height: fit.height, transform: `scale(${fit.scale})` }}
          />
        </div>
      </div>
    </div>
  );
}
