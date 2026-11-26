"use client";

import { useSyncExternalStore } from "react";
import { mutate } from "swr";
import { ApiError } from "@/lib/api";
import { ASSETS_KEY, readImageSize, uploadAsset, UPLOAD_CANCELLED } from "./asset-library-api";
import { type AssetLimits, dimensionsError, planUploads, sizeError, type WebsiteAsset } from "./asset-library-logic";
import { optimizeImage } from "./asset-optimize";

/**
 * The couple's upload queue. It lives outside React, so uploads keep running when the library dialog is closed;
 * the dialog and the floating progress dock both read it. Files go up one at a time.
 */
export interface UploadItem {
  id: number;
  name: string;
  status: "queued" | "uploading" | "done" | "error";
  percent: number;
  error?: string;
}

interface QueueState {
  items: UploadItem[];
  /** Files skipped before upload (wrong type, over the limit ...), shown in the dialog. */
  notes: string[];
  /** How many library views are open; the floating dock hides itself while one is. */
  viewers: number;
}

interface Job {
  file: File;
  limits: AssetLimits;
  controller: AbortController;
}

let state: QueueState = { items: [], notes: [], viewers: 0 };
const jobs = new Map<number, Job>();
const listeners = new Set<() => void>();
let nextId = 1;
let running = false;

function set(next: Partial<QueueState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function patch(id: number, p: Partial<UploadItem>) {
  set({ items: state.items.map((u) => (u.id === id ? { ...u, ...p } : u)) });
}

const isActive = (u: UploadItem) => u.status === "queued" || u.status === "uploading";

/** Adds files to the queue (after the usual checks) and starts uploading if idle. */
export function enqueueUploads(list: FileList | File[], existingCount: number, limits: AssetLimits): void {
  const files = Array.from(list);
  if (files.length === 0) return;
  const { accepted, rejected } = planUploads(files, existingCount + state.items.filter(isActive).length, limits);
  const added = accepted.map((file) => ({ file, id: nextId++ }));
  for (const { file, id } of added) jobs.set(id, { file, limits, controller: new AbortController() });
  set({
    notes: rejected,
    items: [...state.items.filter(isActive), ...added.map(({ file, id }) => ({ id, name: file.name, status: "queued" as const, percent: 0 }))],
  });
  void pump();
}

export function cancelUpload(id: number): void {
  jobs.get(id)?.controller.abort();
}

export function cancelAllUploads(): void {
  jobs.forEach((j) => j.controller.abort());
}

/** Removes finished and failed rows. Waiting and running ones stay. */
export function clearFinished(): void {
  set({ items: state.items.filter(isActive), notes: [] });
}

async function uploadOne(id: number, job: Job): Promise<"full" | "ok"> {
  const { file, limits, controller } = job;
  const signal = controller.signal;
  if (signal.aborted) {
    patch(id, { status: "error", error: "Cancelled." });
    return "ok";
  }
  patch(id, { status: "uploading" });
  try {
    const size = await readImageSize(file);
    const tooBig = size && dimensionsError(file.name, size.width, size.height, limits);
    if (tooBig) throw new ApiError(tooBig, 0);
    // Resize and compress first, so large photos load fast for guests and fit the limit.
    const { file: optimized } = await optimizeImage(file, limits);
    const tooLarge = sizeError(optimized, limits);
    if (tooLarge) throw new ApiError(tooLarge, 0);
    if (signal.aborted) throw new ApiError("Cancelled", UPLOAD_CANCELLED);
    const asset = await uploadAsset(optimized, (percent) => patch(id, { percent }), signal, undefined, limits);
    patch(id, { status: "done", percent: 100 });
    void mutate(ASSETS_KEY, (cur?: { assets: WebsiteAsset[] }) => ({ assets: [asset, ...(cur?.assets ?? [])] }), { revalidate: false });
    return "ok";
  } catch (err) {
    const cancelled = err instanceof ApiError && err.status === UPLOAD_CANCELLED;
    patch(id, { status: "error", error: cancelled ? "Cancelled." : err instanceof ApiError ? err.message : "Upload failed." });
    return err instanceof ApiError && err.status === 409 ? "full" : "ok";
  }
}

async function pump(): Promise<void> {
  if (running) return;
  running = true;
  let libraryFull = false;
  try {
    for (;;) {
      const next = state.items.find((u) => u.status === "queued");
      if (!next) break;
      const job = jobs.get(next.id);
      if (!job) {
        patch(next.id, { status: "error", error: "Stopped." });
        continue;
      }
      if (libraryFull) {
        patch(next.id, { status: "error", error: "Skipped: your library is full." });
      } else if ((await uploadOne(next.id, job)) === "full") {
        libraryFull = true;
      }
      jobs.delete(next.id);
    }
  } finally {
    running = false;
    // Whatever happened, nothing may stay spinning.
    set({ items: state.items.map((u) => (isActive(u) ? { ...u, status: "error" as const, error: "Stopped." } : u)) });
    void mutate(ASSETS_KEY);
  }
}

/** Called by each open library view so the dock does not repeat what the dialog already shows. */
export function registerLibraryView(): () => void {
  set({ viewers: state.viewers + 1 });
  return () => set({ viewers: state.viewers - 1 });
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => state;

export function useUploadQueue(): QueueState {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}
