import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { fetchJson } from "@/lib/api";
import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { WhyChoose } from "@/components/landing/why-choose";
import { LivePreviews } from "@/components/landing/live-previews";
import { Testimonials } from "@/components/landing/testimonials";
import { FinalCta } from "@/components/landing/final-cta";
import type { SiteTemplatesResponse } from "./templates/types";
import type { VendorsListResponse } from "./marketplace/types";

export default async function Home() {
  // These teaser sections show a live preview of real data, but the rest of
  // the landing page has nothing to do with the API — so a backend hiccup
  // should only empty out the previews (handled by LivePreviews), never
  // crash the whole marketing page.
  const [templatesRes, vendorsRes] = await Promise.all([
    fetchJson<SiteTemplatesResponse>("/public/api/site-templates").catch(() => null),
    fetchJson<VendorsListResponse>("/public/api/vendors?page=1").catch(() => null),
  ]);

  const templates = (templatesRes?.templates ?? []).slice(0, 3);
  const vendors = (vendorsRes?.vendors ?? []).slice(0, 4);

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />
      <Hero />
      <About />
      <WhyChoose />
      <LivePreviews templates={templates} vendors={vendors} />
      <Testimonials />
      <FinalCta />
      <SiteFooter />
    </main>
  );
}
