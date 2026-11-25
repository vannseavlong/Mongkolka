"use client";

import { useSearchParams } from "next/navigation";
import {
  GalleryAllPage,
  LanguageProvider,
  LanguageToggle,
  resolveInitialLanguage,
  resolveTheme,
  skinFromComponents,
  SkinProvider,
  TextOverridesProvider,
  titleOverrides,
} from "@mongkolka/templates";
import { markReturning } from "@/lib/return-place";
import { PageLoading, PageMessage } from "@/components/loading-state";
import { guestGreetingFrom } from "@/lib/guest-name";
import { useRouteParam } from "@/lib/route-param";
import { useApi } from "@/lib/use-api";
import { carryQuery } from "../wall-client";
import type { PublicSiteResponse } from "../types";

/** `/<slug>/gallery`: every photo of the couple's gallery, in the language and theme of their site. */
export function GalleryClient() {
  const slug = useRouteParam();
  const query = useSearchParams();
  const site = useApi<PublicSiteResponse>(slug ? `/public/api/site/${encodeURIComponent(slug)}` : null);

  if (site.status === "not-found") return <PageMessage withChrome={false} title="Page not found" body="This wedding website doesn't exist or isn't published." />;
  if (site.status === "error") return <PageMessage withChrome={false} title="Couldn't load this page" body="Please try again in a moment." />;
  if (site.status === "loading" || !slug) return <PageLoading withChrome={false} />;

  const { data } = site;
  if (!data.template) return <PageMessage withChrome={false} title="Not ready yet" body="This wedding website isn't ready yet." />;
  const lang = resolveInitialLanguage(query.get("lang"), data.profile?.default_language);
  const guest = guestGreetingFrom(Object.fromEntries(query.entries()));
  const theme = resolveTheme(data.template.default_theme, data.profile?.theme_override, null);
  const gallery = data.sections.find((s) => s.section_key === "gallery" && s.enabled);
  const stored = (gallery?.content as { photos?: unknown } | null | undefined)?.photos;
  const photos = Array.isArray(stored) ? stored.filter((p): p is string => typeof p === "string" && p.trim() !== "") : [];
  const couple = {
    partner1Name: data.couple.partner1_name ?? "Partner One",
    partner2Name: data.couple.partner2_name ?? undefined,
    weddingDate: data.couple.wedding_date ?? undefined,
  };

  return (
    <LanguageProvider initialLanguage={lang}>
      <TextOverridesProvider overrides={titleOverrides(data.sections)}>
        <LanguageToggle theme={{ text_color: theme.text_color }} />
        <SkinProvider skin={skinFromComponents(data.template.default_components)}>
          <GalleryAllPage theme={theme} couple={couple} photos={photos} backHref={`/${encodeURIComponent(slug)}${carryQuery(guest, lang)}`} onBack={() => markReturning(slug)} />
        </SkinProvider>
      </TextOverridesProvider>
    </LanguageProvider>
  );
}
