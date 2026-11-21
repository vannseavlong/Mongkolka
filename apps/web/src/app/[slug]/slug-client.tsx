"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { PageLoading, PageMessage } from "@/components/loading-state";
import { API_URL } from "@/lib/api";
import { brandUrl } from "@/lib/brand-url";
import { guestGreetingFrom } from "@/lib/guest-name";
import { isMainHost } from "@/lib/hosts";
import { useRouteParam } from "@/lib/route-param";
import { useApi } from "@/lib/use-api";
import { SiteView } from "./site-view";
import type { PublicSiteResponse } from "./types";

/** The couple slug for this page: the first path segment, or the custom domain's couple. */
function useSlug(): { slug: string | undefined; failed: boolean } {
  const pathSlug = useRouteParam();
  const [domainSlug, setDomainSlug] = useState<{ host: string; slug: string | null } | null>(null);
  // null during the static build / first render, the real hostname in the browser.
  const host = useSyncExternalStore(
    () => () => {},
    () => window.location.hostname.toLowerCase(),
    () => null,
  );
  const needsDomain = host !== null && !pathSlug && !isMainHost(host);

  useEffect(() => {
    if (!needsDomain || !host) return;
    let cancelled = false;
    fetch(`${API_URL}/public/api/site-by-domain/${encodeURIComponent(host)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((body: { slug?: string } | null) => !cancelled && setDomainSlug({ host, slug: body?.slug ?? null }))
      .catch(() => !cancelled && setDomainSlug({ host, slug: null }));
    return () => {
      cancelled = true;
    };
  }, [needsDomain, host]);

  if (pathSlug) return { slug: pathSlug, failed: false };
  if (needsDomain && domainSlug?.host === host) return { slug: domainSlug.slug ?? undefined, failed: domainSlug.slug === null };
  return { slug: undefined, failed: host !== null && !needsDomain };
}

export function SlugClient() {
  const query = useSearchParams();
  const { slug, failed } = useSlug();
  const state = useApi<PublicSiteResponse>(slug ? `/public/api/site/${encodeURIComponent(slug)}` : null);

  if (failed || state.status === "not-found") {
    return <PageMessage withChrome={false} title="Page not found" body="This wedding website doesn't exist or isn't published." />;
  }
  if (state.status === "error") {
    return <PageMessage withChrome={false} title="Couldn't load this site" body="Please try again in a moment." />;
  }
  if (state.status === "loading") return <PageLoading withChrome={false} />;

  // `name` (or the alias `to`) may hold several guests, comma-separated; capped at 80 characters.
  const guestGreeting = guestGreetingFrom(Object.fromEntries(query.entries()));
  const lang = query.get("lang") === "kh" ? "kh" : "en";
  return <SiteView site={state.data} guestGreeting={guestGreeting} initialLanguage={lang} brandUrl={brandUrl()} />;
}
