"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@mongkolka/ui/button";
import { DialogFooter } from "@mongkolka/ui/dialog";
import { Form } from "@mongkolka/ui/form";
import { ApiError } from "@/lib/api";
import type { WebsiteSection } from "../data/schema";
import { invitationToContent, invitationToForm, type InvitationFormValues } from "../lib/khmer-content";
import { hasInvitationContent, prefillInvitation } from "../lib/invitation-prefill";
import { saveContent } from "../lib/section-content-save";
import { useApiQuery } from "@/lib/use-api-query";
import type { CoupleProfile } from "@/features/profile/data/schema";
import { TextRow } from "./section-form-fields";

const name = z.string().max(120, "Max 120 characters");
const party = z.object({ nameKh: name, nameEn: name, fatherKh: name, fatherEn: name, motherKh: name, motherEn: name });
const schema = z.object({
  groom: party,
  bride: party,
  monogram: z.string().max(8, "Max 8 characters"),
  lunarKh: z.string().max(200, "Max 200 characters"),
  solarKh: z.string().max(200, "Max 200 characters"),
  startsAt: z.string(),
  greetingKh: z.string().max(600, "Max 600 characters"),
  greetingEn: z.string().max(600, "Max 600 characters"),
});

type PartyName = "groom" | "bride";

function PartyFields({ form, who, title }: { form: ReturnType<typeof useForm<InvitationFormValues>>; who: PartyName; title: string }) {
  return (
    <fieldset className="grid gap-3 rounded-md border p-3 sm:grid-cols-2">
      <legend className="px-1 text-sm font-medium">{title}</legend>
      <TextRow control={form.control} name={`${who}.nameKh`} label="Name (Khmer)" />
      <TextRow control={form.control} name={`${who}.nameEn`} label="Name (English)" />
      <TextRow control={form.control} name={`${who}.fatherKh`} label="Father (Khmer)" />
      <TextRow control={form.control} name={`${who}.fatherEn`} label="Father (English)" />
      <TextRow control={form.control} name={`${who}.motherKh`} label="Mother (Khmer)" />
      <TextRow control={form.control} name={`${who}.motherEn`} label="Mother (English)" />
    </fieldset>
  );
}

/** invitation — content: InvitationContent (see @mongkolka/templates). */
export function InvitationContentForm({ section, onSaved }: { section: WebsiteSection; onSaved: () => void }) {
  const form = useForm<InvitationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: invitationToForm(section.content),
  });

  // A new invitation starts from the profile (names, initials, wedding date and time). It only fills empty boxes, is not
  // saved until the couple presses Save, and runs once.
  const { data: profileData } = useApiQuery<{ profile: CoupleProfile }>("/couple/api/profile");
  const prefilled = useRef(false);
  const startedEmpty = !hasInvitationContent(invitationToForm(section.content));
  useEffect(() => {
    if (prefilled.current || !startedEmpty || !profileData?.profile) return;
    prefilled.current = true;
    form.reset(prefillInvitation(form.getValues(), profileData.profile));
  }, [form, profileData, startedEmpty]);

  async function onSubmit(values: InvitationFormValues) {
    try {
      await saveContent(section.section_id, { ...invitationToContent(values) });
      toast.success("Invitation updated");
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save invitation");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
        {startedEmpty && (
          <p className="m-0 text-sm text-muted-foreground">Names, initials and the event date are filled in from your profile. Check them, add the parents, then press Save.</p>
        )}
        <PartyFields form={form} who="groom" title="Groom's family (shown on the left)" />
        <PartyFields form={form} who="bride" title="Bride's family (shown on the right)" />
        <TextRow control={form.control} name="monogram" label="Monogram" placeholder="C&C" hint="Initials shown on the crest, up to 8 characters." />
        <TextRow control={form.control} name="lunarKh" label="Khmer lunar date" placeholder="ថ្ងៃពុធ ៣កើត ខែភទ្របទ ឆ្នាំរោង ឆស័ក ព.ស. ២៥៦៨" hint="Typed by you, shown as written." />
        <TextRow control={form.control} name="solarKh" label="Solar date line (Khmer)" placeholder="ត្រូវនឹងថ្ងៃទី២៩ ខែឧសភា ឆ្នាំ២០២៦" />
        <TextRow control={form.control} name="startsAt" type="datetime-local" label="Event start (Cambodia time)" hint="The countdown counts down to this moment." />
        <TextRow control={form.control} name="greetingKh" label="Greeting (Khmer)" rows={3} />
        <TextRow control={form.control} name="greetingEn" label="Greeting (English)" rows={3} />
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save invitation
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
