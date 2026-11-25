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
import { asRecord, saveContent } from "../lib/section-content-save";
import { TextRow } from "./section-form-fields";

const title = z.string().max(80, "Max 80 characters");
const body = z.string().max(600, "Max 600 characters");
const schema = z.object({ titleKh: title, titleEn: title, bodyKh: body, bodyEn: body });
type Values = z.infer<typeof schema>;
const FIELDS = ["titleKh", "titleEn", "bodyKh", "bodyEn"] as const;

/** The built-in note (shown when every field is empty), as grey hints so the couple sees what they get. */
const BUILT_IN = {
  titleKh: "សូមកុំយកគ្រឿងស្រវឹង",
  titleEn: "No alcohol, please",
  bodyKh: "ដោយគោរពតាមជំនឿគ្រីស្ទបរិស័ទ ពិធីមង្គលការរបស់យើងមិនមានភេសជ្ជៈមានជាតិអាល់កុលទេ។ សូមអរគុណដែលរីករាយ និងយោគយល់ជាមួយយើង។",
  bodyEn: "Out of respect for our Christian faith, no alcohol will be served at our wedding. Thank you for celebrating with us in joy and understanding.",
} as const;

const str = (v: unknown) => (typeof v === "string" ? v : "");

/** note — content: NoteContent (see @mongkolka/templates). Empty fields show the built-in "no alcohol" note. */
export function NoteContentForm({ section, onSaved }: { section: WebsiteSection; onSaved: () => void }) {
  const content = asRecord(section.content);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: Object.fromEntries(FIELDS.map((f) => [f, str(content[f])])) as Values,
  });

  async function onSubmit(values: Values) {
    try {
      await saveContent(section.section_id, Object.fromEntries(FIELDS.map((f) => [f, values[f].trim() || undefined])));
      toast.success("Note updated");
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save the note");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">A short message to your guests. Leave everything empty to keep the built-in &ldquo;no alcohol&rdquo; note (shown in grey).</p>
        <TextRow control={form.control} name="titleKh" label="Title (Khmer)" placeholder={BUILT_IN.titleKh} />
        <TextRow control={form.control} name="titleEn" label="Title (English)" placeholder={BUILT_IN.titleEn} />
        <TextRow control={form.control} name="bodyKh" label="Message (Khmer)" placeholder={BUILT_IN.bodyKh} rows={4} />
        <TextRow control={form.control} name="bodyEn" label="Message (English)" placeholder={BUILT_IN.bodyEn} rows={4} />
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save note
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
