"use client";

import { useMemo, useState } from "react";
import { Main } from "@mongkolka/ui/layout/main";
import { useApiQuery } from "@/lib/use-api-query";
import { PhotoGrid } from "./components/photo-grid";
import { PROFILE_KEY, PhotoSettingsCard } from "./components/photo-settings-card";
import { WishesList } from "./components/wishes-list";
import type { Photo, PhotoSettings, Wish } from "./data/schema";

type Tab = "photos" | "wishes";

export function Photos() {
  const photos = useApiQuery<{ photos: Photo[] }>("/couple/api/photos");
  const wishes = useApiQuery<{ wishes: Wish[] }>("/couple/api/wishes");
  const profile = useApiQuery<{ profile: PhotoSettings }>(PROFILE_KEY);
  const [tab, setTab] = useState<Tab>("photos");

  const photoList = photos.data?.photos ?? [];
  const wishList = wishes.data?.wishes ?? [];
  const photoUrls = useMemo(() => new Map(photoList.map((p) => [p.photo_id, p.url])), [photoList]);
  const pendingPhotos = photoList.filter((p) => p.status === "pending").length;
  const pendingWishes = wishList.filter((w) => w.status === "pending").length;

  const tabs: { id: Tab; label: string; count: number; pending: number }[] = [
    { id: "photos", label: "Photos", count: photoList.length, pending: pendingPhotos },
    { id: "wishes", label: "Wishes", count: wishList.length, pending: pendingWishes },
  ];

  return (
    <Main>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Guestbook</h1>
        <p className="text-muted-foreground">Photos and wishes your guests share on your wedding website.</p>
      </div>

      {profile.data && (
        // keyed so the form re-seeds from the server value after a save/refetch
        <PhotoSettingsCard key={JSON.stringify(profile.data.profile)} settings={profile.data.profile} />
      )}

      <div className="mt-8">
        <div role="tablist" className="mb-4 flex gap-1 border-b">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition ${
                tab === t.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{t.count}</span>
              {t.pending > 0 && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900">
                  {t.pending} to review
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "photos" && (
          <>
            {photos.error && <p className="text-destructive">{photos.error}</p>}
            <PhotoGrid photos={photoList} onChanged={photos.refetch} />
          </>
        )}
        {tab === "wishes" && (
          <>
            {wishes.error && <p className="text-destructive">{wishes.error}</p>}
            <WishesList wishes={wishList} photoUrls={photoUrls} onChanged={wishes.refetch} />
          </>
        )}
      </div>
    </Main>
  );
}
