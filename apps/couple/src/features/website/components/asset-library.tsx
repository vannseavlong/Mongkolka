"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { AlertTriangle, Check, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@mongkolka/ui/alert";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@mongkolka/ui/alert-dialog";
import { Button } from "@mongkolka/ui/button";
import { Progress } from "@mongkolka/ui/progress";
import { Skeleton } from "@mongkolka/ui/skeleton";
import { cn } from "@mongkolka/ui/utils";
import { api, ApiError } from "@/lib/api";
import { useApiQuery } from "@/lib/use-api-query";
import { SECTIONS_KEY } from "../lib/keys";
import { sectionLabel } from "../workspace/section-labels";
import type { WebsiteSectionKey } from "../data/schema";
import { ASSETS_KEY, PROFILE_KEY, uploadAsset } from "./asset-library-api";
import {
  ASSET_ACCEPT,
  ASSET_QUOTA,
  formatBytes,
  planUploads,
  type AssetUsage,
  type WebsiteAsset,
} from "./asset-library-logic";

interface UploadItem {
  id: number;
  name: string;
  status: "uploading" | "done" | "error";
  percent: number;
  error?: string;
}

let nextUploadId = 1;

interface AssetLibraryProps {
  /** URLs currently chosen; their tiles show as selected (numbered when `numbered`). */
  selected?: string[];
  numbered?: boolean;
  /** Called when a tile is clicked. Omit for a manage-only library. */
  onPick?: (asset: WebsiteAsset) => void;
  /** Accessible verb for the tile button, e.g. "Use as cover". */
  pickLabel?: string;
  allowDelete?: boolean;
}

