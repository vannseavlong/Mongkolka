"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@mongkolka/ui/button";
import { DialogFooter } from "@mongkolka/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@mongkolka/ui/form";
import { DatePicker } from "@mongkolka/ui/date-picker";
import { Input } from "@mongkolka/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mongkolka/ui/select";
import { Textarea } from "@mongkolka/ui/textarea";
import { TextRow } from "./section-form-fields";
import { ApiError } from "@/lib/api";
import { asRecord, saveContent } from "../lib/section-content-save";
import type { WebsiteSection } from "../data/schema";
import { AssetPicker } from "./asset-picker";
import { newUrlsOnly } from "./asset-library-logic";
import { VERSE_PRESETS } from "../lib/verse-presets";
import { InvitationContentForm } from "./invitation-content-form";
import { AgendaContentForm } from "./agenda-content-form";
import { LettersContentForm } from "./letters-content-form";
import { CoverContentForm } from "./cover-content-form";
import { OpeningContentForm } from "./opening-content-form";
import { VideoContentForm } from "./video-content-form";
import { ACCOUNT_NUMBER_PATTERN, GIFT_LIMITS, GiftContentFields, giftFromContent, giftToContent } from "./gift-content-fields";


export { CONTENT_EDITABLE_SECTIONS } from "../lib/section-editors";


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
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerButtonRef = useRef<HTMLButtonElement>(null);

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
          <Plus className="size-3" /> Add photo by URL
        </Button>
        <Button ref={pickerButtonRef} type="button" variant="outline" size="sm" className="w-fit" onClick={() => setPickerOpen(true)}>
          <ImagePlus className="size-3" /> Choose from library
        </Button>
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
// registry — content: { links: { label, url }[], khqrImageUrl?, bank?, accountName?, accountNumber? }
// ---------------------------------------------------------------------------

