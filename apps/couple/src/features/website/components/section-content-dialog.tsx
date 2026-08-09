"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { mutate } from "swr";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@mongkolka/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@mongkolka/ui/form";
import { Input } from "@mongkolka/ui/input";
import { Textarea } from "@mongkolka/ui/textarea";
import { api, ApiError } from "@/lib/api";
import type { WebsiteSection, WebsiteSectionKey } from "../data/schema";

const SECTIONS_KEY = "/couple/api/website/sections";

/** The only section keys with no other canonical content source — see
 * docs/tasks/template.md's "Where each section's content comes from" table. */
export const CONTENT_EDITABLE_SECTIONS: WebsiteSectionKey[] = [
  "gallery",
  "registry",
  "timeline",
  "rsvp",
  "music",
];

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

async function saveContent(sectionId: string, content: Record<string, unknown>) {
  await api.patch(`/couple/api/website/sections/${sectionId}`, { content });
  mutate(SECTIONS_KEY);
}

// ---------------------------------------------------------------------------
// gallery — content: { photos: string[] }
// ---------------------------------------------------------------------------

const gallerySchema = z.object({
  photos: z.array(z.object({ url: z.string().min(1, "Photo URL is required") })),
});
type GalleryFormValues = z.infer<typeof gallerySchema>;

