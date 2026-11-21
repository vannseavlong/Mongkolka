import { Suspense } from "react";
import { SlugClient } from "./slug-client";

// Static export: built once with the placeholder slug "_"; Firebase Hosting rewrites every
// /<slug> URL to this shell and SlugClient reads the real slug from the browser path.
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ slug: "_" }];
}

export default function Page() {
  return (
    <Suspense>
      <SlugClient />
    </Suspense>
  );
}
