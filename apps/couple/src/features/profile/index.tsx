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
      mutate(PROFILE_KEY);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save profile");
    }
  }

  if (loading) return null;

  return (
    <Main>
      <div className="flex max-w-2xl flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Wedding details</h2>
              <FormField
                control={form.control}
                name="partner1_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner 1 name</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="partner2_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner 2 name</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="partner2_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner 2 email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wedding_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wedding date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Your story</h2>
              <FormField
                control={form.control}
                name="love_story"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Love story</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cover_photo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover photo URL</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Ceremony</h2>
              <FormField
                control={form.control}
                name="ceremony_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ceremony time</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ceremony_venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ceremony venue</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ceremony_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ceremony address</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Reception</h2>
              <FormField
                control={form.control}
                name="reception_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reception time</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reception_venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reception venue</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reception_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reception address</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">Dress code</h2>
              <FormField
                control={form.control}
                name="dress_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dress code</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={form.formState.isSubmitting} className="w-fit">
              Save changes
            </Button>
          </form>
        </Form>

        <MembersSection />
      </div>
    </Main>
  );
}
