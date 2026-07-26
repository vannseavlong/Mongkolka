import { PublicSiteModel } from "./public-site.model.js";

export const PublicSiteService = {
  async getSite(slug: string) {
    const couple = await PublicSiteModel.findCoupleBySlug(slug);
    if (!couple || couple.status !== "active" || couple.website_status !== "published") {
      return null;
    }

    const actorSheetId = couple.actor_sheet_id as string;
    const [profile, sections] = await Promise.all([
      PublicSiteModel.findProfile(actorSheetId),
      PublicSiteModel.findSections(actorSheetId),
    ]);

    const template = profile?.site_template_id
      ? await PublicSiteModel.findTemplateById(profile.site_template_id as string)
      : null;

    return {
      couple: {
        partner1_name: couple.partner1_name ?? null,
        partner2_name: couple.partner2_name ?? null,
        wedding_date: couple.wedding_date ?? null,
        slug: couple.slug,
      },
      profile: profile ?? null,
      template: template ?? null,
      sections: sections.filter((s) => s.enabled),
    };
  },
};
