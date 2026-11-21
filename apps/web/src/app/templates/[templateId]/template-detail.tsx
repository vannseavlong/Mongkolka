"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageLoading, PageMessage } from "@/components/loading-state";
import { brandUrl } from "@/lib/brand-url";
import { useRouteParam } from "@/lib/route-param";
import { useApi } from "@/lib/use-api";
import type { SiteTemplatesResponse } from "../types";
import { TemplatePreview } from "../template-preview";

export function TemplateDetail() {
  const templateId = useRouteParam(["templates"]);
  const state = useApi<SiteTemplatesResponse>(templateId ? "/public/api/site-templates" : null);
  if (state.status === "loading") return <PageLoading />;
  if (state.status === "error") return <PageMessage title="Couldn't load this template" body="Please try again in a moment." />;
  const template = state.status === "ready" ? state.data.templates.find((t) => t.template_id === templateId) : undefined;
  if (!template) return <PageMessage title="Template not found" />;

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />

      <section className="flex flex-col gap-4 px-6 py-10 sm:px-12">
        <Link href="/templates" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" />
          Back to templates
        </Link>
        <h1 className="text-3xl font-medium tracking-tight">{template.name}</h1>
        <p className="text-muted-foreground">
          A live preview with sample content — pick this template when you build your own wedding website.
        </p>
      </section>

      <section className="px-6 pb-16 sm:px-12">
        <TemplatePreview template={template} brandUrl={brandUrl()} />
      </section>

      <SiteFooter />
    </main>
  );
}
