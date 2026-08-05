"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, MapPin } from "lucide-react";
import type { SiteTemplateSummary } from "@/app/templates/types";
import type { VendorListItem } from "@/app/marketplace/types";

export function LivePreviews({
  templates,
  vendors,
}: {
  templates: SiteTemplateSummary[];
  vendors: VendorListItem[];
}) {
  return (
    <>
      <section className="bg-muted/40 px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left"
          >
            <div>
              <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
                Choose a wedding website template
              </h2>
              <p className="mt-2 text-muted-foreground">
                Preview real designs, then customize the colors and sections once you start planning.
              </p>
            </div>
            <Link
              href="/templates"
              className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary"
            >
              Browse all templates
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {templates.length === 0 ? (
            <p className="text-center text-muted-foreground">Templates are coming soon.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {templates.map((template, index) => (
                <motion.div
                  key={template.template_id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  whileHover={{ y: -6 }}
                >
                  <Link
                    href={`/templates/${template.template_id}`}
                    className="flex h-full flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div
                      className="flex h-32 items-center justify-center rounded-lg"
                      style={{ backgroundColor: template.default_theme.bg_color }}
                    >
                      <span
                        className="text-lg"
                        style={{
                          color: template.default_theme.accent_color,
                          fontFamily: template.default_theme.font_style,
                        }}
                      >
                        Aa
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium">{template.name}</h3>
                      <div className="flex shrink-0 -space-x-1">
                        {[
                          template.default_theme.bg_color,
                          template.default_theme.accent_color,
                          template.default_theme.text_color,
                        ].map((color, i) => (
                          <span
                            key={i}
                            className="size-4 rounded-full border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left"
          >
            <div>
              <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">Meet trusted vendors</h2>
              <p className="mt-2 text-muted-foreground">
                Photographers, venues, salons, and more — find vendors for your wedding.
              </p>
            </div>
            <Link
              href="/marketplace"
              className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary"
            >
              Browse the marketplace
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {vendors.length === 0 ? (
            <p className="text-center text-muted-foreground">Vendors are joining soon.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {vendors.map((vendor, index) => (
                <motion.div
                  key={vendor.vendor_id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  whileHover={{ y: -6 }}
                >
                  <Link
                    href={`/marketplace/${vendor.vendor_id}`}
                    className="flex h-full flex-col gap-3 rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <h3 className="font-medium">{vendor.business_name || "Unnamed vendor"}</h3>
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
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