const registrySchema = z.object({
  links: z.array(
    z.object({
      label: z.string().min(1, "Label is required"),
      url: z.string().min(1, "URL is required"),
    }),
  ),
  gift: z.object({
    khqrImageUrl: z.string(),
    bank: z.string().max(GIFT_LIMITS.bank, `Max ${GIFT_LIMITS.bank} characters`),
    accountName: z.string().max(GIFT_LIMITS.accountName, `Max ${GIFT_LIMITS.accountName} characters`),
    accountNumber: z
      .string()
      .max(GIFT_LIMITS.accountNumber, `Max ${GIFT_LIMITS.accountNumber} characters`)
      .refine((v) => v.trim() === "" || ACCOUNT_NUMBER_PATTERN.test(v.trim()), "Digits, spaces and hyphens only"),
  }),
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
      gift: giftFromContent(content),
    },
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "links" });

  async function onSubmit(values: RegistryFormValues) {
    try {
      await saveContent(section.section_id, { links: values.links, ...giftToContent(values.gift) });
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
        <GiftContentFields form={form} />
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
                <DatePicker value={field.value} onChange={field.onChange} />
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
// verse — content: { text, textKh, reference, referenceKh, meaning, meaningKh }
// ---------------------------------------------------------------------------

const VERSE_LIMITS = { text: 600, reference: 60, meaning: 200 } as const;
const verseSchema = z.object({
  textKh: z.string().max(VERSE_LIMITS.text, `Max ${VERSE_LIMITS.text} characters`),
  referenceKh: z.string().max(VERSE_LIMITS.reference, `Max ${VERSE_LIMITS.reference} characters`),
  meaningKh: z.string().max(VERSE_LIMITS.meaning, `Max ${VERSE_LIMITS.meaning} characters`),
  text: z.string().max(VERSE_LIMITS.text, `Max ${VERSE_LIMITS.text} characters`),
  reference: z.string().max(VERSE_LIMITS.reference, `Max ${VERSE_LIMITS.reference} characters`),
  meaning: z.string().max(VERSE_LIMITS.meaning, `Max ${VERSE_LIMITS.meaning} characters`),
});
type VerseFormValues = z.infer<typeof verseSchema>;

function VerseContentForm({ section, onSaved }: { section: WebsiteSection; onSaved: () => void }) {
  const content = asRecord(section.content);
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const form = useForm<VerseFormValues>({
    resolver: zodResolver(verseSchema),
    defaultValues: {
      textKh: str(content.textKh),
      referenceKh: str(content.referenceKh),
      meaningKh: str(content.meaningKh),
      text: str(content.text),
      reference: str(content.reference),
      meaning: str(content.meaning),
    },
  });

  function applyPreset(index: string) {
    const preset = VERSE_PRESETS[Number(index)];
    if (!preset) return;
    form.setValue("text", preset.text, { shouldDirty: true });
    form.setValue("reference", preset.reference, { shouldDirty: true });
    form.setValue("referenceKh", preset.referenceKh, { shouldDirty: true });
    // A new passage makes the Khmer wording and both meanings stale; the Khmer text is typed by the couple.
    form.setValue("textKh", "", { shouldDirty: true });
    form.setValue("meaning", "", { shouldDirty: true });
    form.setValue("meaningKh", "", { shouldDirty: true });
  }

  async function onSubmit(values: VerseFormValues) {
    try {
      const clean = (v: string) => v.trim() || undefined;
      await saveContent(section.section_id, {
        text: clean(values.text),
        textKh: clean(values.textKh),
        reference: clean(values.reference),
        referenceKh: clean(values.referenceKh),
        meaning: clean(values.meaning),
        meaningKh: clean(values.meaningKh),
      });
      toast.success("Verse updated");
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save verse");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="verse-preset" className="text-sm font-medium">
            Start from a well-known verse
          </label>
          <Select value="" onValueChange={applyPreset}>
            <SelectTrigger id="verse-preset" className="w-full">
              <SelectValue placeholder="Pick a preset (optional)…" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {VERSE_PRESETS.map((preset, i) => (
                <SelectItem key={preset.reference} value={String(i)}>
                  {preset.reference} · {preset.referenceKh}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <fieldset className="flex flex-col gap-3 rounded-md border p-3">
          <legend className="px-1 text-sm font-medium">ខ្មែរ · Khmer</legend>
          <TextRow control={form.control} name="textKh" label="Verse" rows={5} />
          <TextRow control={form.control} name="referenceKh" label="Reference" placeholder="កូរិនថូសទី១ ១៣:៤-៧" />
          <TextRow control={form.control} name="meaningKh" label="Meaning (one line, optional)" />
        </fieldset>
        <fieldset className="flex flex-col gap-3 rounded-md border p-3">
          <legend className="px-1 text-sm font-medium">English</legend>
          <TextRow control={form.control} name="text" label="Verse" rows={5} />
          <TextRow control={form.control} name="reference" label="Reference" placeholder="1 Corinthians 13:4-7" />
          <TextRow control={form.control} name="meaning" label="Meaning (one line, optional)" />
        </fieldset>
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save verse
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

// ---------------------------------------------------------------------------
// footer — content: { message?: string, hashtag?: string }
// ---------------------------------------------------------------------------

const footerSchema = z.object({
  message: z.string().max(300, "Max 300 characters"),
  hashtag: z.string().max(60, "Max 60 characters"),
});
type FooterFormValues = z.infer<typeof footerSchema>;

function FooterContentForm({ section, onSaved }: { section: WebsiteSection; onSaved: () => void }) {
  const content = asRecord(section.content);
  const form = useForm<FooterFormValues>({
    resolver: zodResolver(footerSchema),
    defaultValues: {
      message: typeof content.message === "string" ? content.message : "",
      hashtag: typeof content.hashtag === "string" ? content.hashtag : "",
    },
  });

  async function onSubmit(values: FooterFormValues) {
    try {
      await saveContent(section.section_id, {
        message: values.message.trim() || undefined,
        hashtag: values.hashtag.trim() || undefined,
      });
      toast.success("Footer updated");
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save footer");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Closing message</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Thank you for celebrating with us." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hashtag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hashtag</FormLabel>
              <FormControl>
                <Input placeholder="#SokhaAndDara" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save footer
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

// ---------------------------------------------------------------------------

/** Edit form for a content-backed section, shown inline in the builder's content panel. */
export function SectionContentForm({ section, onSaved }: { section: WebsiteSection; onSaved: () => void }) {
  if (section.section_key === "cover") return <CoverContentForm key={section.section_id} section={section} onSaved={onSaved} />;
  if (section.section_key === "opening") return <OpeningContentForm key={section.section_id} section={section} onSaved={onSaved} />;
  if (section.section_key === "gallery") return <GalleryContentForm key={section.section_id} section={section} onSaved={onSaved} />;
  if (section.section_key === "registry") return <RegistryContentForm key={section.section_id} section={section} onSaved={onSaved} />;
  if (section.section_key === "timeline") return <TimelineContentForm key={section.section_id} section={section} onSaved={onSaved} />;
  if (section.section_key === "rsvp") return <RsvpContentForm key={section.section_id} section={section} onSaved={onSaved} />;
  if (section.section_key === "music") return <MusicContentForm key={section.section_id} section={section} onSaved={onSaved} />;
  if (section.section_key === "verse") return <VerseContentForm key={section.section_id} section={section} onSaved={onSaved} />;
  if (section.section_key === "footer") return <FooterContentForm key={section.section_id} section={section} onSaved={onSaved} />;
  if (section.section_key === "invitation") return <InvitationContentForm key={section.section_id} section={section} onSaved={onSaved} />;
  if (section.section_key === "agenda") return <AgendaContentForm key={section.section_id} section={section} onSaved={onSaved} />;
  if (section.section_key === "video") return <VideoContentForm key={section.section_id} section={section} onSaved={onSaved} />;
  if (section.section_key === "letters") return <LettersContentForm key={section.section_id} section={section} onSaved={onSaved} />;
  return null;
}
