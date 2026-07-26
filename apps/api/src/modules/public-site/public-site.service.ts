import { randomUUID } from "node:crypto";
import { PublicSiteModel } from "./public-site.model.js";

export interface RsvpSubmissionInput {
  name: string;
  attending: boolean;
  plusOne: boolean;
  message?: string;
}

async function findPublishedCoupleBySlug(slug: string) {
  const couple = await PublicSiteModel.findCoupleBySlug(slug);
  if (!couple || couple.status !== "active" || couple.website_status !== "published") {
    return null;
  }
  return couple;
}

export const PublicSiteService = {
  async getSite(slug: string) {
    const couple = await findPublishedCoupleBySlug(slug);
    if (!couple) return null;

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

  /** Returns `false` if the site isn't published (caller should 404), `true` on success. */
  async submitRsvp(slug: string, input: RsvpSubmissionInput) {
    const couple = await findPublishedCoupleBySlug(slug);
    if (!couple) return false;

    const actorSheetId = couple.actor_sheet_id as string;
    const status = input.attending ? "confirmed" : "declined";
    const data = {
      status,
      plus_one: input.plusOne,
      notes: input.message || undefined,
      confirmed_date: new Date().toISOString(),
    };

    const existing = await PublicSiteModel.findGuestByName(actorSheetId, input.name);
    if (existing) {
      await PublicSiteModel.updateGuest(actorSheetId, existing.guest_id as string, data);
    } else {
      await PublicSiteModel.createGuest(actorSheetId, {
        guest_id: randomUUID(),
        name: input.name,
        ...data,
      });
    }
    return true;
  },
};
