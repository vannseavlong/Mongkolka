"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@mongkolka/ui/card";
import { Main } from "@mongkolka/ui/layout/main";
import { useApiQuery } from "@/lib/use-api-query";
import type { CoupleProfile } from "@/features/profile/data/schema";
import { PublishPanel } from "./components/publish-panel";
import { SectionsList } from "./components/sections-list";
import { TemplatePicker } from "./components/template-picker";
import { ThemeEditor } from "./components/theme-editor";
import { WebsitePreview } from "./components/website-preview";
import type { SectionComponent, SiteTemplate, WebsiteSection, WebsiteSettings } from "./data/schema";

export function Website() {
  const { data: catalogData } = useApiQuery<{ templates: SiteTemplate[]; components: SectionComponent[] }>(
    "/couple/api/website/catalog",
  );
  const { data: settingsData } = useApiQuery<{ settings: WebsiteSettings }>("/couple/api/website/settings");
  const { data: sectionsData } = useApiQuery<{ sections: WebsiteSection[] }>("/couple/api/website/sections");
  const { data: profileData } = useApiQuery<{ profile: CoupleProfile }>("/couple/api/profile");

  const settings = settingsData?.settings;
  const selectedTemplate =
    catalogData?.templates.find((t) => t.template_id === settings?.site_template_id) ?? null;

  return (
    <Main>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Website builder</h1>

        {settings && <PublishPanel settings={settings} />}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Template</CardTitle>
              </CardHeader>
              <CardContent>
                <TemplatePicker
                  templates={catalogData?.templates ?? []}
                  selectedTemplateId={settings?.site_template_id ?? null}
                />
              </CardContent>
            </Card>

            {selectedTemplate && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Colors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ThemeEditor
                      theme={{ ...selectedTemplate.default_theme, ...(settings?.theme_override ?? {}) }}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {profileData && (
                      <SectionsList
                        sections={sectionsData?.sections ?? []}
                        components={catalogData?.components ?? []}
                        template={selectedTemplate}
                        themeOverride={settings?.theme_override ?? null}
                        profile={profileData.profile}
                      />
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="lg:sticky lg:top-20 lg:self-start">
            {profileData && (
              <WebsitePreview
                template={selectedTemplate}
                sections={sectionsData?.sections ?? []}
                themeOverride={settings?.theme_override ?? null}
                profile={profileData.profile}
              />
            )}
          </div>
        </div>
      </div>
    </Main>
  );
}
