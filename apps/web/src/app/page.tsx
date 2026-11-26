"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Suspense, useSyncExternalStore } from "react";
import { isMainHost } from "@/lib/hosts";
import { useApi } from "@/lib/use-api";
import { SlugClient } from "./[slug]/slug-client";
import { Hero } from "@/components/landing/hero";
import { StatsStrip } from "@/components/landing/stats-strip";
import { Story } from "@/components/landing/story";
import { Features } from "@/components/landing/features";
import { Showcase } from "@/components/landing/showcase";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Faq } from "@/components/landing/faq";
import { LivePreviews } from "@/components/landing/live-previews";
import { Testimonials } from "@/components/landing/testimonials";
import { FinalCta } from "@/components/landing/final-cta";
import type { SiteTemplatesResponse } from "./templates/types";
import type { VendorsListResponse } from "./marketplace/types";

export default function Page() {
  // A custom domain mapped to a couple serves that couple's site at "/"; the main hosts show the
  // landing page (the static build and first render always do).
  const customHost = useSyncExternalStore(
    () => () => {},
    () => !isMainHost(window.location.hostname.toLowerCase()),
    () => false,
  );
  if (customHost) {
    return (
      <Suspense>
        <SlugClient />
      </Suspense>
    );
  }
  return <Home />;
}

function Home() {
  // These teaser sections show a live preview of real data, but the rest of the landing page has
  // nothing to do with the API, so a backend hiccup (or a cold start) only leaves the previews
  // empty (handled by LivePreviews) and never breaks the marketing page.
  const templatesRes = useApi<SiteTemplatesResponse>("/public/api/site-templates");
  const vendorsRes = useApi<VendorsListResponse>("/public/api/vendors?page=1");

  const templates = (templatesRes.status === "ready" ? templatesRes.data.templates : []).slice(0, 3);
  const vendors = (vendorsRes.status === "ready" ? vendorsRes.data.vendors : []).slice(0, 4);

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />
      <Hero />
      <StatsStrip />
      <Story />
      <Features />
      <Showcase />
      <HowItWorks />
      <LivePreviews
        templates={templates}
        vendors={vendors}
        loading={templatesRes.status === "loading" || vendorsRes.status === "loading"}
      />
      <Testimonials />
      <Faq />
      <FinalCta />
      <SiteFooter />
    </main>
  );
}
