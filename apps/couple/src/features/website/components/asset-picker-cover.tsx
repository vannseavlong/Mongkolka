"use client";

import { useState } from "react";
import { Button } from "@mongkolka/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@mongkolka/ui/collapsible";
import { Input } from "@mongkolka/ui/input";
import type { PreviewProfile } from "../lib/build-content";
import { AssetLibrary } from "./asset-library";
import { isHttpUrl, URL_ERROR } from "./asset-library-logic";
import { saveProfileImage } from "./profile-image-save";

const saveCover = (url: string | null) => saveProfileImage("cover_photo_url", url, "Could not update the cover photo");

/** Hero cover photo: current cover, library to pick from, raw URL as an advanced option. */
export function CoverAssets({ profile }: { profile: PreviewProfile }) {
  const cover = profile.cover_photo_url || null;
  const [rawUrl, setRawUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-2" aria-label="Cover photo">
        <h3 className="text-sm font-medium">Cover photo</h3>
        {cover ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt="Current cover photo" className="h-20 w-32 rounded-md border object-cover" />
            <Button type="button" variant="outline" size="sm" onClick={() => void saveCover(null)}>
              Remove cover
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No cover photo yet. Choose one from the library below.</p>
        )}
      </section>

      <AssetLibrary
        selected={cover ? [cover] : []}
        pickLabel="Use as cover"
        onPick={(asset) => {
          if (asset.url !== cover) void saveCover(asset.url);
        }}
      />

      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button type="button" variant="ghost" size="sm">
            Advanced: set cover by URL
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
              void saveCover(url).then((ok) => ok && setRawUrl(""));
            }}
          >
            <Input
              value={rawUrl}
              onChange={(e) => {
                setRawUrl(e.target.value);
                setUrlError(null);
              }}
              placeholder="https://…"
              aria-label="Cover photo URL"
              aria-invalid={!!urlError}
              aria-describedby={urlError ? "cover-url-error" : undefined}
              inputMode="url"
            />
            <Button type="submit" variant="outline">
              Set
            </Button>
          </form>
          {urlError && (
            <p id="cover-url-error" role="alert" className="mt-1 text-xs text-destructive">
              {urlError}
            </p>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
