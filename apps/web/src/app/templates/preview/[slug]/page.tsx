import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchJson } from "@/lib/api";
import { brandUrl } from "@/lib/brand-url";
import type { SiteTemplateBySlugResponse } from "../../types";
import { TemplatePreview } from "../../template-preview";

// Internal route: proxy.ts rewrites {template-slug}.{ROOT_DOMAIN} here. It
// always renders the shared sample couple, never real couple data.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function TemplateSubdomainPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const lang = query.lang === "kh" ? "kh" : "en";
  const rawName = typeof query.name === "string" ? query.name : typeof query.to === "string" ? query.to : undefined;
  const guestGreeting = rawName?.split(",").map((part) => part.trim()).filter(Boolean).join(" & ") || undefined;
  const data = await fetchJson<SiteTemplateBySlugResponse>(
    `/public/api/site-templates/by-slug/${encodeURIComponent(slug)}`,
  );
  if (!data) notFound();

  return <TemplatePreview template={data.template} fullPage initialLanguage={lang} guestGreeting={guestGreeting} brandUrl={brandUrl()} />;
}
