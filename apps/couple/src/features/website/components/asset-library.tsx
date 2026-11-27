"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { AlertTriangle, Check, ImagePlus, Loader2, Trash2, X } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@mongkolka/ui/tabs";
import { cn } from "@mongkolka/ui/utils";
import { api, ApiError } from "@/lib/api";
import { useApiQuery } from "@/lib/use-api-query";
import { DriveReconnectBanner } from "@/features/storage/components/drive-reconnect-banner";
import { SECTIONS_KEY } from "../lib/keys";
import { sectionLabel } from "../workspace/section-labels";
import type { WebsiteSectionKey } from "../data/schema";
import { ASSET_LIMITS_KEY, ASSETS_KEY, LIST_CACHE, PROFILE_KEY } from "./asset-library-api";
import { cancelUpload, clearFinished, enqueueUploads, registerLibraryView, useUploadQueue } from "./upload-queue";
import { summarize } from "./upload-progress";
import {
  type AssetLimits,
  ASSET_ACCEPT,
  DEFAULT_ASSET_LIMITS,
  formatBytes,
  type AssetUsage,
  type WebsiteAsset,
} from "./asset-library-logic";


/** Library tiles drawn at first and per "Show more": each one decodes a full-size photo, so they come in steps. */
const PAGE_SIZE = 24;

/** Shared look for buttons that use aria-disabled (the shared Button has no style for it). */
export const ARIA_DISABLED = "aria-disabled:pointer-events-none aria-disabled:opacity-50";

interface AssetLibraryProps {
  /** URLs currently chosen; their tiles show as selected (numbered when `numbered`). */
  selected?: string[];
  numbered?: boolean;
  /** Called when a tile is clicked. Omit for a manage-only library. */
  onPick?: (asset: WebsiteAsset) => void;
  /** Accessible verb for the tile button, e.g. "Use as cover". */
  pickLabel?: string;
  allowDelete?: boolean;
  /** Adds a "Select all" / "Clear selection" button; called with every library image and whether all are already selected. */
  onSelectAll?: (assets: WebsiteAsset[], allSelected: boolean) => void;
  /** Column classes for the tile grid; the default fits a narrow panel. A wide page can pass more columns. */
  gridClassName?: string;
  /** The reconnect notice is on by default; a page that already shows it elsewhere turns it off. */
  showDriveNotice?: boolean;
}

const NARROW_GRID = "grid-cols-2 sm:grid-cols-3";