function GalleryContentForm({ section, onSaved }: { section: WebsiteSection; onSaved: () => void }) {
  const content = asRecord(section.content);
  const initialPhotos = Array.isArray(content.photos) ? content.photos : [];
  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      photos: initialPhotos.filter((p): p is string => typeof p === "string").map((url) => ({ url })),
    },
  });
  const { fields, append, remove, move } = useFieldArray({ control: form.control, name: "photos" });

  async function onSubmit(values: GalleryFormValues) {
    try {
      await saveContent(section.section_id, { photos: values.photos.map((p) => p.url) });
      toast.success("Gallery updated");
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save gallery");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {fields.length === 0 && <p className="text-sm text-muted-foreground">No photos yet.</p>}
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name={`photos.${index}.url`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="https://…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                disabled={index === 0}
                onClick={() => move(index, index - 1)}
              >
                <ArrowUp className="size-3" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                disabled={index === fields.length - 1}
                onClick={() => move(index, index + 1)}
              >
                <ArrowDown className="size-3" />
              </Button>
              <Button type="button" size="icon" variant="ghost" onClick={() => remove(index)}>
                <Trash2 className="size-3" />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => append({ url: "" })}>
          <Plus className="size-3" /> Add photo
        </Button>
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save gallery
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

// ---------------------------------------------------------------------------
// registry — content: { links: { label: string, url: string }[] }
// ---------------------------------------------------------------------------

const registrySchema = z.object({
  links: z.array(
    z.object({
      label: z.string().min(1, "Label is required"),
      url: z.string().min(1, "URL is required"),
    }),
  ),
});
type RegistryFormValues = z.infer<typeof registrySchema>;

function RegistryContentForm({ section, onSaved }: { section: WebsiteSection; onSaved: () => void }) {
  const content = asRecord(section.content);
  const initialLinks = Array.isArray(content.links) ? content.links : [];
  const form = useForm<RegistryFormValues>({
    resolver: zodResolver(registrySchema),
    defaultValues: {
      links: initialLinks
        .filter((l): l is { label?: unknown; url?: unknown } => !!l && typeof l === "object")
        .map((l) => ({ label: String(l.label ?? ""), url: String(l.url ?? "") })),
    },
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "links" });

  async function onSubmit(values: RegistryFormValues) {
    try {
      await saveContent(section.section_id, { links: values.links });
      toast.success("Registry updated");
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save registry");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {fields.length === 0 && <p className="text-sm text-muted-foreground">No registry links yet.</p>}
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-2">
              <FormField
                control={form.control}
                name={`links.${index}.label`}
                render={({ field }) => (
                  <FormItem className="w-32">
                    <FormControl>
                      <Input placeholder="Amazon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`links.${index}.url`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="https://…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" size="icon" variant="ghost" onClick={() => remove(index)}>
                <Trash2 className="size-3" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => append({ label: "", url: "" })}
        >
          <Plus className="size-3" /> Add link
        </Button>
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save registry
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

// ---------------------------------------------------------------------------
// timeline — content: { chapters: { title: string, text: string, year: string }[] }
// ---------------------------------------------------------------------------

const timelineSchema = z.object({
  chapters: z.array(
    z.object({
      year: z.string().min(1, "Year is required"),
      title: z.string().min(1, "Title is required"),
      text: z.string().min(1, "Text is required"),
    }),
  ),
});
type TimelineFormValues = z.infer<typeof timelineSchema>;

function TimelineContentForm({ section, onSaved }: { section: WebsiteSection; onSaved: () => void }) {
  const content = asRecord(section.content);
  const initialChapters = Array.isArray(content.chapters) ? content.chapters : [];
  const form = useForm<TimelineFormValues>({
    resolver: zodResolver(timelineSchema),
    defaultValues: {
      chapters: initialChapters
        .filter((c): c is { year?: unknown; title?: unknown; text?: unknown } => !!c && typeof c === "object")
        .map((c) => ({
          year: String(c.year ?? ""),
          title: String(c.title ?? ""),
          text: String(c.text ?? ""),
        })),
    },
  });
  const { fields, append, remove, move } = useFieldArray({ control: form.control, name: "chapters" });

  async function onSubmit(values: TimelineFormValues) {
    try {
      await saveContent(section.section_id, { chapters: values.chapters });
      toast.success("Timeline updated");
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save timeline");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          {fields.length === 0 && <p className="text-sm text-muted-foreground">No chapters yet.</p>}
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-2 rounded-md border p-2">
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`chapters.${index}.year`}
                  render={({ field }) => (
                    <FormItem className="w-20">
                      <FormControl>
                        <Input placeholder="2024" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`chapters.${index}.title`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="How We Met" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={index === 0}
                  onClick={() => move(index, index - 1)}
                >
                  <ArrowUp className="size-3" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={index === fields.length - 1}
                  onClick={() => move(index, index + 1)}
                >
                  <ArrowDown className="size-3" />
                </Button>
                <Button type="button" size="icon" variant="ghost" onClick={() => remove(index)}>
                  <Trash2 className="size-3" />
                </Button>
              </div>
              <FormField
                control={form.control}
                name={`chapters.${index}.text`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea rows={2} placeholder="Tell the story…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => append({ year: "", title: "", text: "" })}
        >
          <Plus className="size-3" /> Add chapter
        </Button>
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save timeline
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

// ---------------------------------------------------------------------------
// rsvp — content: { customMessage?: string, deadline?: string }
// ---------------------------------------------------------------------------

const rsvpSchema = z.object({
  customMessage: z.string(),
  deadline: z.string(),
});
type RsvpFormValues = z.infer<typeof rsvpSchema>;

function RsvpContentForm({ section, onSaved }: { section: WebsiteSection; onSaved: () => void }) {
  const content = asRecord(section.content);
  const form = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      customMessage: typeof content.customMessage === "string" ? content.customMessage : "",
      deadline: typeof content.deadline === "string" ? content.deadline : "",
    },
  });

  async function onSubmit(values: RsvpFormValues) {
    try {
      await saveContent(section.section_id, {
        customMessage: values.customMessage || undefined,
        deadline: values.deadline || undefined,
      });
      toast.success("RSVP details updated");
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save RSVP details");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="customMessage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom message</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="We can't wait to celebrate with you!" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RSVP deadline</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save RSVP details
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

// ---------------------------------------------------------------------------
// music — content: { playlistUrl?: string }
// ---------------------------------------------------------------------------

const musicSchema = z.object({ playlistUrl: z.string() });
type MusicFormValues = z.infer<typeof musicSchema>;

function MusicContentForm({ section, onSaved }: { section: WebsiteSection; onSaved: () => void }) {
  const content = asRecord(section.content);
  const form = useForm<MusicFormValues>({
    resolver: zodResolver(musicSchema),
    defaultValues: {
      playlistUrl: typeof content.playlistUrl === "string" ? content.playlistUrl : "",
    },
  });

  async function onSubmit(values: MusicFormValues) {
    try {
      await saveContent(section.section_id, { playlistUrl: values.playlistUrl || undefined });
      toast.success("Playlist updated");
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save playlist");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="playlistUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Playlist URL</FormLabel>
              <FormControl>
                <Input placeholder="https://open.spotify.com/playlist/…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save playlist
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

// ---------------------------------------------------------------------------

const SECTION_LABELS: Partial<Record<WebsiteSectionKey, string>> = {
  gallery: "gallery photos",
  registry: "registry links",
  timeline: "timeline chapters",
  rsvp: "RSVP details",
  music: "playlist",
};

export function SectionContentDialog({
  section,
  onOpenChange,
}: {
  section: WebsiteSection | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={!!section} onOpenChange={onOpenChange}>
      <DialogContent>
        {section && (
          <>
            <DialogHeader>
              <DialogTitle className="capitalize">
                Edit {SECTION_LABELS[section.section_key] ?? section.section_key}
              </DialogTitle>
            </DialogHeader>
            {section.section_key === "gallery" && (
              <GalleryContentForm key={section.section_id} section={section} onSaved={() => onOpenChange(false)} />
            )}
            {section.section_key === "registry" && (
              <RegistryContentForm key={section.section_id} section={section} onSaved={() => onOpenChange(false)} />
            )}
            {section.section_key === "timeline" && (
              <TimelineContentForm key={section.section_id} section={section} onSaved={() => onOpenChange(false)} />
            )}
            {section.section_key === "rsvp" && (
              <RsvpContentForm key={section.section_id} section={section} onSaved={() => onOpenChange(false)} />
            )}
            {section.section_key === "music" && (
              <MusicContentForm key={section.section_id} section={section} onSaved={() => onOpenChange(false)} />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
