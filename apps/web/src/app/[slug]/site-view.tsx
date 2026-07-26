"use client";

import { LanguageProvider, LanguageToggle, SiteRenderer, type CoupleInfo, type SectionKey } from "@mongkolka/templates";
import type { PublicSiteResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function buildContent(sectionKey: SectionKey, profile: PublicSiteResponse["profile"]) {
  switch (sectionKey) {
    case "hero":
      return { coverPhotoUrl: profile?.cover_photo_url ?? undefined };
    case "story":
      return { loveStory: profile?.love_story ?? undefined };
    case "details":
      return {
        ceremonyTime: profile?.ceremony_time ?? undefined,
        ceremonyVenue: profile?.ceremony_venue ?? undefined,
        ceremonyAddress: profile?.ceremony_address ?? undefined,
        receptionTime: profile?.reception_time ?? undefined,
        receptionVenue: profile?.reception_venue ?? undefined,
        receptionAddress: profile?.reception_address ?? undefined,
        dressCode: profile?.dress_code ?? undefined,
      };
    default:
      return {};
  }
}

export function SiteView({
  site,
  guestGreeting,
  initialLanguage,
}: {
  site: PublicSiteResponse;
  guestGreeting?: string;
  initialLanguage: "en" | "kh";
}) {
  if (!site.template) {
    return (
      <main className="flex min-h-screen items-center justify-center text-center text-muted-foreground">
        This wedding website isn&apos;t ready yet.
      </main>
    );
  }

  const couple: CoupleInfo = {
    partner1Name: site.couple.partner1_name ?? "Partner One",
    partner2Name: site.couple.partner2_name ?? undefined,
    weddingDate: site.couple.wedding_date ?? undefined,
  };

  async function submitRsvp(submission: {
    name: string;
    attending: boolean;
    plusOne: boolean;
    message?: string;
  }) {
    await fetch(`${API_URL}/public/api/site/${site.couple.slug}/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });
  }

  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <LanguageToggle theme={{ text_color: site.template.default_theme.text_color }} />
      <SiteRenderer
        template={site.template}
        sections={site.sections}
        themeOverride={site.profile?.theme_override}
        couple={couple}
        buildContent={(sectionKey) => buildContent(sectionKey, site.profile)}
        guestGreeting={guestGreeting}
        extraProps={(sectionKey) => (sectionKey === "rsvp" ? { onSubmit: submitRsvp } : {})}
      />
    </LanguageProvider>
  );
}
