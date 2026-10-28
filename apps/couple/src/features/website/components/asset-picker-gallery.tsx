"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@mongkolka/ui/collapsible";
import { Input } from "@mongkolka/ui/input";
import type { SectionPanelContext } from "../workspace/panel-tabs/types";
import { AssetLibrary, ARIA_DISABLED } from "./asset-library";
import { isHttpUrl, moveItem, newUrlsOnly, photosOf, togglePhoto, URL_ERROR } from "./asset-library-logic";

/** Gallery photos: ordered list plus the library; every change saves optimistically so the canvas updates at once. */
export function GalleryAssets({ context }: { context: SectionPanelContext }) {
  const { section, patchSection } = context;
  const photos = photosOf(section.content);
  const [rawUrl, setRawUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const base = section.content && typeof section.content === "object" ? (section.content as Record<string, unknown>) : {};

  const save = (next: string[]) => patchSection({ content: { ...base, photos: next } }, "Could not update the gallery");

  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-2" aria-label="Gallery photos">
        <h3 className="text-sm font-medium">Photos in this gallery ({photos.length})</h3>
        {photos.length === 0 ? (
          <p className="text-sm text-muted-foreground">No photos yet. Select images from the library below.</p>
        ) : (
          <ol className="flex flex-col gap-2">
            {photos.map((url, i) => (
              <li key={`${url}-${i}`} aria-label={`Photo ${i + 1} of ${photos.length}`} className="flex items-center gap-2 rounded-md border p-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="size-12 shrink-0 rounded object-cover" />
                <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">Photo {i + 1}</span>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label={`Move photo ${i + 1} up`}
                  aria-disabled={i === 0}
                  className={ARIA_DISABLED}
                  onClick={() => i > 0 && void save(moveItem(photos, i, i - 1))}
                >
                  <ArrowUp className="size-3" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label={`Move photo ${i + 1} down`}
                  aria-disabled={i === photos.length - 1}
                  className={ARIA_DISABLED}
                  onClick={() => i < photos.length - 1 && void save(moveItem(photos, i, i + 1))}
                >
                  <ArrowDown className="size-3" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label={`Remove photo ${i + 1} from gallery`}
                  onClick={() => void save(photos.filter((_, j) => j !== i))}
                >
                  <Trash2 className="size-3" />
                </Button>
              </li>
            ))}
          </ol>
        )}
      </section>

      <AssetLibrary
        selected={photos}
        numbered
        pickLabel="Toggle in gallery"
        onPick={(asset) => void save(togglePhoto(photos, asset.url))}
      />

      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button type="button" variant="ghost" size="sm">
            Advanced: add by URL
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const url = rawUrl.trim();
              if (!url) return;
              if (!isHttpUrl(url)) return setUrlError(URL_ERROR);
              setUrlError(null);
              void save([...photos, ...newUrlsOnly(photos, [url])]);
              setRawUrl("");
            }}
          >
            <Input
              value={rawUrl}
              onChange={(e) => {
                setRawUrl(e.target.value);
                setUrlError(null);
              }}
              placeholder="https://…"
              aria-label="Photo URL"
              aria-invalid={!!urlError}
              aria-describedby={urlError ? "gallery-url-error" : undefined}
              inputMode="url"
            />
            <Button type="submit" variant="outline" aria-label="Add photo by URL">
              <Plus className="size-4" /> Add
            </Button>
          </form>
          {urlError && (
            <p id="gallery-url-error" role="alert" className="mt-1 text-xs text-destructive">
              {urlError}
            </p>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