/** The couple's image library: upload (drag-drop or picker), pick, delete, quota. */
export function AssetLibrary({ selected = [], numbered, onPick, pickLabel = "Select", allowDelete = true, onSelectAll, gridClassName = NARROW_GRID, showDriveNotice = true }: AssetLibraryProps) {
  const { data, loading, error, refetch } = useApiQuery<{ assets: WebsiteAsset[] }>(ASSETS_KEY, LIST_CACHE);
  const assets = data?.assets ?? [];
  const { data: limitsData } = useApiQuery<{ limits: AssetLimits }>(ASSET_LIMITS_KEY, LIST_CACHE);
  // Spread over the defaults so a field the API does not send yet still has a value.
  const limits = { ...DEFAULT_ASSET_LIMITS, ...limitsData?.limits };
  const { items: uploads, notes } = useUploadQueue();
  const [dragging, setDragging] = useState(false);
  const [tab, setTab] = useState("library");
  const [shown, setShown] = useState(PAGE_SIZE);
  const [deleting, setDeleting] = useState<WebsiteAsset | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chooseRef = useRef<HTMLButtonElement>(null);

  // Uploads keep running when this view closes; the floating dock takes over while it is gone.
  useEffect(() => registerLibraryView(), []);

  const full = assets.length >= limits.maxPerCouple;
  const allSelected = assets.length > 0 && assets.every((a) => selected.includes(a.url));
  const summary = summarize(uploads);
  const busy = uploads.some((u) => u.status === "uploading" || u.status === "queued");

  const moreRef = useCallback((node: HTMLElement | null) => {
    if (!node || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && setShown((n) => n + PAGE_SIZE), { rootMargin: "400px" });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  function handleFiles(list: FileList | File[]) {
    enqueueUploads(list, assets.length, limits);
  }

  return (
    <div className="flex flex-col gap-3">
      {showDriveNotice && <DriveReconnectBanner />}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium">Image library</h3>
        {onSelectAll && assets.length > 0 && (
          <Button type="button" size="sm" variant="outline" className="h-7" onClick={() => onSelectAll(assets, allSelected)}>
            {allSelected ? "Clear selection" : "Select all"}
          </Button>
        )}
        <p className={cn("text-xs", full ? "font-medium text-destructive" : "text-muted-foreground")} aria-live="polite">
          {data ? `${assets.length}/${limits.maxPerCouple} images${full ? " (full)" : ""}` : " "}
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="upload">{summary.active > 0 ? `Upload (${summary.active})` : "Upload"}</TabsTrigger>
        </TabsList>
        <TabsContent value="library" className="flex flex-col gap-3">
      {loading ? (
        <div className={cn("grid gap-2", gridClassName)} aria-busy="true" aria-label="Loading images">
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
          No images yet. Use the Upload tab to add your first photo.
        </p>
      ) : (
        <ul className={cn("grid gap-2", gridClassName)} aria-label="Images">
          {assets.slice(0, shown).map((asset, i) => {
            const index = selected.indexOf(asset.url);
            const isSelected = index !== -1;
            const name = `image ${i + 1} of ${assets.length} (${formatBytes(asset.size_bytes)})`;
            return (
              <li key={asset.asset_id} className="group relative [contain-intrinsic-size:auto_9rem] [content-visibility:auto]">
                <button
                  type="button"
                  aria-pressed={onPick ? isSelected : undefined}
                  aria-label={onPick ? `${pickLabel}: ${name}` : name}
                  onClick={() => onPick?.(asset)}
                  className={cn(
                    "block aspect-square w-full overflow-hidden rounded-md border bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    onPick ? "cursor-pointer hover:border-foreground/40" : "cursor-default",
                    isSelected && "border-primary ring-2 ring-primary/40",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset.url} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
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
                    aria-label={`Delete ${name}`}
                    className="absolute top-1 right-1 size-7 opacity-100 sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
                    onClick={(e) => {
                      openerRef.current = e.currentTarget;
                      setDeleting(asset);
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {assets.length > shown && (
        <Button key={shown} ref={moreRef as never} type="button" size="sm" variant="outline" className="self-center" onClick={() => setShown((n) => n + PAGE_SIZE)}>
          Show more ({assets.length - shown})
        </Button>
      )}

        </TabsContent>
        <TabsContent value="upload" className="flex flex-col gap-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!full) handleFiles(e.dataTransfer.files);
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
            if (!full && e.target.files) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <Button
          ref={chooseRef}
          type="button"
          size="sm"
          variant="outline"
          aria-disabled={full}
          aria-describedby={full ? "asset-full-hint" : undefined}
          className={ARIA_DISABLED}
          onClick={() => !full && inputRef.current?.click()}
        >
          Choose images
        </Button>
        {full && (
          <p id="asset-full-hint" className="text-xs text-destructive">
            Your library is full ({limits.maxPerCouple} images). Delete some to upload more.
          </p>
        )}
        <p className="text-xs text-muted-foreground">JPEG, PNG, WebP or GIF, up to {formatBytes(limits.maxBytes)} each. Large photos are resized and compressed before upload.</p>
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
          <li className="flex flex-col gap-1 rounded-md bg-muted/50 p-2 text-sm">
            <span className="flex items-center justify-between gap-2">
              <span className="font-medium">
                {summary.active > 0 ? `Uploading ${summary.done + summary.failed} of ${summary.total}` : `${summary.done} of ${summary.total} uploaded`}
              </span>
              <span className="text-xs text-muted-foreground">{summary.percent}%</span>
            </span>
            <Progress value={summary.percent} aria-label="Total upload progress" />
            {busy && <span className="text-xs text-muted-foreground">You can close this window; uploads keep going in the background.</span>}
          </li>
          {uploads.map((u) => (
            <li key={u.id} className="flex flex-col gap-1 rounded-md border p-2 text-sm">
              <span className="flex items-center gap-2">
                {u.status === "uploading" && <Loader2 className="size-4 animate-spin" aria-hidden />}
                {u.status === "done" && <Check className="size-4 text-primary" aria-hidden />}
                {u.status === "error" && <AlertTriangle className="size-4 text-destructive" aria-hidden />}
                <span className="min-w-0 flex-1 truncate">{u.name}</span>
                <span className="text-xs text-muted-foreground">
                  {u.status === "queued"
                    ? "Waiting"
                    : u.status === "uploading"
                      ? `${u.percent}%`
                      : u.status === "done"
                        ? "Uploaded"
                        : "Failed"}
                </span>
                {(u.status === "uploading" || u.status === "queued") && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="size-6"
                    aria-label={`Cancel upload of ${u.name}`}
                    onClick={() => cancelUpload(u.id)}
                  >
                    <X className="size-3.5" />
                  </Button>
                )}
              </span>
              {u.status === "uploading" && <Progress value={u.percent} aria-label={`Uploading ${u.name}`} />}
              {u.status === "error" && <span className="text-xs text-destructive">{u.error}</span>}
            </li>
          ))}
          {!busy && (
            <li>
              <Button type="button" size="sm" variant="ghost" onClick={clearFinished}>
                Clear list
              </Button>
            </li>
          )}
        </ul>
      )}

        </TabsContent>
      </Tabs>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        {deleting && (
          <DeleteAssetBody
            key={deleting.asset_id}
            asset={deleting}
            onClose={() => setDeleting(null)}
            // No AlertDialogTrigger exists, so return focus ourselves: to the delete button,
            // or to the upload button when that tile is gone.
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              const opener = openerRef.current;
              (opener?.isConnected ? opener : chooseRef.current)?.focus();
            }}
          />
        )}
      </AlertDialog>
    </div>
  );
}

function DeleteAssetBody({
  asset,
  onClose,
  onCloseAutoFocus,
}: {
  asset: WebsiteAsset;
  onClose: () => void;
  onCloseAutoFocus: (e: Event) => void;
}) {
  // Fetched fresh on every open (not through the SWR cache) so the warning is never stale.
  const [usage, setUsage] = useState<AssetUsage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stale, setStale] = useState(false);
  const [removing, setRemoving] = useState(false);
  const busyRef = useRef(false);

  useEffect(() => {
    let live = true;
    api
      .get<AssetUsage>(`${ASSETS_KEY}/${asset.asset_id}/usage`)
      .then((u) => live && setUsage(u))
      .catch((e) => live && setError(e instanceof ApiError ? e.message : "Something went wrong"));
    return () => {
      live = false;
    };
  }, [asset.asset_id]);

  const loading = !usage && !error;
  const inUse = !!usage && (usage.cover || usage.sections.length > 0);
  const ready = !loading && !error && !removing;

  async function confirm() {
    if (!ready || busyRef.current) return;
    busyRef.current = true;
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
      const body = err instanceof ApiError ? err.body : undefined;
      if (err instanceof ApiError && err.status === 409 && body && Array.isArray(body.sections)) {
        // Used since the dialog opened: show the fresh list and let the couple confirm again.
        setUsage({ sections: body.sections as AssetUsage["sections"], cover: body.cover === true });
        setStale(true);
      } else {
        toast.error(err instanceof ApiError ? err.message : "Could not delete the image");
      }
    } finally {
      busyRef.current = false;
      setRemoving(false);
    }
  }

  return (
    <AlertDialogContent onCloseAutoFocus={onCloseAutoFocus}>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete this image?</AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div className="flex flex-col gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset.url} alt="" className="max-h-40 w-fit rounded-md border object-contain" />
            {loading && <p>Checking where it is used…</p>}
            {error && <p className="text-destructive">Could not check where this image is used: {error}</p>}
            {usage && !inUse && <p>It is not used anywhere. This cannot be undone.</p>}
            {stale && <p className="font-medium">This image was just added to your site. Please review and confirm again.</p>}
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
        <Button type="button" variant="destructive" aria-disabled={!ready} className={ARIA_DISABLED} onClick={confirm}>
          {loading ? "Checking usage…" : removing ? "Deleting…" : inUse ? "Delete and remove from site" : "Delete"}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
