/**
 * Seeds (or removes) a clearly-tagged mock couple for end-to-end testing.
 *
 *   pnpm --filter api exec tsx scripts/seed-mock-couple.ts          # create/refresh
 *   pnpm --filter api exec tsx scripts/seed-mock-couple.ts --clean  # remove rows
 *
 * Writes REAL rows to the admin sheet and creates a real spreadsheet in the
 * connected Drive (the Drive file is not deleted by --clean; its id is printed).
 * Everything is tagged: slug `mock-demo`, email `mock.couple@example.test`.
 */
import "dotenv/config";
import { adminContext } from "../src/config/database.js";
import { CouplesService } from "../src/modules/couples/couples.service.js";
import { UsersService } from "../src/modules/users/users.service.js";
import { UsersModel } from "../src/modules/users/users.model.js";
import { CoupleProfileService } from "../src/modules/couple-profile/couple-profile.service.js";
import { CoupleWebsiteService } from "../src/modules/couple-website/couple-website.service.js";

const EMAIL = "mock.couple@example.test";
const PASSWORD = "MockCouple#2026";
const SLUG = "mock-demo";
const TEMPLATE_ID = process.argv.includes("--template")
  ? process.argv[process.argv.indexOf("--template") + 1]
  : "ink_and_gold";

const photo = (seed: string, w = 800, h = 1000) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

async function clean() {
  const user = await UsersModel.findByEmail(EMAIL);
  const ctx = adminContext();
  const couple = await ctx.table("couples").findOne({ where: { slug: SLUG } });
  if (couple) {
    const members = await ctx.table("couple_members").findMany({ where: { couple_id: couple.couple_id as string } });
    for (const m of members) await ctx.table("couple_members").delete({ where: { member_id: m.member_id as string } });
    await ctx.table("couples").delete({ where: { couple_id: couple.couple_id as string } });
    console.log(`removed couple ${couple.couple_id}; orphaned sheet: ${couple.actor_sheet_id}`);
  }
  if (user) {
    await ctx.table("credentials").delete({ where: { user_id: user.user_id as string } }).catch(() => undefined);
    await UsersModel.delete(user.user_id as string);
    console.log(`removed user ${user.user_id}`);
  }
}

async function seed() {
  let user = await UsersModel.findByEmail(EMAIL);
  if (!user) {
    const res = await CouplesService.registerCouple({
      email: EMAIL,
      password: PASSWORD,
      partner1Name: "Sokha",
      partner2Name: "Dara",
      partner2Email: "mock.partner2@example.test",
      weddingDate: "2027-01-23",
    });
    if (!res.ok) throw new Error(res.error);
    await UsersService.approve(res.userId, "mock-seed");
    user = await UsersModel.findByEmail(EMAIL);
  }
  if (!user?.actor_sheet_id) throw new Error("mock user has no actor_sheet_id");
  const actorSheetId = user.actor_sheet_id as string;

  const member = await adminContext().table("couple_members").findOne({ where: { user_id: user.user_id as string } });
  const coupleId = member!.couple_id as string;

  await CoupleWebsiteService.updateSlug(coupleId, SLUG).catch((e: Error) => {
    if (!/already taken/.test(e.message)) throw e;
  });

  await CoupleProfileService.update(coupleId, actorSheetId, {
    partner1_name: "Sokha",
    partner2_name: "Dara",
    wedding_date: "2027-01-23",
    cover_photo_url: photo("mock-cover", 900, 1200),
    love_story:
      "We met on a rainy Tuesday in Phnom Penh, both ducking into the same tiny coffee shop on Street 240. Sokha was arguing with the barista about oat milk; Dara laughed so loudly that the whole room turned around.\n\nThree years, two apartments and one very opinionated cat later, Dara proposed at the Silver Pagoda at golden hour, ring box in one hand and a slightly melted ice cream in the other.\n\nNow we get to do the best part — celebrate it with everyone who made us who we are.",
    ceremony_time: "9:00 AM",
    ceremony_venue: "Wat Ounalom Pagoda",
    ceremony_address: "Samdach Preah Sihanouk Blvd, Phnom Penh",
    reception_time: "6:00 PM",
    reception_venue: "Raffles Le Royal Ballroom",
    reception_address: "92 Rukhak Vithei Daun Penh, Phnom Penh",
    dress_code: "Black tie · jewel tones welcome",
  });

  await CoupleWebsiteService.selectTemplate(actorSheetId, TEMPLATE_ID);
  const sections = await CoupleWebsiteService.listSections(actorSheetId);
  const byKey = new Map(sections.map((s) => [s.section_key as string, s]));
  const content: Record<string, unknown> = {
    gallery: { photos: ["a", "b", "c", "d", "e", "f"].map((k) => photo(`mock-${k}`, 800, 1000)) },
    rsvp: { customMessage: "We can't wait to celebrate with you.", deadline: "December 20, 2026" },
    registry: {
      links: [
        { label: "Honeymoon fund", url: "https://example.test/honeymoon" },
        { label: "Home & kitchen", url: "https://example.test/home" },
        { label: "Plant a tree in our name", url: "https://example.test/trees" },
      ],
    },
    timeline: {
      chapters: [
        { year: "2023", title: "The coffee shop", text: "Two strangers, one loud laugh, and a cup of oat-milk latte neither of us wanted to finish." },
        { year: "2024", title: "Moving in", text: "Two apartments became one, and a cat named Num decided who was really in charge." },
        { year: "2026", title: "The proposal", text: "A pagoda at golden hour, a melting ice cream, and the easiest yes of our lives." },
      ],
    },
    music: { playlistUrl: "https://open.spotify.com/playlist/37i9dQZF1DX50QitC6Oqtn" },
  };
  for (const [key, data] of Object.entries(content)) {
    const section = byKey.get(key);
    if (section) await CoupleWebsiteService.updateSection(actorSheetId, section.section_id as string, { content: data });
  }

  await CoupleWebsiteService.publish(coupleId, actorSheetId);
  console.log(JSON.stringify({ email: EMAIL, password: PASSWORD, slug: SLUG, coupleId, actorSheetId, template: TEMPLATE_ID }, null, 2));
}

(process.argv.includes("--clean") ? clean() : seed())
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
