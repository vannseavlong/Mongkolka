import type { PartialTheme, SectionKey, Theme } from "@mongkolka/templates";

export interface PublicSiteResponse {
  couple: {
    partner1_name: string | null;
    partner2_name: string | null;
    wedding_date: string | null;
    slug: string;
  };
  profile: {
    profile_id: string;
    love_story: string | null;
    cover_photo_url: string | null;
    ceremony_time: string | null;
    ceremony_venue: string | null;
    ceremony_address: string | null;
    reception_time: string | null;
    reception_venue: string | null;
    reception_address: string | null;
    dress_code: string | null;
    site_template_id: string | null;
    theme_override: PartialTheme | null;
  } | null;
  template: {
    template_id: string;
    name: string;
    default_theme: Theme;
    default_components: Partial<Record<SectionKey, string>>;
    status: string;
  } | null;
  sections: {
    section_id: string;
    section_key: SectionKey;
    component_id: string | null;
    color_override: PartialTheme | null;
    display_order: number;
    enabled: boolean;
    content: unknown;
  }[];
}
