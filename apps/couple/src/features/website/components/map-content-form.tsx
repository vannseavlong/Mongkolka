"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { DialogFooter } from "@mongkolka/ui/dialog";
import { Form } from "@mongkolka/ui/form";
import { Input } from "@mongkolka/ui/input";
import { Label } from "@mongkolka/ui/label";
import { ApiError } from "@/lib/api";
import type { WebsiteSection } from "../data/schema";
import { asRecord, saveContent } from "../lib/section-content-save";
import { AssetPicker } from "./asset-picker";
import { TextRow } from "./section-form-fields";

const schema = z.object({
  imageUrl: z.string().max(2000).refine((v) => v.trim() === "" || /^https?:\/\//i.test(v.trim()), "Use an image link that starts with https://"),
  captionKh: z.string().max(200, "Max 200 characters"),
  captionEn: z.string().max(200, "Max 200 characters"),
  placeName: z.string().max(200, "Max 200 characters"),
  mapUrl: z.string().max(2000).refine((v) => v.trim() === "" || /^https:\/\//i.test(v.trim()), "Use a link that starts with https://"),
});
type Values = z.infer<typeof schema>;

const str = (v: unknown) => (typeof v === "string" ? v : "");

/** map — content: MapContent { imageUrl?, captionKh?, captionEn?, placeName?, mapUrl? } (see @mongkolka/templates). A blank place name or link falls back to the profile. */
export function MapContentForm({ section, onSaved }: { section: WebsiteSection; onSaved: () => void }) {
  const content = asRecord(section.content);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { imageUrl: str(content.imageUrl), captionKh: str(content.captionKh), captionEn: str(content.captionEn), placeName: str(content.placeName), mapUrl: str(content.mapUrl) },
  });
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLButtonElement>(null);
  const image = form.watch("imageUrl").trim();

  async function onSubmit(v: Values) {
    try {
      await saveContent(section.section_id, { imageUrl: v.imageUrl.trim() || undefined, captionKh: v.captionKh.trim() || undefined, captionEn: v.captionEn.trim() || undefined, placeName: v.placeName.trim() || undefined, mapUrl: v.mapUrl.trim() || undefined });
      toast.success("Map updated");
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save the map");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">Your own drawn map picture (about 1456 × 1470 works well).</p>
        <TextRow control={form.control} name="placeName" label="Place name (optional)" hint="Shown with a pin above the map. Blank uses the reception venue from your profile." />
        <TextRow control={form.control} name="mapUrl" label="Directions link (optional)" placeholder="https://maps.app.goo.gl/…" hint="Blank uses the map link from your profile." />
        <div className="flex flex-col gap-2">
          <Label htmlFor="map-image">Map picture</Label>
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="Current map" className="max-h-48 w-fit rounded-md border object-contain" />
          )}
          <Input id="map-image" inputMode="url" placeholder="https://…" {...form.register("imageUrl")} />
          {form.formState.errors.imageUrl && <p className="text-sm text-destructive">{form.formState.errors.imageUrl.message}</p>}
          <Button ref={pickerRef} type="button" variant="outline" size="sm" className="w-fit" onClick={() => setPickerOpen(true)}>
            <ImagePlus className="size-3" /> Choose from library
          </Button>
        </div>
        <AssetPicker
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          title="Choose the map picture"
          multiple={false}
          returnFocusRef={pickerRef}
          onConfirm={(urls) => urls[0] && form.setValue("imageUrl", urls[0], { shouldDirty: true, shouldValidate: true })}
        />
        <TextRow control={form.control} name="captionKh" label="Caption (Khmer, optional)" />
        <TextRow control={form.control} name="captionEn" label="Caption (English, optional)" />
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save map
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
