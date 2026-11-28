"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { defaultText } from "@mongkolka/templates";
import { Button } from "@mongkolka/ui/button";
import { DialogFooter } from "@mongkolka/ui/dialog";
import { Form } from "@mongkolka/ui/form";
import { Label } from "@mongkolka/ui/label";
import { Switch } from "@mongkolka/ui/switch";
import { ApiError } from "@/lib/api";
import type { WebsiteSection } from "../data/schema";
import { lettersToContent, lettersToForm, type LettersFormValues } from "../lib/khmer-content";
import { saveContent } from "../lib/section-content-save";
import { TextRow } from "./section-form-fields";

const builtIn = (key: "Thanks" | "Apology", language: "en" | "kh") => defaultText(`covenant.letters.default${key}`, language);

const letter = z.string().max(3000, "Max 3000 characters");
const note = z.string().max(200, "Max 200 characters");
const schema = z.object({ gratitudeKh: letter, gratitudeEn: letter, apologyKh: letter, apologyEn: letter, noteKh: note, noteEn: note, hideNote: z.boolean() });

/** letters — content: LettersContent (see @mongkolka/templates). */
export function LettersContentForm({ section, onSaved }: { section: WebsiteSection; onSaved: () => void }) {
  const form = useForm<LettersFormValues>({
    resolver: zodResolver(schema),
    defaultValues: lettersToForm(section.content),
  });

  async function onSubmit(values: LettersFormValues) {
    try {
      await saveContent(section.section_id, { ...lettersToContent(values) });
      toast.success("Letters updated");
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save letters");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
        <p className="text-sm text-muted-foreground">Leave a letter empty to show the wording in grey.</p>
        <TextRow control={form.control} name="gratitudeKh" placeholder={builtIn("Thanks", "kh")} label="Gratitude letter (Khmer)" rows={5} />
        <TextRow control={form.control} name="gratitudeEn" placeholder={builtIn("Thanks", "en")} label="Gratitude letter (English)" rows={5} />
        <TextRow control={form.control} name="apologyKh" placeholder={builtIn("Apology", "kh")} label="Apology note (Khmer)" rows={4} hint="For guests who did not get a printed invitation." />
        <TextRow control={form.control} name="apologyEn" placeholder={builtIn("Apology", "en")} label="Apology note (English)" rows={4} />
        <TextRow control={form.control} name="noteKh" label="Closing note (Khmer)" placeholder={defaultText("covenant.letters.defaultNote", "kh")} />
        <TextRow control={form.control} name="noteEn" label="Closing note (English)" placeholder={defaultText("covenant.letters.defaultNote", "en")} />
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="letters-hide-note">Hide the closing note</Label>
          <Switch id="letters-hide-note" checked={form.watch("hideNote")} onCheckedChange={(on) => form.setValue("hideNote", on, { shouldDirty: true })} />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save letters
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
