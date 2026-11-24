import { Suspense } from "react";
import { WallClient } from "../wall-client";

// Static export: built once with the placeholder slug "_"; Firebase Hosting rewrites /<slug>/photos to this shell.
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ slug: "_" }];
}

export default function Page() {
  return (
    <Suspense>
      <WallClient page="photos" />
    </Suspense>
  );
}
