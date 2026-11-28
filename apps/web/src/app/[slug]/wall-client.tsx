"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CovenantPhotosPage,
  CovenantWishesPage,
  LanguageProvider,
  LanguageToggle,
  resolveInitialLanguage,
  resolveTheme,
  SiteFonts,
  type GuestbookData,
  type WallStatus,
} from "@mongkolka/templates";
import { PageLoading, PageMessage } from "@/components/loading-state";
import { guestGreetingFrom } from "@/lib/guest-name";
import { useRouteParam } from "@/lib/route-param";
import { useApi } from "@/lib/use-api";
import { fetchGuestbook, submitGuestbook } from "./guestbook";
import type { PublicSiteResponse } from "./types";

/** Query string that keeps the invited guest and the language when moving between the invitation and these pages. */
export function carryQuery(guest: string | undefined, lang: "en" | "kh"): string {
  const q = new URLSearchParams();
  if (guest) q.set("to", guest);
  // Always carried: the site may open in Khmer or English by default, so the link must say which the guest is reading.
  q.set("lang", lang);
  const s = q.toString();
  return s ? `?${s}` : "";
}

/**
 * `/<slug>/wishes` and `/<slug>/photos`: the full guest wall of a Covenant site. Reads the site (theme, names) and
 * the guestbook from the public API in the browser; the couple's own photo rules decide what appears and what can be sent.
 */
export function WallClient({ page }: { page: "wishes" | "photos" }) {
  const slug = useRouteParam();
  const query = useSearchParams();
  const site = useApi<PublicSiteResponse>(slug ? `/public/api/site/${encodeURIComponent(slug)}` : null);
  const [wall, setWall] = useState<{ status: WallStatus; data?: GuestbookData }>({ status: "loading" });

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    fetchGuestbook(slug)
      .then((data) => !cancelled && setWall({ status: "ready", data }))
      .catch(() => !cancelled && setWall({ status: "error" }));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const Page = page === "wishes" ? CovenantWishesPage : CovenantPhotosPage;
  if (site.status === "not-found") return <PageMessage withChrome={false} title="Page not found" body="This wedding website doesn't exist or isn't published." />;
  if (site.status === "error") return <PageMessage withChrome={false} title="Couldn't load this page" body="Please try again in a moment." />;
  if (site.status === "loading" || !slug) return <PageLoading withChrome={false} />;

  const { data } = site;
  if (!data.template) return <PageMessage withChrome={false} title="Not ready yet" body="This wedding website isn't ready yet." />;
  const guest = guestGreetingFrom(Object.fromEntries(query.entries()));
  const lang = resolveInitialLanguage(query.get("lang"), data.profile?.default_language);
  const theme = resolveTheme(data.template.default_theme, data.profile?.theme_override, null);
  const couple = {
    partner1Name: data.couple.partner1_name ?? "Partner One",
    partner2Name: data.couple.partner2_name ?? undefined,
    weddingDate: data.couple.wedding_date ?? undefined,
  };
  const backHref = `/${encodeURIComponent(slug)}${carryQuery(guest, lang)}`;

  return (
    <LanguageProvider initialLanguage={lang}>
      <SiteFonts theme={theme}>
        <LanguageToggle theme={{ text_color: theme.text_color }} />
        <Page
          theme={theme}
          couple={couple}
          data={wall.data}
          status={wall.status}
          backHref={backHref}
          guestName={guest}
          onSubmit={async (input) => {
            const result = await submitGuestbook(slug, input);
            fetchGuestbook(slug).then((d) => setWall({ status: "ready", data: d })).catch(() => undefined);
            return result;
          }}
        />
      </SiteFonts>
    </LanguageProvider>
  );
}
