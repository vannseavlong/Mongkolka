"use client";

import { useEffect, useState } from "react";
import { clearReturnPlace, navigationType, readReturnPlace, saveReturnPlace, shouldRestore } from "@/lib/return-place";
import {
  LanguageProvider,
  LanguageToggle,
  SiteRenderer,
  guestSubRoute,
  skinFromComponents,
  type CoupleInfo,
  type GuestbookData,
  type SectionKey,
} from "@mongkolka/templates";
import { buildActions, fetchGuestbook, submitGuestbook } from "./guestbook";
import { carryQuery } from "./wall-client";
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
        mapUrl: profile?.map_url ?? undefined,
        venueImageUrl: profile?.venue_image_url ?? undefined,
      };
    case "verse":
    case "video":
    case "invitation":
    case "agenda":
    case "letters":
    case "note":
    case "map":
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
  brandUrl,
}: {
  site: PublicSiteResponse;
  guestGreeting?: string;
  initialLanguage: "en" | "kh";
  /** Main-site URL for the footer credit link; undefined renders plain text. */
  brandUrl?: string;
}) {
  const [guestbook, setGuestbook] = useState<GuestbookData | undefined>();
  const slug = site.couple.slug;
  // Back from the gallery sub-page: go straight to the page where the reader left it, no cover and no opening.
  const [restoreY] = useState<number | null>(() => {
    const place = readReturnPlace(slug);
    return place && shouldRestore(place, navigationType(), Date.now()) ? place.y : null;
  });
  useEffect(() => {
    if (restoreY === null) return;
    clearReturnPlace(slug);
    // The sections and their photos settle over a moment, so settle the position a couple of times.
    const go = () => window.scrollTo({ top: restoreY, behavior: "auto" });
    go();
    const timers = [120, 450, 900].map((ms) => setTimeout(go, ms));
    return () => timers.forEach(clearTimeout);
  }, [restoreY, slug]);
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

  // The Covenant template turns the RSVP note into a wish on the wishes page (under the couple's own guestbook rules).
  const wishFromRsvp = skinFromComponents(site.template.default_components) === "covenant" && hasGuestbook;
  const query = carryQuery(guestGreeting, initialLanguage);
  const photosHref = guestSubRoute(slug, "photos");
  const wishesHref = guestSubRoute(slug, "wishes");
  const galleryHref = `/${encodeURIComponent(slug)}/gallery${query}`;

  async function submitWish(wish: { name: string; message: string }) {
    await submitGuestbook(slug, { name: wish.name, message: wish.message });
    fetchGuestbook(slug).then(setGuestbook).catch(() => undefined);
  }

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
    if (wishFromRsvp && submission.message?.trim()) {
      // Best effort: the RSVP is already saved; a closed or full guestbook must not fail it.
      submitGuestbook(slug, { name: submission.name, message: submission.message.trim() })
        .then(() => fetchGuestbook(slug).then(setGuestbook))
        .catch(() => undefined);
    }
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
        galleryHref={galleryHref}
        onGalleryOpen={() => saveReturnPlace(slug, window.scrollY)}
        skipIntro={restoreY !== null}
        extraProps={(sectionKey) => {
          if (sectionKey === "rsvp") {
            // Covenant: the reply form is a wish form only (no attendance question); the wish goes to the guestbook.
            if (wishFromRsvp) return { onSubmit: submitRsvp, wishOnly: true, onWish: submitWish };
            return { onSubmit: submitRsvp };
          }
          if (sectionKey === "guestbook") {
            return {
              guestbook,
              photosHref: photosHref ? `${photosHref}${query}` : undefined,
              wishesHref: wishesHref ? `${wishesHref}${query}` : undefined,
              actions: buildActions(site, [couple.partner1Name, couple.partner2Name].filter(Boolean).join(" & ")),
              onSubmit: async (input: Parameters<typeof submitGuestbook>[1]) => {
                const result = await submitGuestbook(slug, input);
                // re-read so an auto-approved wish shows up without a reload
                fetchGuestbook(slug).then(setGuestbook).catch(() => undefined);
                return result;
              },
            };
          }
          // The directions button on the map uses the venue link from the details.
          if (sectionKey === "map") return { mapUrl: site.profile?.map_url ?? undefined };
          if (sectionKey === "footer") return { brandUrl };
          return {};
        }}
      />
    </LanguageProvider>
  );
}
