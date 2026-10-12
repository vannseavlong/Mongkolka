"use client";

import Link from "next/link";
import { ArrowRight, Camera, Gift, Globe, MessageCircleHeart, Users, Wallet, ListChecks } from "lucide-react";
import { Skeleton } from "@mongkolka/ui/skeleton";
import { Main } from "@mongkolka/ui/layout/main";
import { useApiQuery } from "@/lib/use-api-query";
import type { OverviewStats } from "./data/schema";

const RSVP_SEGMENTS = [
  { key: "confirmed", label: "Confirmed", color: "bg-emerald-500" },
  { key: "maybe", label: "Maybe", color: "bg-amber-400" },
  { key: "invited-in-person", label: "Invited", color: "bg-sky-400" },
  { key: "declined", label: "Declined", color: "bg-rose-400" },
  { key: "no-response", label: "No response", color: "bg-muted-foreground/30" },
  { key: "not-invited", label: "Not invited", color: "bg-muted-foreground/15" },
] as const;

function money(amount: number, currency: string) {
  return currency === "KHR"
    ? `${Math.round(amount).toLocaleString()} ៛`
    : `$${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function pct(part: number, whole: number) {
  return whole > 0 ? Math.min(100, Math.round((part / whole) * 100)) : 0;
}

function ProgressBar({ value, className = "bg-primary" }: { value: number; className?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className={`h-full rounded-full transition-all ${className}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function Tile({
  icon: Icon,
  label,
  href,
  children,
}: {
  icon: typeof Users;
  label: string;
  href?: string;
  children: React.ReactNode;
}) {
  const body = (
    <div className="flex h-full flex-col gap-3 rounded-xl border bg-card p-5 transition-colors hover:border-foreground/20">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4" />
        {label}
      </div>
      {children}
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export function Overview() {
  const { data, loading, error } = useApiQuery<OverviewStats>("/couple/api/overview");

  if (error) {
    return (
      <Main>
        <p className="text-destructive">{error}</p>
      </Main>
    );
  }

  if (loading || !data) {
    return (
      <Main>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </Main>
    );
  }

  const days = data.daysUntilWedding;
  const rsvpTotal = data.totalGuests;
  const giftCurrencies = Object.entries(data.gifts);
  const attention = [
    data.photosPending > 0 && { icon: Camera, text: `${data.photosPending} photo${data.photosPending > 1 ? "s" : ""} waiting for review`, href: "/photos" },
    data.wishesPending > 0 && { icon: MessageCircleHeart, text: `${data.wishesPending} wish${data.wishesPending > 1 ? "es" : ""} waiting for review`, href: "/photos" },
    data.giftsReportedCount > 0 && { icon: Gift, text: `${data.giftsReportedCount} reported gift${data.giftsReportedCount > 1 ? "s" : ""} to confirm`, href: "/photos" },
    data.websiteStatus !== "published" && { icon: Globe, text: "Your website isn't published yet", href: "/website" },
    !data.weddingDate && { icon: Globe, text: "Set your wedding date", href: "/profile" },
  ].filter(Boolean) as { icon: typeof Users; text: string; href: string }[];

  return (
    <Main>
      <div className="flex flex-col gap-5">
        {/* hero: countdown */}
        <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-widest opacity-80">Countdown to the big day</p>
              <p className="mt-2 text-6xl font-semibold leading-none sm:text-7xl">
                {days == null ? "—" : days < 0 ? "Done" : days}
                {days != null && days >= 0 && <span className="ml-3 text-2xl font-normal opacity-80">days</span>}
              </p>
              {data.weddingDate && (
                <p className="mt-3 opacity-90">
                  {new Date(data.weddingDate).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </p>
              )}
            </div>
            <Link
              href="/website"
              className="inline-flex items-center gap-2 rounded-full bg-background/15 px-4 py-2 text-sm backdrop-blur transition hover:bg-background/25"
            >
              <Globe className="size-4" />
              Website {data.websiteStatus}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        {/* KPI tiles */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Tile icon={Users} label="Expected guests" href="/guests">
            <p className="text-3xl font-semibold">{data.expectedHeadcount}</p>
            <p className="text-sm text-muted-foreground">
              {data.confirmedGuests} of {data.totalGuests} invited confirmed (with plus-ones)
            </p>
          </Tile>

          <Tile icon={Gift} label="Gifts received" href="/guests">
            {giftCurrencies.length === 0 ? (
              <p className="text-sm text-muted-foreground">No gifts recorded yet.</p>
            ) : (
              <div className="flex flex-col gap-1">
                {giftCurrencies.map(([currency, v]) => (
                  <p key={currency} className="text-2xl font-semibold">
                    {money(v.received, currency)}
                  </p>
                ))}
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              from {data.giftsReceivedCount} guest{data.giftsReceivedCount === 1 ? "" : "s"}
              {data.giftsReportedCount > 0 && ` · ${data.giftsReportedCount} to confirm`}
            </p>
          </Tile>

          <Tile icon={Wallet} label="Budget spent" href="/budget">
            <p className="text-3xl font-semibold">{pct(data.totalSpent, data.totalAllocated)}%</p>
            <ProgressBar
              value={pct(data.totalSpent, data.totalAllocated)}
              className={data.totalSpent > data.totalAllocated ? "bg-rose-500" : "bg-primary"}
            />
            <p className="text-sm text-muted-foreground">
              ${data.totalSpent.toLocaleString()} of ${data.totalAllocated.toLocaleString()}
            </p>
          </Tile>

          <Tile icon={ListChecks} label="Checklist" href="/checklist">
            <p className="text-3xl font-semibold">
              {data.completedChecklistItems}
              <span className="text-lg font-normal text-muted-foreground"> / {data.totalChecklistItems}</span>
            </p>
            <ProgressBar value={pct(data.completedChecklistItems, data.totalChecklistItems)} className="bg-emerald-500" />
            <p className="text-sm text-muted-foreground">tasks done</p>
          </Tile>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* RSVP breakdown */}
          <section className="rounded-xl border bg-card p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">RSVP status</h2>
              <Link href="/guests" className="text-sm text-muted-foreground hover:text-foreground">
                Manage guests
              </Link>
            </div>
            {rsvpTotal === 0 ? (
              <p className="text-sm text-muted-foreground">Add guests to start tracking RSVPs.</p>
            ) : (
              <>
                <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
                  {RSVP_SEGMENTS.map((seg) => {
                    const n = data.guestsByStatus[seg.key] ?? 0;
                    return n > 0 ? (
                      <div key={seg.key} className={seg.color} style={{ width: `${(n / rsvpTotal) * 100}%` }} title={`${seg.label}: ${n}`} />
                    ) : null;
                  })}
                </div>
                <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                  {RSVP_SEGMENTS.map((seg) => (
                    <li key={seg.key} className="flex items-center gap-2 text-sm">
                      <span className={`size-2.5 rounded-full ${seg.color}`} />
                      <span className="text-muted-foreground">{seg.label}</span>
                      <span className="ml-auto font-medium">{data.guestsByStatus[seg.key] ?? 0}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          {/* needs attention */}
          <section className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 font-semibold">Needs your attention</h2>
            {attention.length === 0 ? (
              <p className="text-sm text-muted-foreground">You&apos;re all caught up. 🎉</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {attention.map((item) => (
                  <li key={item.text}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition hover:bg-muted"
                    >
                      <item.icon className="size-4 shrink-0 text-muted-foreground" />
                      <span>{item.text}</span>
                      <ArrowRight className="ml-auto size-4 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* guestbook */}
          <Tile icon={MessageCircleHeart} label="Guestbook" href="/photos">
            <div className="flex gap-8">
              <div>
                <p className="text-3xl font-semibold">{data.photosApproved}</p>
                <p className="text-sm text-muted-foreground">photos shown</p>
              </div>
              <div>
                <p className="text-3xl font-semibold">{data.wishesTotal}</p>
                <p className="text-sm text-muted-foreground">wishes</p>
              </div>
            </div>
          </Tile>

          {/* next milestones */}
          <section className="rounded-xl border bg-card p-5 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Up next</h2>
              <Link href="/milestones" className="text-sm text-muted-foreground hover:text-foreground">
                All milestones
              </Link>
            </div>
            {data.nextMilestones.length === 0 ? (
              <p className="text-sm text-muted-foreground">No open milestones.</p>
            ) : (
              <ul className="flex flex-col divide-y">
                {data.nextMilestones.map((m) => (
                  <li key={m.title} className="flex items-baseline justify-between gap-4 py-2">
                    <div>
                      <p className="font-medium">{m.title}</p>
                      {m.task && <p className="text-sm text-muted-foreground">{m.task}</p>}
                    </div>
                    <span className="shrink-0 text-sm text-muted-foreground">
                      {m.months_before} mo before
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </Main>
  );
}
