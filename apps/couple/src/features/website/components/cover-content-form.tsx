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

const MAX = 120;
const schema = z.object({ taglineKh: z.string().max(MAX, `Max ${MAX} characters`), taglineEn: z.string().max(MAX, `Max ${MAX} characters`) });
type CoverFormValues = z.infer<typeof schema>;

/** The built-in line, shown as the placeholder so an empty box is clearly "use the template's wording". */
const DEFAULTS: CoverFormValues = { taglineKh: "ដោយព្រះគុណ ពីរនាក់ក្លាយជាមួយ", taglineEn: "By grace, two become one" };

/** cover — content: CoverContent (see @mongkolka/templates). The names and date come from the Opening section. */
export function CoverContentForm({ section, onSaved }: { section: WebsiteSection; onSaved: () => void }) {
  const stored = asRecord(section.content);
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const form = useForm<CoverFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { taglineKh: str(stored.taglineKh), taglineEn: str(stored.taglineEn) },
  });

  async function onSubmit(values: CoverFormValues) {
    try {
      await saveContent(section.section_id, { taglineKh: values.taglineKh.trim() || undefined, taglineEn: values.taglineEn.trim() || undefined });
      toast.success("Cover updated");
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save the cover");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">The line above the names. Leave it empty to keep the template&apos;s own line (shown in grey). Names and date come from the Opening section.</p>
        <TextRow control={form.control} name="taglineKh" label="Sub-title (Khmer)" placeholder={DEFAULTS.taglineKh} />
        <TextRow control={form.control} name="taglineEn" label="Sub-title (English)" placeholder={DEFAULTS.taglineEn} />
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save cover
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
