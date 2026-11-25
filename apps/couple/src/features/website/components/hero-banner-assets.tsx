"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Images, Loader2, Trash2 } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@mongkolka/ui/collapsible";
import { ApiError } from "@/lib/api";
import { cn } from "@mongkolka/ui/utils";
import { useApiQuery } from "@/lib/use-api-query";
import type { WebsiteSection } from "../data/schema";
import type { PreviewProfile } from "../lib/build-content";
import { asRecord, saveContent } from "../lib/section-content-save";
import { AssetPicker } from "./asset-picker";
import { ASSET_LIMITS_KEY, UPLOAD_CANCELLED } from "./asset-library-api";
import { ASSET_ACCEPT, type AssetLimits, DEFAULT_ASSET_LIMITS } from "./asset-library-logic";
import { CoverAssets } from "./asset-picker-cover";
import { uploadSingleImage } from "./asset-upload-one";

type Slot = "portraitUrl" | "landscapeUrl";

const SLOTS: { key: Slot; title: string; hint: string; box: string }[] = [
  { key: "portraitUrl", title: "Portrait banner", hint: "For phones. Best at 1080 × 1920.", box: "aspect-[9/16] w-20" },
  { key: "landscapeUrl", title: "Landscape banner", hint: "For wide screens. Best at 1920 × 1080.", box: "aspect-[16/9] w-36" },
];

/**
 * Hero banners: one image for tall screens and one for wide screens. Click (or drop an image on) a preview to pick a
 * file and it uploads straight away; "From library" reuses an image already uploaded. One banner alone is used
 * everywhere; with none the hero uses the profile cover photo.
 */
export function HeroBannerAssets({ section, profile }: { section: WebsiteSection; profile: PreviewProfile }) {
  const content = asRecord(section.content);
  const { data: limitsData } = useApiQuery<{ limits: AssetLimits }>(ASSET_LIMITS_KEY);
  const limits = limitsData?.limits ?? DEFAULT_ASSET_LIMITS;
  const [libraryFor, setLibraryFor] = useState<Slot | null>(null);
  const [busy, setBusy] = useState<{ slot: Slot; percent: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<Slot | null>(null);
  const inputs = useRef<Partial<Record<Slot, HTMLInputElement | null>>>({});
  const controller = useRef<AbortController | null>(null);
  // The button that opened the library, so focus returns to it when the dialog closes.
  const opener = useRef<HTMLElement | null>(null);

  // Abort an upload still in flight when the panel goes away.
  useEffect(() => () => controller.current?.abort(), []);

  async function save(slot: Slot, url: string | null) {
    const next: Record<string, unknown> = { ...asRecord(section.content), [slot]: url ?? undefined };
    try {
      await saveContent(section.section_id, next);
      toast.success(url ? "Banner updated" : "Banner removed");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't save the banner");
    }
  }

  async function upload(slot: Slot, file: File | undefined) {
    if (!file || busy) return;
    setError(null);
    const abort = new AbortController();
    controller.current = abort;
    setBusy({ slot, percent: 0 });
    try {
      const url = await uploadSingleImage(file, (percent) => setBusy({ slot, percent }), abort.signal, limits);
      await save(slot, url);
    } catch (err) {
      if (!(err instanceof ApiError && err.status === UPLOAD_CANCELLED)) setError(err instanceof ApiError ? err.message : "Upload failed. Please try again.");
    } finally {
      controller.current = null;
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        {SLOTS.map(({ key, title, hint, box }) => {
          const url = typeof content[key] === "string" ? (content[key] as string) : "";
          const uploading = busy?.slot === key;
          return (
            <section key={key} aria-label={title} className="flex items-center gap-3 rounded-lg border p-3">
              <input
                ref={(el) => {
                  inputs.current[key] = el;
                }}
                type="file"
                accept={ASSET_ACCEPT}
                className="sr-only"
                tabIndex={-1}
                aria-hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  void upload(key, file);
                }}
              />
              {/* The whole preview is the upload area: click it, or drop an image on it. */}
              <button
                type="button"
                disabled={!!busy}
                aria-label={url ? `Replace the ${title.toLowerCase()}` : `Upload the ${title.toLowerCase()}`}
                onClick={() => inputs.current[key]?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(key);
                }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(null);
                  void upload(key, e.dataTransfer.files?.[0]);
                }}
                className={cn(
                  "group relative shrink-0 overflow-hidden rounded-md border-2 bg-muted transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-wait",
                  url ? "border-solid" : "border-dashed",
                  dragOver === key && "border-primary bg-accent",
                  box,
                )}
              >
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="" className="size-full object-cover" />
                ) : (
                  <span className="flex size-full flex-col items-center justify-center gap-1 text-muted-foreground group-hover:text-foreground">
                    <ImagePlus className="size-5" aria-hidden />
                    <span className="text-[11px] font-medium">Upload</span>
                  </span>
                )}
                {url && !uploading && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    Replace
                  </span>
                )}
                {uploading && (
                  <span role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/55 text-xs font-medium text-white">
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    {busy.percent}%
                  </span>
                )}
              </button>
              <div className="flex min-w-0 flex-col items-start gap-1">
                <h3 className="text-sm font-medium">{title}</h3>
                <p className="text-xs text-muted-foreground">{hint}</p>
                <div className="flex flex-wrap items-center gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    disabled={!!busy}
                    onClick={(e) => {
                      opener.current = e.currentTarget;
                      setLibraryFor(key);
                    }}
                  >
                    <Images className="size-3.5" /> From library
                  </Button>
                  {url && (
                    <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-xs text-destructive hover:text-destructive" disabled={!!busy} onClick={() => void save(key, null)}>
                      <Trash2 className="size-3.5" /> Remove
                    </Button>
                  )}
                </div>
              </div>
            </section>
          );
        })}
        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
      </div>

      <AssetPicker
        open={libraryFor !== null}
        onOpenChange={(open) => !open && setLibraryFor(null)}
        title={libraryFor === "portraitUrl" ? "Choose the portrait banner" : "Choose the landscape banner"}
        multiple={false}
        returnFocusRef={opener}
        onConfirm={([url]) => {
          if (libraryFor && url) void save(libraryFor, url);
        }}
      />

      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button type="button" variant="ghost" size="sm">
            Fallback: profile cover photo
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <CoverAssets profile={profile} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
