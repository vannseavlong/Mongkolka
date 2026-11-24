"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@mongkolka/ui/button";
import { DialogFooter } from "@mongkolka/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@mongkolka/ui/form";
import { Input } from "@mongkolka/ui/input";
import { ApiError } from "@/lib/api";
import type { WebsiteSection } from "../data/schema";
import { isYoutubeLink } from "../lib/video-link";
import { asRecord, saveContent } from "../lib/section-content-save";

const schema = z.object({
  url: z.string().max(2000).refine((v) => v.trim() === "" || isYoutubeLink(v), "Paste a YouTube link, for example https://youtu.be/xxxxxxxxxxx"),
  title: z.string().max(120, "Max 120 characters"),
});
type Values = z.infer<typeof schema>;

/** video — content: VideoContent { url?, title? } (see @mongkolka/templates). Empty link hides the section. */
export function VideoContentForm({ section, onSaved }: { section: WebsiteSection; onSaved: () => void }) {
  const content = asRecord(section.content);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { url: typeof content.url === "string" ? content.url : "", title: typeof content.title === "string" ? content.title : "" },
  });

  async function onSubmit(values: Values) {
    try {
      await saveContent(section.section_id, { url: values.url.trim() || undefined, title: values.title.trim() || undefined });
      toast.success("Video updated");
      onSaved();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save video");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube link</FormLabel>
              <FormControl>
                <Input inputMode="url" placeholder="https://www.youtube.com/watch?v=..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Our pre-wedding film" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Save video
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
