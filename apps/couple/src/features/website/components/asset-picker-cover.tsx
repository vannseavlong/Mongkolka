"use client";

import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@mongkolka/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@mongkolka/ui/collapsible";
import { Input } from "@mongkolka/ui/input";
import { api, ApiError } from "@/lib/api";
import type { CoupleProfile } from "@/features/profile/data/schema";
import type { SectionPanelContext } from "../workspace/panel-tabs/types";
import { AssetLibrary } from "./asset-library";
import { PROFILE_KEY } from "./asset-library-api";

type ProfileCache = { profile: CoupleProfile };

/** Saves the couple's cover photo through the profile PATCH, updating the cached profile first so the canvas reacts at once. */
async function saveCover(url: string | null) {
  let previous: string | null | undefined;
  await mutate(
    PROFILE_KEY,
    (cur?: ProfileCache) => {
      previous = cur?.profile.cover_photo_url;
      return cur && { profile: { ...cur.profile, cover_photo_url: url } };
    },
    { revalidate: false },
  );
  try {
    // The profile endpoint takes a string; an empty string clears the cover.
    await api.patch(PROFILE_KEY, { cover_photo_url: url ?? "" });
    return true;
  } catch (err) {
    mutate(PROFILE_KEY, (cur?: ProfileCache) => cur && { profile: { ...cur.profile, cover_photo_url: previous ?? null } }, {
      revalidate: false,
    });
    toast.error(err instanceof ApiError ? err.message : "Could not update the cover photo");
    return false;
  }
}

/** Hero cover photo: current cover, library to pick from, raw URL as an advanced option. */
export function CoverAssets({ context }: { context: SectionPanelContext }) {
  const cover = context.profile.cover_photo_url || null;
  const [rawUrl, setRawUrl] = useState("");

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
              void saveCover(url).then((ok) => ok && setRawUrl(""));
            }}
          >
            <Input value={rawUrl} onChange={(e) => setRawUrl(e.target.value)} placeholder="https://…" aria-label="Cover photo URL" inputMode="url" />
            <Button type="submit" variant="outline">
              Set
            </Button>
          </form>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
