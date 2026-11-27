"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageLoading, PageMessage } from "@/components/loading-state";
import { useApi } from "@/lib/use-api";
import { TemplateThumb } from "./template-thumb";
import type { SiteTemplatesResponse } from "./types";

// Full-page preview of a template at /templates/preview/<slug>; templates without a slug fall back
// to the framed preview at /templates/<id>.
function previewHref(template: { template_id: string; slug?: string }) {
  return template.slug ? `/templates/preview/${template.slug}` : `/templates/${template.template_id}`;
}

export default function TemplatesPage() {
  const state = useApi<SiteTemplatesResponse>("/public/api/site-templates");
  if (state.status === "loading") return <PageLoading />;
  if (state.status !== "ready") return <PageMessage title="Couldn't load templates" body="Please try again in a moment." />;
  const templates = state.data.templates ?? [];

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />

      <section className="flex flex-col gap-2 px-6 py-10 sm:px-12">
        <h1 className="text-3xl font-medium tracking-tight">Wedding website templates</h1>
        <p className="text-muted-foreground">
          Pick a design for your wedding website, then customize the colors and sections once you start planning.
        </p>
      </section>

      <section className="flex flex-col gap-6 px-6 pb-16 sm:px-12">
        {templates.length === 0 ? (
          <p className="text-muted-foreground">No templates available yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Link
                key={template.template_id}
                href={previewHref(template)}
                className="flex flex-col gap-4 rounded-xl border p-6 transition-colors hover:bg-accent"
              >
                <TemplateThumb template={template} className="rounded-lg border" />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 flex-col">
                    <h2 className="font-medium">{template.name}</h2>
                    {template.description && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">{template.description}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 -space-x-1">
                    {[template.default_theme.bg_color, template.default_theme.accent_color, template.default_theme.text_color].map(
                      (color, i) => (
                        <span key={i} className="size-4 rounded-full border" style={{ backgroundColor: color }} />
                      ),
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
