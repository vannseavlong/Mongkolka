"use client";

import { Button } from "@mongkolka/ui/button";
import type { SectionPanelContext } from "../workspace/panel-tabs/types";
import { AssetLibrary } from "./asset-library";
import { saveProfileImage } from "./profile-image-save";

const saveVenue = (url: string | null) => saveProfileImage("venue_image_url", url, "Could not update the venue photo");

/** Details section: the venue photo shown next to the event details. Pick or upload from the library. */
export function VenueAssets({ context }: { context: SectionPanelContext }) {
  const venue = context.profile.venue_image_url || null;

  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-2" aria-label="Venue photo">
        <h3 className="text-sm font-medium">Venue photo</h3>
        {venue ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={venue} alt="Current venue photo" className="h-20 w-32 rounded-md border object-cover" />
            <Button type="button" variant="outline" size="sm" onClick={() => void saveVenue(null)}>
              Remove venue photo
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No venue photo yet. Upload one or choose from the library below.</p>
        )}
      </section>

      <AssetLibrary
        selected={venue ? [venue] : []}
        pickLabel="Use as venue photo"
        onPick={(asset) => {
          if (asset.url !== venue) void saveVenue(asset.url);
        }}
      />
    </div>
  );
}
