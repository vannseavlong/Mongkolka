import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { fetchJson } from "@/lib/api";
import type { SiteTemplatesResponse } from "../types";
import { TemplatePreview } from "./template-preview";

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const data = await fetchJson<SiteTemplatesResponse>("/public/api/site-templates");
  const template = data?.templates.find((t) => t.template_id === templateId);
  if (!template) notFound();

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
        <TemplatePreview template={template} />
      </section>

      <SiteFooter />
    </main>
  );
}
