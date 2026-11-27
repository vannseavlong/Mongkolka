"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@mongkolka/ui/card";
import { AssetLibrary } from "@/features/website/components/asset-library";

/** More columns than the builder panel gets: this card is the wide one. */
const WIDE_GRID = "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4";

/** The couple's image library as a manage-only view: upload and delete here, pick in the website builder. */
export function StorageLibraryCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Website photos</CardTitle>
        <CardDescription>Upload photos once, then choose them for your cover, gallery and other sections.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* The Drive card beside it already explains a lost connection. */}
        <AssetLibrary gridClassName={WIDE_GRID} showDriveNotice={false} />
      </CardContent>
    </Card>
  );
}
