"use client";

import { useState } from "react";
import { useApiQuery } from "@/lib/use-api-query";
import type { CoupleProfile } from "@/features/profile/data/schema";
import { BuilderToolbar } from "./components/builder-toolbar";
import { TemplateDialog } from "./components/template-dialog";
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

  // `null` = follow the state (open while no template is chosen); a boolean
  // is the couple's explicit choice.
  const [templateDialog, setTemplateDialog] = useState<boolean | null>(null);
  const templateDialogOpen = templateDialog ?? (!!settings && !selectedTemplate);

  // Unsaved color edits from ThemeEditor, kept here so the preview can
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
    // Fills the screen under the fixed app header; the page itself never
    // scrolls, each panel scrolls on its own.
    <div className="flex h-[calc(100svh-4rem-var(--assist-banner,0px))] min-h-0 flex-col overflow-hidden border-t">
      <BuilderToolbar settings={settings} />

      <div className="flex min-h-0 flex-1 flex-col">
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
              onChooseTemplate={() => setTemplateDialog(true)}
              defaultLanguage={settings?.default_language ?? "kh"}
              colors={
                <ThemeEditor
                  theme={{ ...selectedTemplate.default_theme, ...(settings?.theme_override ?? {}) }}
                  templateDefault={selectedTemplate.default_theme}
                  onPreview={setDraftTheme}
                />
              }
            />
          )
        ) : (
          <div className="m-4 flex flex-1 items-center justify-center rounded-lg border text-muted-foreground">
            Choose a template to start building
          </div>
        )}
      </div>

      <TemplateDialog
        open={templateDialogOpen}
        onOpenChange={setTemplateDialog}
        templates={catalogData?.templates ?? []}
        selectedTemplateId={settings ? settings.site_template_id : undefined}
        templatesLoading={catalogLoading}
        settingsError={settings ? null : settingsError}
        onRetry={refetchSettings}
      />
    </div>
  );
}
