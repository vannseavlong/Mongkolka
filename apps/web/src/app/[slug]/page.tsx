import { notFound } from "next/navigation";
import { brandUrl } from "@/lib/brand-url";
import { guestGreetingFrom } from "@/lib/guest-name";
import { SiteView } from "./site-view";
import type { PublicSiteResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  // `name` (or the alias `to`) may hold several guests, comma-separated; capped at 80 characters.
  const guestGreeting = guestGreetingFrom(query);
  const lang = typeof query.lang === "string" && query.lang === "kh" ? "kh" : "en";

  const res = await fetch(`${API_URL}/public/api/site/${slug}`, { cache: "no-store" });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("Failed to load site");

  const site = (await res.json()) as PublicSiteResponse;

  return <SiteView site={site} guestGreeting={guestGreeting} initialLanguage={lang} brandUrl={brandUrl()} />;
}
