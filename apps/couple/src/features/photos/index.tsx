"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { useApiQuery } from "@/lib/use-api-query";
import { PhotoGrid } from "./components/photo-grid";
import { PROFILE_KEY, PhotoSettingsCard } from "./components/photo-settings-card";
import type { Photo, PhotoSettings } from "./data/schema";

export function Photos() {
  const photos = useApiQuery<{ photos: Photo[] }>("/couple/api/photos");
  const profile = useApiQuery<{ profile: PhotoSettings }>(PROFILE_KEY);
  const list = photos.data?.photos ?? [];
  const pending = list.filter((p) => p.status === "pending").length;

  return (
    <Main>
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Guest photos</h1>
        <p className="text-muted-foreground">
          {list.length} photo{list.length === 1 ? "" : "s"}
          {pending > 0 ? ` · ${pending} waiting for review` : ""}
        </p>
      </div>

      {profile.data && (
        // keyed so the form re-seeds from the server value after a save/refetch
        <PhotoSettingsCard key={JSON.stringify(profile.data.profile)} settings={profile.data.profile} />
      )}

      <div className="mt-6">
        {photos.error && <p className="text-destructive">{photos.error}</p>}
        <PhotoGrid photos={list} onChanged={photos.refetch} />
      </div>
    </Main>
  );
}
