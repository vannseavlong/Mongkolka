"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@mongkolka/ui/card";
import { Main } from "@mongkolka/ui/layout/main";
import { ChevronDown } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@mongkolka/ui/collapsible";
import { useApiQuery } from "@/lib/use-api-query";
import type { CoupleProfile } from "@/features/profile/data/schema";
import { PublishPanel } from "./components/publish-panel";
import { TemplatePicker } from "./components/template-picker";
import { ThemeEditor } from "./components/theme-editor";
import { Workspace } from "./workspace/workspace";
import type { SectionComponent, SiteTemplate, Theme, WebsiteSection, WebsiteSettings } from "./data/schema";

export function Website() {
  const { data: catalogData, loading: catalogLoading } = useApiQuery<{ templates: SiteTemplate[]; components: SectionComponent[] }>(
    "/couple/api/website/catalog",
  );
  const { data: settingsData, error: settingsError, refetch: refetchSettings } = useApiQuery<{ settings: WebsiteSettings }>("/couple/api/website/settings");
  const { data: sectionsData } = useApiQuery<{ sections: WebsiteSection[] }>("/couple/api/website/sections");
  const { data: profileData } = useApiQuery<{ profile: CoupleProfile }>("/couple/api/profile");

  const settings = settingsData?.settings;
  const selectedTemplate =
    catalogData?.templates.find((t) => t.template_id === settings?.site_template_id) ?? null;

  // Unsaved color edits from ThemeEditor, kept here so WebsitePreview can
  // reflect them immediately instead of the couple having to Save and wait
  // for a refetch just to see whether a color works. Reset whenever the
  // persisted theme or the selected template changes, so a completed save
  // (or switching templates) hands control back to the real settings data —
  // done during render (React's "adjust state when a prop changes" pattern)
  // rather than in an effect, to avoid an extra commit-then-reset render pass.
  const [draftTheme, setDraftTheme] = useState<Theme | null>(null);
  const [prevTemplateId, setPrevTemplateId] = useState(selectedTemplate?.template_id ?? null);
  const [prevThemeOverride, setPrevThemeOverride] = useState(settings?.theme_override ?? null);
  if (
    (selectedTemplate?.template_id ?? null) !== prevTemplateId ||
    (settings?.theme_override ?? null) !== prevThemeOverride
  ) {
    setPrevTemplateId(selectedTemplate?.template_id ?? null);
    setPrevThemeOverride(settings?.theme_override ?? null);
    setDraftTheme(null);
  }

  return (
    <Main>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Website builder</h1>

        {settings && <PublishPanel settings={settings} />}

        <Collapsible defaultOpen={!selectedTemplate}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="group">
              Template and colors
              <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Template</CardTitle>
              </CardHeader>
              <CardContent>
                <TemplatePicker
                  templates={catalogData?.templates ?? []}
                  selectedTemplateId={settings ? settings.site_template_id : undefined}
                  templatesLoading={catalogLoading}
                  settingsError={settings ? null : settingsError}
                  onRetry={refetchSettings}
                />
              </CardContent>
            </Card>

            {selectedTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle>Colors</CardTitle>
                </CardHeader>
                <CardContent>
                  <ThemeEditor
                    theme={{ ...selectedTemplate.default_theme, ...(settings?.theme_override ?? {}) }}
                    onPreview={setDraftTheme}
                  />
                </CardContent>
              </Card>
            )}
          </CollapsibleContent>
        </Collapsible>

        {selectedTemplate ? (
          profileData &&
          sectionsData && (
            <Workspace
              sections={sectionsData.sections}
              components={catalogData?.components ?? []}
              catalogLoading={catalogLoading}
              template={selectedTemplate}
              themeOverride={draftTheme ?? settings?.theme_override ?? null}
              profile={profileData.profile}
            />
          )
        ) : (
          <div className="flex h-60 items-center justify-center rounded-lg border text-muted-foreground">
            Choose a template to start building
          </div>
        )}
      </div>
    </Main>
  );
}
