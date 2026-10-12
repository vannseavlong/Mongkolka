"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@mongkolka/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@mongkolka/ui/form";
import { Input } from "@mongkolka/ui/input";
import { Textarea } from "@mongkolka/ui/textarea";
import { Main } from "@mongkolka/ui/layout/main";
import type { Control, FieldPath } from "react-hook-form";
import { api, ApiError } from "@/lib/api";
import { useApiQuery } from "@/lib/use-api-query";
import { MembersSection } from "./components/members-section";
import type { CoupleProfile } from "./data/schema";

const profileFormSchema = z.object({
  partner1_name: z.string().nullable(),
  partner2_name: z.string().nullable(),
  partner2_email: z.string().nullable(),
  wedding_date: z.string().nullable(),
  love_story: z.string().nullable(),
  cover_photo_url: z.string().nullable(),
  ceremony_time: z.string().nullable(),
  ceremony_venue: z.string().nullable(),
  ceremony_address: z.string().nullable(),
  reception_time: z.string().nullable(),
  reception_venue: z.string().nullable(),
  reception_address: z.string().nullable(),
  dress_code: z.string().nullable(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const PROFILE_KEY = "/couple/api/profile";

export function Profile() {
  const { data, loading } = useApiQuery<{ profile: CoupleProfile }>(PROFILE_KEY);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    values: data
      ? {
          partner1_name: data.profile.partner1_name,
          partner2_name: data.profile.partner2_name,
          partner2_email: data.profile.partner2_email,
          wedding_date: data.profile.wedding_date,
          love_story: data.profile.love_story,
          cover_photo_url: data.profile.cover_photo_url,
          ceremony_time: data.profile.ceremony_time,
          ceremony_venue: data.profile.ceremony_venue,
          ceremony_address: data.profile.ceremony_address,
          reception_time: data.profile.reception_time,
          reception_venue: data.profile.reception_venue,
          reception_address: data.profile.reception_address,
          dress_code: data.profile.dress_code,
        }
      : undefined,
  });

  async function onSubmit(values: ProfileFormValues) {
    try {
      await api.patch(PROFILE_KEY, values);
      toast.success("Profile saved");
      await mutate(PROFILE_KEY);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save profile");
    }
  }

  if (loading) return null;

  const names = [form.watch("partner1_name"), form.watch("partner2_name")].filter(Boolean).join(" & ");
  const cover = form.watch("cover_photo_url");
  const { isDirty, isSubmitting } = form.formState;

  return (
    <Main>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex max-w-4xl flex-col gap-6 pb-24">
          <header>
            <h1 className="text-2xl font-bold tracking-tight">{names || "Your wedding"}</h1>
            <p className="text-muted-foreground">
              This is what appears on your website and invitations. Changes go live when you save.
            </p>
          </header>

          <Section title="The couple" description="Who's getting married, and when.">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField control={form.control} name="partner1_name" label="Partner 1" />
              <TextField control={form.control} name="partner2_name" label="Partner 2" />
              <TextField control={form.control} name="partner2_email" label="Partner 2 email" type="email" />
              <TextField control={form.control} name="wedding_date" label="Wedding date" type="date" />
            </div>
          </Section>

          <Section title="Your story" description="Shown on your site's story section and hero.">
            <div className="grid gap-5 md:grid-cols-[1fr_14rem]">
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="love_story"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Love story</FormLabel>
                      <FormControl>
                        <Textarea rows={7} placeholder="How you met, the proposal, what this day means…" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <TextField control={form.control} name="cover_photo_url" label="Cover photo URL" placeholder="https://…" />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Cover preview</p>
                <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-t-full rounded-b-md border bg-muted text-xs text-muted-foreground">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt="Cover preview" className="size-full object-cover" />
                  ) : (
                    "No cover photo yet"
                  )}
                </div>
              </div>
            </div>
          </Section>

          <div className="grid gap-6 lg:grid-cols-2">
            <Section title="Ceremony" description="The main event.">
              <div className="flex flex-col gap-4">
                <TextField control={form.control} name="ceremony_time" label="Time" placeholder="9:00 AM" />
                <TextField control={form.control} name="ceremony_venue" label="Venue" />
                <TextField control={form.control} name="ceremony_address" label="Address" hint="Used for the “Get directions” button on your site." />
              </div>
            </Section>
            <Section title="Reception" description="The celebration afterwards.">
              <div className="flex flex-col gap-4">
                <TextField control={form.control} name="reception_time" label="Time" placeholder="6:00 PM" />
                <TextField control={form.control} name="reception_venue" label="Venue" />
                <TextField control={form.control} name="reception_address" label="Address" />
              </div>
            </Section>
          </div>

          <Section title="Dress code" description="Optional — shown with your event details.">
            <TextField control={form.control} name="dress_code" label="Dress code" placeholder="e.g. Black tie · jewel tones welcome" />
          </Section>

          <MembersSection />

          {/* sticky save bar */}
          <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/90 backdrop-blur">
            <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 md:pl-[var(--sidebar-width,16rem)]">
              <p className="text-sm text-muted-foreground">
                {isDirty ? "You have unsaved changes." : "All changes saved."}
              </p>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" disabled={!isDirty || isSubmitting} onClick={() => form.reset()}>
                  Discard
                </Button>
                <Button type="submit" disabled={!isDirty || isSubmitting}>
                  {isSubmitting ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </Main>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card">
      <div className="border-b px-5 py-4">
        <h2 className="font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function TextField({
  control,
  name,
  label,
  type,
  placeholder,
  hint,
}: {
  control: Control<ProfileFormValues>;
  name: FieldPath<ProfileFormValues>;
  label: string;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} value={(field.value as string | null) ?? ""} />
          </FormControl>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
