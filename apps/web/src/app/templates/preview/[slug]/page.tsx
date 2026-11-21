import type { Metadata } from "next";
import { PreviewClient } from "./preview-client";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Static export: one shell built with the placeholder "_"; Firebase rewrites /templates/preview/<slug> to it.
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ slug: "_" }];
}

export default function Page() {
  return <PreviewClient />;
}
