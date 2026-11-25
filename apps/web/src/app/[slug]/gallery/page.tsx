import { Suspense } from "react";
import { GalleryClient } from "./gallery-client";

// Static export: built once with the placeholder slug "_"; Firebase Hosting rewrites /<slug>/gallery to this shell.
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ slug: "_" }];
}

export default function Page() {
  return (
    <Suspense>
      <GalleryClient />
    </Suspense>
  );
}
