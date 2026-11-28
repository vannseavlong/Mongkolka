"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { defaultGuestbookIntro } from "@mongkolka/templates";
import { Button } from "@mongkolka/ui/button";
import { DialogFooter } from "@mongkolka/ui/dialog";
import { Form } from "@mongkolka/ui/form";
import { ApiError } from "@/lib/api";
import type { WebsiteSection } from "../data/schema";
import { asRecord, saveContent } from "../lib/section-content-save";
import { TextRow } from "./section-form-fields";

const intro = z.string().max(300, "Max 300 characters");
const schema = z.object({ introKh: intro, introEn: intro });
type Values = z.infer<typeof schema>;

const str = (v: unknown) => (typeof v === "string" ? v : "");

/** guestbook — content: { introKh?, introEn? }. Empty keeps the wording of the style in use (shown in grey). */
export function GuestbookContentForm({ section, styleId, onSaved }: { section: WebsiteSection; styleId: string; onSaved: () => void }) {
  const content = asRecord(section.content);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { introKh: str(content.introKh), introEn: str(content.introEn) },
  });

  async function onSubmit(v: Values) {
    try {
      await saveContent(section.section_id, { introKh: v.introKh.trim() || undefined, introEn: v.introEn.trim() || undefined });
      toast.success("Description updated");
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save the description");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">The line under the heading. Leave empty to keep the template&rsquo;s wording (shown in grey).</p>
        <TextRow control={form.control} name="introKh" label="Description (Khmer)" placeholder={defaultGuestbookIntro("kh", styleId)} rows={3} />
        <TextRow control={form.control} name="introEn" label="Description (English)" placeholder={defaultGuestbookIntro("en", styleId)} rows={3} />
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save description
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
