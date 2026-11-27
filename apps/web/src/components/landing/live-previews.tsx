"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Store } from "lucide-react";
import { Skeleton } from "@mongkolka/ui/skeleton";
import type { SiteTemplateSummary } from "@/app/templates/types";
import type { VendorListItem } from "@/app/marketplace/types";
import { TemplateThumb } from "@/app/templates/template-thumb";
import { Categories } from "./categories";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

function SeeAll({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary">
      {children}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

function CardSkeletons({ count, className }: { count: number; className: string }) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-56 rounded-3xl" />
      ))}
    </div>
  );
}

export function LivePreviews({
  templates,
  vendors,
  loading,
}: {
  templates: SiteTemplateSummary[];
  vendors: VendorListItem[];
  loading: boolean;
}) {
  return (
    <>
      <section id="templates" className="bg-brand-wash px-5 py-20 sm:px-12 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            align="left"
            eyebrow="Wedding websites"
            title="Choose a template that feels like you"
            description="Preview real designs, then customise the colours and sections once you start planning."
            action={<SeeAll href="/templates">Browse all templates</SeeAll>}
          />

          {loading ? (
            <CardSkeletons count={3} className="grid gap-6 sm:grid-cols-3" />
          ) : templates.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-brand-line py-12 text-center text-muted-foreground">
              Templates are coming soon.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((template, index) => (
                <Reveal key={template.template_id} delay={index * 0.08} className="h-full">
                  <Link
                    href={`/templates/${template.template_id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-card transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10"
                  >
                    <div className="relative">
                      <TemplateThumb template={template} />
                      <span className="absolute right-3 bottom-3 rounded-full bg-card/90 px-3 py-1 text-xs font-medium opacity-0 shadow transition-opacity group-hover:opacity-100">
                        Preview
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 p-5">
                      <h3 className="font-display text-xl font-medium">{template.name}</h3>
                      <div className="flex shrink-0 -space-x-1">
                        {[
                          template.default_theme.bg_color,
                          template.default_theme.accent_color,
                          template.default_theme.text_color,
                        ].map((color, i) => (
                          <span
                            key={i}
                            className="size-5 rounded-full border-2 border-card"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="vendors" className="px-5 py-20 sm:px-12 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            align="left"
            eyebrow="Marketplace"
            title="Meet trusted wedding vendors"
            description="Photographers, venues, salons and more. Find the people who will make your day."
            action={<SeeAll href="/marketplace">Browse the marketplace</SeeAll>}
          />

          <Categories />

          {loading ? (
            <CardSkeletons count={4} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" />
          ) : vendors.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-brand-line py-12 text-center text-muted-foreground">
              Vendors are joining soon.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {vendors.map((vendor, index) => (
                <Reveal key={vendor.vendor_id} delay={index * 0.07} className="h-full">
                  <Link
                    href={`/marketplace/${vendor.vendor_id}`}
                    className="group flex h-full flex-col gap-3 rounded-3xl border bg-card p-6 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10"
                  >
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-brand-tint">
                      <Store className="size-5 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-medium">{vendor.business_name || "Unnamed vendor"}</h3>
                    {vendor.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="size-3.5" />
                        {vendor.location}
                      </div>
                    )}
                    {vendor.description && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">{vendor.description}</p>
                    )}
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
