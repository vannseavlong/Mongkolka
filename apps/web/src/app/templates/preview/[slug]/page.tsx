import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchJson } from "@/lib/api";
import type { SiteTemplateBySlugResponse } from "../../types";
import { TemplatePreview } from "../../template-preview";

// Internal route: proxy.ts rewrites {template-slug}.{ROOT_DOMAIN} here. It
// always renders the shared sample couple, never real couple data.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function TemplateSubdomainPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await fetchJson<SiteTemplateBySlugResponse>(
    `/public/api/site-templates/by-slug/${encodeURIComponent(slug)}`,
  );
  if (!data) notFound();

  return <TemplatePreview template={data.template} fullPage />;
}
