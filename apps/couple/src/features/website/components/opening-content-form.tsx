"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@mongkolka/ui/button";
import { DialogFooter } from "@mongkolka/ui/dialog";
import { Form } from "@mongkolka/ui/form";
import { ApiError } from "@/lib/api";
import { useApiQuery } from "@/lib/use-api-query";
import type { CoupleProfile } from "@/features/profile/data/schema";
import type { WebsiteSection } from "../data/schema";
import { OPENING_DEFAULTS, OPENING_LIMITS, openingToContent, openingToForm, type OpeningFormValues } from "../lib/opening-content";
import { saveContent } from "../lib/section-content-save";
import { TextRow } from "./section-form-fields";

const field = (max: number) => z.string().max(max, `Max ${max} characters`);
const schema = z.object({
  name1Kh: field(OPENING_LIMITS.name),
  name1En: field(OPENING_LIMITS.name),
  name2Kh: field(OPENING_LIMITS.name),
  name2En: field(OPENING_LIMITS.name),
  date: z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/, "Pick a date"),
  time: field(OPENING_LIMITS.time),
  venue: field(OPENING_LIMITS.venue),
  blessingKh: field(OPENING_LIMITS.blessing),
  blessingEn: field(OPENING_LIMITS.blessing),
  inviteKh: field(OPENING_LIMITS.invite),
  inviteEn: field(OPENING_LIMITS.invite),
  titleKh: field(OPENING_LIMITS.title),
  titleEn: field(OPENING_LIMITS.title),
  openKh: field(OPENING_LIMITS.open),
  openEn: field(OPENING_LIMITS.open),
});

/** opening — content: OpeningContent (see @mongkolka/templates). Used by the Covenant opening; other openings ignore it. */
export function OpeningContentForm({ section, onSaved }: { section: WebsiteSection; onSaved: () => void }) {
  // Empty event fields fall back to the profile, so its values are the placeholders.
  const { data: profileData } = useApiQuery<{ profile: CoupleProfile }>("/couple/api/profile");
  const profile = profileData?.profile;
  const form = useForm<OpeningFormValues>({ resolver: zodResolver(schema), defaultValues: openingToForm(section.content) });

  async function onSubmit(values: OpeningFormValues) {
    try {
      await saveContent(section.section_id, { ...openingToContent(values) });
      toast.success("Opening updated");
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save opening");
    }
  }

  const row = (name: keyof typeof OPENING_DEFAULTS, label: string, rows?: number) => (
    <TextRow control={form.control} name={name} label={label} placeholder={OPENING_DEFAULTS[name]} rows={rows} />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Everything the opening and the cover show is typed here. Leave a field empty to use your profile (names, date, time, venue) or the
          template&apos;s own wording (shown in grey). The guest sees the language they are reading.
        </p>
        <fieldset className="grid gap-3 rounded-md border p-3 sm:grid-cols-2">
          <legend className="px-1 text-sm font-medium">Couple and event</legend>
          <TextRow control={form.control} name="name1Kh" label="First name (Khmer)" placeholder={profile?.partner1_name ?? ""} />
          <TextRow control={form.control} name="name1En" label="First name (English)" placeholder={profile?.partner1_name ?? ""} />
          <TextRow control={form.control} name="name2Kh" label="Second name (Khmer)" placeholder={profile?.partner2_name ?? ""} />
          <TextRow control={form.control} name="name2En" label="Second name (English)" placeholder={profile?.partner2_name ?? ""} />
          <TextRow control={form.control} name="date" type="date" label="Wedding date" />
          <TextRow control={form.control} name="time" label="Time" placeholder={profile?.ceremony_time ?? "5:00 PM"} />
          <div className="sm:col-span-2">
            <TextRow control={form.control} name="venue" label="Place" placeholder={profile?.ceremony_venue ?? "Venue and city"} />
          </div>
        </fieldset>
        <fieldset className="flex flex-col gap-3 rounded-md border p-3">
          <legend className="px-1 text-sm font-medium">ខ្មែរ · Khmer</legend>
          {row("blessingKh", "Blessing", 3)}
          {row("inviteKh", "Invitation line")}
          {row("titleKh", "Title")}
          {row("openKh", "Open button")}
        </fieldset>
        <fieldset className="flex flex-col gap-3 rounded-md border p-3">
          <legend className="px-1 text-sm font-medium">English</legend>
          {row("blessingEn", "Blessing", 3)}
          {row("inviteEn", "Invitation line")}
          {row("titleEn", "Title")}
          {row("openEn", "Open button")}
        </fieldset>
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save opening
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
