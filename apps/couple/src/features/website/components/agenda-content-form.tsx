"use client";

import { useFieldArray, useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { DialogFooter } from "@mongkolka/ui/dialog";
import { Form } from "@mongkolka/ui/form";
import { AGENDA_ICONS } from "@mongkolka/templates";
import { ApiError } from "@/lib/api";
import type { WebsiteSection } from "../data/schema";
import { AGENDA_ICON_LABELS, agendaToContent, agendaToForm, type AgendaFormValues } from "../lib/khmer-content";
import { saveContent } from "../lib/section-content-save";
import { TextRow } from "./section-form-fields";

const MAX_DAYS = 7;
const MAX_ITEMS = 20;

const schema = z.object({
  days: z
    .array(
      z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
        items: z.array(
          z.object({
            time: z.string().trim().min(1, "Time is required").max(20, "Max 20 characters"),
            titleKh: z.string().max(120, "Max 120 characters"),
            titleEn: z.string().max(120, "Max 120 characters"),
            icon: z.string(),
          }),
        ),
      }),
    )
    .max(MAX_DAYS),
});

function DayItems({ control, day, register }: { control: Control<AgendaFormValues>; day: number; register: ReturnType<typeof useForm<AgendaFormValues>>["register"] }) {
  const { fields, append, remove } = useFieldArray({ control, name: `days.${day}.items` });
  return (
    <div className="flex flex-col gap-3">
      {fields.length === 0 && <p className="text-sm text-muted-foreground">No items for this day yet.</p>}
      {fields.map((field, i) => (
        <div key={field.id} className="grid gap-2 rounded-md border p-2 sm:grid-cols-[7rem_1fr_1fr_auto]">
          <TextRow control={control} name={`days.${day}.items.${i}.time`} label="Time" placeholder="07:00" />
          <TextRow control={control} name={`days.${day}.items.${i}.titleKh`} label="Title (Khmer)" />
          <TextRow control={control} name={`days.${day}.items.${i}.titleEn`} label="Title (English)" />
          <div className="flex items-end gap-1">
            <label className="flex flex-col gap-1 text-sm font-medium">
              Icon
              <select className="h-9 rounded-md border bg-background px-2 text-sm font-normal" {...register(`days.${day}.items.${i}.icon`)}>
                <option value="">None</option>
                {AGENDA_ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {AGENDA_ICON_LABELS[icon]}
                  </option>
                ))}
              </select>
            </label>
            <Button type="button" size="icon" variant="ghost" aria-label="Remove item" onClick={() => remove(i)}>
              <Trash2 className="size-3" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        disabled={fields.length >= MAX_ITEMS}
        onClick={() => append({ time: "", titleKh: "", titleEn: "", icon: "" })}
      >
        <Plus className="size-3" /> Add item
      </Button>
    </div>
  );
}

/** agenda — content: AgendaContent (see @mongkolka/templates): days, each with timed items. */
export function AgendaContentForm({ section, onSaved }: { section: WebsiteSection; onSaved: () => void }) {
  const form = useForm<AgendaFormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: agendaToForm(section.content),
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "days" });

  async function onSubmit(values: AgendaFormValues) {
    try {
      await saveContent(section.section_id, { ...agendaToContent(values) });
      toast.success("Agenda updated");
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save agenda");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
        {fields.length === 0 && <p className="text-sm text-muted-foreground">No days yet. Add the first day of your programme.</p>}
        {fields.map((field, d) => (
          <fieldset key={field.id} className="flex flex-col gap-3 rounded-md border p-3">
            <legend className="px-1 text-sm font-medium">Day {d + 1}</legend>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <TextRow control={form.control} name={`days.${d}.date`} label="Date" type="date" />
              </div>
              <Button type="button" size="icon" variant="ghost" aria-label="Remove day" onClick={() => remove(d)}>
                <Trash2 className="size-3" />
              </Button>
            </div>
            <DayItems control={form.control} day={d} register={form.register} />
          </fieldset>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          disabled={fields.length >= MAX_DAYS}
          onClick={() => append({ date: "", items: [] })}
        >
          <Plus className="size-3" /> Add day
        </Button>
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save agenda
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
