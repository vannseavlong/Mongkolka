"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageLoading, PageMessage } from "@/components/loading-state";
import { brandUrl } from "@/lib/brand-url";
import { guestGreetingFrom } from "@/lib/guest-name";
import { useRouteParam } from "@/lib/route-param";
import { useApi } from "@/lib/use-api";
import type { SiteTemplateBySlugResponse } from "../../types";
import { TemplatePreview } from "../../template-preview";

// Always renders the shared sample couple, never real couple data.
export function PreviewClient() {
  return (
    <Suspense fallback={<PageLoading withChrome={false} />}>
      <Preview />
    </Suspense>
  );
}

function Preview() {
  const slug = useRouteParam(["templates", "preview"]);
  const query = useSearchParams();
  const state = useApi<SiteTemplateBySlugResponse>(
    slug ? `/public/api/site-templates/by-slug/${encodeURIComponent(slug)}` : null,
  );
  if (state.status === "loading") return <PageLoading withChrome={false} />;
  if (state.status === "not-found") return <PageMessage withChrome={false} title="Template not found" />;
  if (state.status === "error") {
    return <PageMessage withChrome={false} title="This preview is unavailable right now" body="Please try again in a moment." />;
  }
  const lang = query.get("lang") === "kh" ? "kh" : "en";
  const guestGreeting = guestGreetingFrom(Object.fromEntries(query.entries()));
  return (
    <TemplatePreview template={state.data.template} fullPage initialLanguage={lang} guestGreeting={guestGreeting} brandUrl={brandUrl()} />
  );
}
