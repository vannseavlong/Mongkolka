"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ImagePlus, Layers, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@mongkolka/ui/button";
import { DialogFooter } from "@mongkolka/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@mongkolka/ui/form";
import { Input } from "@mongkolka/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mongkolka/ui/select";
import { ApiError } from "@/lib/api";
import { asRecord, saveContent } from "../lib/section-content-save";
import type { WebsiteSection } from "../data/schema";
import { AssetPicker } from "./asset-picker";
import { newUrlsOnly } from "./asset-library-logic";
import { HOME_PHOTOS_MAX, HOME_PHOTOS_MIN, STACK_LAYOUTS, isPhotoLink, isWholeCount, photoName, stackFromForm, stackToForm } from "../lib/gallery-form-logic";

// gallery — content: { photos: string[], maxPhotos?: number, stack?: { layout, count? }[] }

const gallerySchema = z.object({
  photos: z.array(z.object({ url: z.string().min(1, "Photo URL is required") })),
  maxPhotos: z
    .string()
    .refine((v) => v.trim() === "" || (/^\d+$/.test(v.trim()) && Number(v) >= HOME_PHOTOS_MIN && Number(v) <= HOME_PHOTOS_MAX), `Enter a whole number from ${HOME_PHOTOS_MIN} to ${HOME_PHOTOS_MAX}, or leave it empty`),
  stack: z
    .array(z.object({ layout: z.string(), count: z.string().refine(isWholeCount, "Whole number, or empty for the rest") }))
    .superRefine((rows, ctx) => {
      // A blank count means "the rest", so only the last layout may leave it blank.
      rows.forEach((r, i) => {
        if (i < rows.length - 1 && r.count.trim() === "") ctx.addIssue({ code: "custom", path: [i, "count"], message: "How many photos?" });
      });
    }),
});
type GalleryFormValues = z.infer<typeof gallerySchema>;

