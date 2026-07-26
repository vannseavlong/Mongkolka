"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@mongkolka/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@mongkolka/ui/form";
import { Input } from "@mongkolka/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mongkolka/ui/select";
import { Textarea } from "@mongkolka/ui/textarea";
import { Main } from "@mongkolka/ui/layout/main";
import { api, ApiError } from "@/lib/api";
import { useApiQuery } from "@/lib/use-api-query";
import type { VendorCategory, VendorProfile } from "./data/schema";

const profileFormSchema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  category_id: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  bio: z.string().optional(),
  service_area: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const PROFILE_KEY = "/vendor/api/profile";

export function Profile() {
  const { data, loading } = useApiQuery<{ profile: VendorProfile }>(PROFILE_KEY);
  const { data: categoryData } = useApiQuery<{ categories: VendorCategory[] }>("/vendor/api/categories");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    values: data
      ? {
          business_name: data.profile.business_name ?? "",
          category_id: data.profile.category_id ?? undefined,
          location: data.profile.location ?? "",
          description: data.profile.description ?? "",
          bio: data.profile.bio ?? "",
          service_area: data.profile.service_area ?? "",
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
      <div className="flex max-w-xl flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryData?.categories.map((category) => (
                        <SelectItem key={category.category_id} value={category.category_id}>
                          {category.label_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Phnom Penh, Cambodia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Public description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service_area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service area</FormLabel>
                  <FormControl>
                    <Input placeholder="Phnom Penh and surrounding provinces" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting} className="w-fit">
              Save changes
            </Button>
          </form>
        </Form>
      </div>
    </Main>
  );
}
