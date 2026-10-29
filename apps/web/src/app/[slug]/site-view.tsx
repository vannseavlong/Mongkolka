"use client";

import { useEffect, useState } from "react";
import {
  LanguageProvider,
  LanguageToggle,
  SiteRenderer,
  type CoupleInfo,
  type GuestbookData,
  type SectionKey,
} from "@mongkolka/templates";
import { buildActions, fetchGuestbook, submitGuestbook } from "./guestbook";
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
    case "verse":
    case "footer":
      // Owned by website_sections.content; nothing derived from the profile.
      return {};
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
  const [guestbook, setGuestbook] = useState<GuestbookData | undefined>();
  const slug = site.couple.slug;
  const hasGuestbook = site.sections.some((s) => s.section_key === "guestbook" && s.enabled);
  useEffect(() => {
    if (!hasGuestbook) return;
    let cancelled = false;
    fetchGuestbook(slug)
      .then((data) => !cancelled && setGuestbook(data))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [slug, hasGuestbook]);

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
    const res = await fetch(`${API_URL}/public/api/site/${site.couple.slug}/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    });
    // fetch() only rejects on network errors — without this a 4xx/5xx would still
    // show the guest the "thank you" state even though nothing was saved.
    if (!res.ok) throw new Error(`RSVP failed (${res.status})`);
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
        extraProps={(sectionKey) => {
          if (sectionKey === "rsvp") return { onSubmit: submitRsvp };
          if (sectionKey === "guestbook") {
            return {
              guestbook,
              actions: buildActions(site, [couple.partner1Name, couple.partner2Name].filter(Boolean).join(" & ")),
              onSubmit: async (input: Parameters<typeof submitGuestbook>[1]) => {
                const result = await submitGuestbook(slug, input);
                // re-read so an auto-approved wish shows up without a reload
                fetchGuestbook(slug).then(setGuestbook).catch(() => undefined);
                return result;
              },
            };
          }
          return {};
        }}
      />
    </LanguageProvider>
  );
}
