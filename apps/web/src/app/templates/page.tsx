import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { fetchJson } from "@/lib/api";
import type { SiteTemplatesResponse } from "./types";

// Subdomain previews need ROOT_DOMAIN (wildcard DNS). Without it (plain local
// dev) cards fall back to the /templates/[id] path preview. Deliberately no
// "localhost:3000" default here (unlike proxy.ts, which defaults so local hosts
// parse): an unset value must mean "no subdomain links".
const ROOT_DOMAIN = process.env.ROOT_DOMAIN;

function previewHref(template: { template_id: string; slug?: string }) {
  if (!ROOT_DOMAIN || !template.slug) return `/templates/${template.template_id}`;
  const protocol = ROOT_DOMAIN.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${template.slug}.${ROOT_DOMAIN}`;
}

export default async function TemplatesPage() {
  const data = await fetchJson<SiteTemplatesResponse>("/public/api/site-templates");
  const templates = data?.templates ?? [];

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
