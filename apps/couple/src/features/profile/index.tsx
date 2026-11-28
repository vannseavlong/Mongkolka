"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { mutate } from "swr";
import { Alert, AlertDescription, AlertTitle } from "@mongkolka/ui/alert";
import { Button } from "@mongkolka/ui/button";
import { Form } from "@mongkolka/ui/form";
import { Main } from "@mongkolka/ui/layout/main";
import { api, ApiError } from "@/lib/api";
import { useApiQuery } from "@/lib/use-api-query";
import { AssistCard } from "@/features/assist/components/assist-card";
import { MembersSection } from "./components/members-section";
import { ProfileNav } from "./components/profile-nav";
import { ProfileSaveBar } from "./components/profile-save-bar";
import { ProfileSkeleton } from "./components/profile-skeleton";
import { CoupleSection, EventsSection, PhotosSection, StorySection, VenueSection } from "./components/profile-sections";
import { PROFILE_KEY } from "./data/profile-api";
import type { CoupleProfile } from "./data/schema";
import { profileFormSchema, toFormValues, toPayload, type ProfileFormValues } from "./lib/profile-form";

const FORM_ID = "profile-form";

export function Profile() {
  const { data, loading, error, errorStatus, refetch } = useApiQuery<{ profile: CoupleProfile }>(PROFILE_KEY);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    values: data ? toFormValues(data.profile) : undefined,
  });

  async function onSubmit(values: ProfileFormValues) {
    try {
      await api.patch(PROFILE_KEY, toPayload(values));
      toast.success("Profile saved");
      await mutate(PROFILE_KEY);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save profile");
    }
  }

  const { isDirty, isSubmitting } = form.formState;

  return (
    <>
      <ProfileSaveBar formId={FORM_ID} dirty={isDirty} saving={isSubmitting} onDiscard={() => form.reset()} />
      <Main fluid>
        {loading && <ProfileSkeleton />}

        {!loading && !data && (
          <Alert variant="destructive" className="max-w-3xl">
            <AlertTitle>{errorStatus === 403 ? "You do not have access to this" : "Could not load your profile"}</AlertTitle>
            <AlertDescription className="flex flex-wrap items-center gap-3">
              {errorStatus === 403 ? "Ask the person who created the wedding account." : (error ?? "Something went wrong.")}
              {errorStatus !== 403 && (
                <Button size="sm" variant="outline" onClick={() => void refetch()}>
                  Try again
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {data && (
          <div className="flex gap-10">
            <ProfileNav />
            <div className="flex min-w-0 max-w-3xl flex-1 flex-col gap-6">
              <Form {...form}>
                <form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                  <CoupleSection control={form.control} />
                  <PhotosSection control={form.control} />
                  <StorySection control={form.control} />
                  <EventsSection control={form.control} />
                  <VenueSection control={form.control} />
                </form>
              </Form>
              {/* Outside the form: its invite and remove buttons must not submit the profile. */}
              <div id="members" className="scroll-mt-[calc(5rem+var(--assist-banner,0px))]">
                <MembersSection />
              </div>
              <div id="help" className="scroll-mt-[calc(5rem+var(--assist-banner,0px))]">
                <AssistCard />
              </div>
            </div>
          </div>
        )}
      </Main>
    </>
  );
}
