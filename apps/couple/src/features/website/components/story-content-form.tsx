"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@mongkolka/ui/button";
import { DialogFooter } from "@mongkolka/ui/dialog";
import { Form } from "@mongkolka/ui/form";
import { ApiError } from "@/lib/api";
import type { WebsiteSection } from "../data/schema";
import type { PreviewProfile } from "../lib/build-content";
import { asRecord, saveContent } from "../lib/section-content-save";
import { TextRow } from "./section-form-fields";

const MAX = 5000;
const schema = z.object({ loveStoryKh: z.string().max(MAX, `Max ${MAX} characters`), loveStory: z.string().max(MAX, `Max ${MAX} characters`) });
type StoryFormValues = z.infer<typeof schema>;

/** story — content: { loveStory, loveStoryKh }. A story already in your profile starts in the English box. */
export function StoryContentForm({ section, profile, onSaved }: { section: WebsiteSection; profile: PreviewProfile; onSaved: () => void }) {
  const stored = asRecord(section.content);
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const form = useForm<StoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { loveStoryKh: str(stored.loveStoryKh), loveStory: str(stored.loveStory) || (profile.love_story ?? "") },
  });

  async function onSubmit(values: StoryFormValues) {
    try {
      await saveContent(section.section_id, { loveStory: values.loveStory.trim() || undefined, loveStoryKh: values.loveStoryKh.trim() || undefined });
      toast.success("Story updated");
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save the story");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <fieldset className="flex flex-col gap-3 rounded-md border p-3">
          <legend className="px-1 text-sm font-medium">ខ្មែរ · Khmer</legend>
          <TextRow control={form.control} name="loveStoryKh" label="Our story" rows={9} placeholder="របៀបដែលយើងបានជួបគ្នា ការស្នើសុំ និងអត្ថន័យនៃថ្ងៃនេះ…" />
        </fieldset>
        <fieldset className="flex flex-col gap-3 rounded-md border p-3">
          <legend className="px-1 text-sm font-medium">English</legend>
          <TextRow control={form.control} name="loveStory" label="Our story" rows={9} placeholder="How you met, the proposal, what this day means…" />
        </fieldset>
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save story
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