/** The couple's image library: upload (drag-drop or picker), pick, delete, quota. */
export function AssetLibrary({ selected = [], numbered, onPick, pickLabel = "Select", allowDelete = true }: AssetLibraryProps) {
  const { data, loading, error, refetch } = useApiQuery<{ assets: WebsiteAsset[] }>(ASSETS_KEY);
  const assets = data?.assets ?? [];
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<WebsiteAsset | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const full = assets.length >= ASSET_QUOTA;
  const busy = uploads.some((u) => u.status === "uploading");

  function patchUpload(id: number, patch: Partial<UploadItem>) {
    setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  }

  async function handleFiles(list: FileList | File[]) {
    const files = Array.from(list);
    if (files.length === 0) return;
    const { accepted, rejected } = planUploads(files, assets.length);
    setNotes(rejected);
    const items = accepted.map((f) => ({ file: f, id: nextUploadId++ }));
    setUploads((prev) => [
      ...prev.filter((u) => u.status === "uploading"),
      ...items.map(({ file, id }) => ({ id, name: file.name, status: "uploading" as const, percent: 0 })),
    ]);
    for (const { file, id } of items) {
      try {
        const asset = await uploadAsset(file, (percent) => patchUpload(id, { percent }));
        patchUpload(id, { status: "done", percent: 100 });
        mutate(ASSETS_KEY, (cur?: { assets: WebsiteAsset[] }) => ({ assets: [asset, ...(cur?.assets ?? [])] }), {
          revalidate: false,
        });
      } catch (err) {
        patchUpload(id, { status: "error", error: err instanceof ApiError ? err.message : "Upload failed." });
        // Stop early when the library is full: the rest would fail the same way.
        if (err instanceof ApiError && err.status === 409) break;
      }
    }
    mutate(ASSETS_KEY);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium">Image library</h3>
        <p className={cn("text-xs", full ? "font-medium text-destructive" : "text-muted-foreground")} aria-live="polite">
          {data ? `${assets.length}/${ASSET_QUOTA} images` : " "}
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!full) void handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center gap-2 rounded-lg border-2 border-dashed p-4 text-center transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-border",
        )}
      >
        <ImagePlus className="size-6 text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">Drag images here, or</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ASSET_ACCEPT}
          className="sr-only"
          tabIndex={-1}
          aria-label="Choose images to upload"
          onChange={(e) => {
            if (!full && e.target.files) void handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-disabled={full}
          onClick={() => {
            if (full) toast.error(`Your library is full (${ASSET_QUOTA} images). Delete some to upload more.`);
            else inputRef.current?.click();
          }}
        >
          Choose images
        </Button>
        <p className="text-xs text-muted-foreground">JPEG, PNG, WebP or GIF, up to {formatBytes(8 * 1024 * 1024)} each.</p>
      </div>

      {notes.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>Some files were skipped</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4">
              {notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {uploads.length > 0 && (
        <ul className="flex flex-col gap-2" aria-label="Uploads" aria-live="polite">
          {uploads.map((u) => (
            <li key={u.id} className="flex flex-col gap-1 rounded-md border p-2 text-sm">
              <span className="flex items-center gap-2">
                {u.status === "uploading" && <Loader2 className="size-4 animate-spin" aria-hidden />}
                {u.status === "done" && <Check className="size-4 text-primary" aria-hidden />}
                {u.status === "error" && <AlertTriangle className="size-4 text-destructive" aria-hidden />}
                <span className="min-w-0 flex-1 truncate">{u.name}</span>
                <span className="text-xs text-muted-foreground">
                  {u.status === "uploading" ? `${u.percent}%` : u.status === "done" ? "Uploaded" : "Failed"}
                </span>
              </span>
              {u.status === "uploading" && <Progress value={u.percent} aria-label={`Uploading ${u.name}`} />}
              {u.status === "error" && <span className="text-xs text-destructive">{u.error}</span>}
            </li>
          ))}
          {!busy && (
            <li>
              <Button type="button" size="sm" variant="ghost" onClick={() => setUploads([])}>
                Clear list
              </Button>
            </li>
          )}
        </ul>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" aria-busy="true" aria-label="Loading images">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-md" />
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>Could not load your images</AlertTitle>
          <AlertDescription>
            <p>{error}</p>
            <Button type="button" size="sm" variant="outline" className="mt-2" onClick={() => void refetch()}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : assets.length === 0 ? (
        <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
          No images yet. Upload your first photo above.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label="Images">
          {assets.map((asset) => {
            const index = selected.indexOf(asset.url);
            const isSelected = index !== -1;
            return (
              <li key={asset.asset_id} className="group relative">
                <button
                  type="button"
                  aria-pressed={onPick ? isSelected : undefined}
                  aria-label={onPick ? `${pickLabel}: image ${formatBytes(asset.size_bytes)}` : `Image ${formatBytes(asset.size_bytes)}`}
                  onClick={() => onPick?.(asset)}
                  className={cn(
                    "block aspect-square w-full overflow-hidden rounded-md border bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    onPick ? "cursor-pointer hover:border-foreground/40" : "cursor-default",
                    isSelected && "border-primary ring-2 ring-primary/40",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset.url} alt="" loading="lazy" className="size-full object-cover" />
                </button>
                {isSelected && (
                  <span className="pointer-events-none absolute top-1 left-1 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    {numbered ? index + 1 : <Check className="size-3.5" aria-hidden />}
                  </span>
                )}
                {allowDelete && (
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    aria-label="Delete image"
                    className="absolute top-1 right-1 size-7 opacity-100 sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
                    onClick={() => setDeleting(asset)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <DeleteAssetDialog asset={deleting} onClose={() => setDeleting(null)} />
    </div>
  );
}

function DeleteAssetDialog({ asset, onClose }: { asset: WebsiteAsset | null; onClose: () => void }) {
  const { data: usage, loading, error } = useApiQuery<AssetUsage>(asset ? `${ASSETS_KEY}/${asset.asset_id}/usage` : null);
  const [removing, setRemoving] = useState(false);
  const inUse = !!usage && (usage.cover || usage.sections.length > 0);
  const ready = !loading && !error && !!usage && !removing;

  async function confirm() {
    if (!asset || !ready) return;
    setRemoving(true);
    try {
      await api.delete(`${ASSETS_KEY}/${asset.asset_id}${inUse ? "?force=true" : ""}`);
      mutate(ASSETS_KEY, (cur?: { assets: WebsiteAsset[] }) => cur && { assets: cur.assets.filter((a) => a.asset_id !== asset.asset_id) }, {
        revalidate: false,
      });
      // The server strips the URL from sections and the cover, so refresh both.
      mutate(SECTIONS_KEY);
      mutate(PROFILE_KEY);
      mutate(ASSETS_KEY);
      toast.success("Image deleted");
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not delete the image");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <AlertDialog open={!!asset} onOpenChange={(open) => !open && !removing && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this image?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="flex flex-col gap-2">
              {asset && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={asset.url} alt="" className="max-h-40 w-fit rounded-md border object-contain" />
              )}
              {loading && <p>Checking where it is used…</p>}
              {error && <p className="text-destructive">Could not check where this image is used: {error}</p>}
              {usage && !inUse && <p>It is not used anywhere. This cannot be undone.</p>}
              {inUse && usage && (
                <>
                  <p>This image is in use. Deleting it will remove it from:</p>
                  <ul className="list-disc pl-5">
                    {usage.cover && <li>Your cover photo</li>}
                    {usage.sections.map((s) => (
                      <li key={s.section_id}>{sectionLabel(s.section_key as WebsiteSectionKey)} section</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button type="button" variant="destructive" aria-disabled={!ready} onClick={confirm}>
            {removing ? "Deleting…" : inUse ? "Delete and remove from site" : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