export function GalleryContentForm({ section, onSaved }: { section: WebsiteSection; onSaved: () => void }) {
  const content = asRecord(section.content);
  const initialPhotos = Array.isArray(content.photos) ? content.photos : [];
  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      photos: initialPhotos.filter((p): p is string => typeof p === "string").map((url) => ({ url })),
      maxPhotos: typeof content.maxPhotos === "number" ? String(content.maxPhotos) : "",
      stack: stackToForm(content.stack),
    },
  });
  const { fields, append, remove, move } = useFieldArray({ control: form.control, name: "photos" });
  const stack = useFieldArray({ control: form.control, name: "stack" });
  const [pickerOpen, setPickerOpen] = useState(false);
  const [urlDraft, setUrlDraft] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const pickerButtonRef = useRef<HTMLButtonElement>(null);

  async function onSubmit(values: GalleryFormValues) {
    // A link typed but not yet added would be lost on save, so add it first.
    const pending = (urlDraft ?? "").trim();
    if (pending && !values.photos.some((p) => p.url === pending)) values = { ...values, photos: [...values.photos, { url: pending }] };
    try {
      const max = values.maxPhotos.trim();
      await saveContent(section.section_id, { ...content, photos: values.photos.map((p) => p.url), maxPhotos: max ? Number(max) : undefined, stack: stackFromForm(values.stack) });
      toast.success("Gallery updated");
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save gallery");
    }
  }

  function addUrl() {
    const url = (urlDraft ?? "").trim();
    if (!isPhotoLink(url)) {
      setUrlError("Enter a link starting with https:// or a path starting with /");
      return;
    }
    if (!form.getValues("photos").some((p) => p.url === url)) append({ url });
    setUrlDraft(null);
    setUrlError(null);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {fields.length === 0 && <p className="text-sm text-muted-foreground">No photos yet.</p>}
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- user photo from the API or a link */}
              <img src={field.url} alt="" loading="lazy" className="size-10 shrink-0 rounded-md bg-muted object-cover" />
              <span className="min-w-0 flex-1 truncate text-sm" title={field.url}>
                {photoName(field.url)}
              </span>
              <Button type="button" size="icon" variant="ghost" aria-label="Move up" disabled={index === 0} onClick={() => move(index, index - 1)}>
                <ArrowUp className="size-3" />
              </Button>
              <Button type="button" size="icon" variant="ghost" aria-label="Move down" disabled={index === fields.length - 1} onClick={() => move(index, index + 1)}>
                <ArrowDown className="size-3" />
              </Button>
              <Button type="button" size="icon" variant="ghost" aria-label="Remove photo" onClick={() => remove(index)}>
                <Trash2 className="size-3" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button ref={pickerButtonRef} type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
            <ImagePlus className="size-3" /> Choose from library
          </Button>
          {urlDraft === null && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setUrlDraft("")}>
              <Plus className="size-3" /> Add by link
            </Button>
          )}
        </div>
        {urlDraft !== null && (
          <div className="flex gap-2">
            <Input autoFocus placeholder="https://…" value={urlDraft} onChange={(e) => (setUrlDraft(e.target.value), setUrlError(null))} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())} />
            <Button type="button" size="sm" onClick={addUrl}>
              Add
            </Button>
          </div>
        )}
        {urlError && <p className="text-sm text-destructive">{urlError}</p>}
        <AssetPicker
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          title="Add photos to gallery"
          returnFocusRef={pickerButtonRef}
          onConfirm={(urls) => {
            const have = form.getValues("photos").map((p) => p.url);
            newUrlsOnly(have, urls).forEach((url) => append({ url }));
          }}
        />

        <div className="flex flex-col gap-2 rounded-lg border p-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Layers className="size-4" /> Mix layouts
          </div>
          <p className="text-sm text-muted-foreground">Stack layouts one under another, e.g. Masonry then Carousel. Each takes that many photos in order; the last takes the rest. Leave empty to use the style picked in &ldquo;look&rdquo;.</p>
          {stack.fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <FormField
                control={form.control}
                name={`stack.${index}.layout`}
                render={({ field: f }) => (
                  <FormItem className="flex-1">
                    <Select value={f.value} onValueChange={f.onChange}>
                      <FormControl>
                        <SelectTrigger aria-label="Layout">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STACK_LAYOUTS.map((l) => (
                          <SelectItem key={l.id} value={l.id}>
                            {l.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`stack.${index}.count`}
                render={({ field: f }) => (
                  <FormItem>
                    <FormControl>
                      <Input inputMode="numeric" aria-label="Photos in this layout" className="w-28" placeholder={index === stack.fields.length - 1 ? "The rest" : "Photos"} {...f} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" size="icon" variant="ghost" aria-label="Move layout up" disabled={index === 0} onClick={() => stack.move(index, index - 1)}>
                <ArrowUp className="size-3" />
              </Button>
              <Button type="button" size="icon" variant="ghost" aria-label="Move layout down" disabled={index === stack.fields.length - 1} onClick={() => stack.move(index, index + 1)}>
                <ArrowDown className="size-3" />
              </Button>
              <Button type="button" size="icon" variant="ghost" aria-label="Remove layout" onClick={() => stack.remove(index)}>
                <Trash2 className="size-3" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => stack.append({ layout: stack.fields.length === 0 ? "gallery_masonry" : "gallery_carousel", count: "" })}>
            <Plus className="size-3" /> Add layout
          </Button>
        </div>

        <FormField
          control={form.control}
          name="maxPhotos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photos shown on the invitation page</FormLabel>
              <FormControl>
                <Input inputMode="numeric" className="w-32" placeholder="Template default" {...field} />
              </FormControl>
              <p className="text-sm text-muted-foreground">
                The rest are one tap away behind the &ldquo;See all photos&rdquo; button. {HOME_PHOTOS_MIN} to {HOME_PHOTOS_MAX}; leave empty for the template&apos;s own number.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save gallery
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
