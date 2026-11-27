"use client";

import type { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@mongkolka/ui/form";
import { Textarea } from "@mongkolka/ui/textarea";
import type { ProfileFormValues } from "../lib/profile-form";
import { ProfilePhotoField } from "./profile-photo-field";
import { ProfileSection } from "./profile-section";
import { ProfileTextField } from "./profile-text-field";

interface Props {
  control: Control<ProfileFormValues>;
}

export function CoupleSection({ control }: Props) {
  return (
    <ProfileSection id="couple" title="The couple" description="Who's getting married, and when.">
      <div className="grid gap-4 sm:grid-cols-2">
        <ProfileTextField control={control} name="partner1_name" label="Partner 1" />
        <ProfileTextField control={control} name="partner2_name" label="Partner 2" />
        <ProfileTextField control={control} name="partner2_email" label="Partner 2 email" type="email" />
        <ProfileTextField control={control} name="wedding_date" label="Wedding date" type="date" />
      </div>
    </ProfileSection>
  );
}

export function PhotosSection({ control }: Props) {
  return (
    <ProfileSection
      id="photos"
      title="Photos"
      description="Pick from your image library or upload new ones. Saved with the rest of your profile."
    >
      <div className="grid gap-6 sm:grid-cols-[12rem_1fr] sm:items-start">
        <FormField
          control={control}
          name="cover_photo_url"
          render={({ field }) => (
            <FormItem>
              <ProfilePhotoField
                label="Cover photo"
                shape="arch"
                hint="The first picture visitors see."
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="venue_image_url"
          render={({ field }) => (
            <FormItem className="max-w-sm">
              <ProfilePhotoField
                label="Venue photo"
                shape="wide"
                hint="Optional. Shown on templates with a venue picture."
                value={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </ProfileSection>
  );
}

export function StorySection({ control }: Props) {
  return (
    <ProfileSection id="story" title="Your story" description="Shown on your site's story section and hero.">
      <FormField
        control={control}
        name="love_story"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Love story</FormLabel>
            <FormControl>
              <Textarea
                rows={7}
                placeholder="How you met, the proposal, what this day means…"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </ProfileSection>
  );
}

export function EventsSection({ control }: Props) {
  return (
    <ProfileSection id="events" title="Ceremony & reception" description="When and where guests should be.">
      <div className="grid gap-8 md:grid-cols-2">
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-3 text-sm font-medium">Ceremony</legend>
          <ProfileTextField control={control} name="ceremony_time" label="Time" placeholder="9:00 AM" />
          <ProfileTextField control={control} name="ceremony_venue" label="Venue" />
          <ProfileTextField
            control={control}
            name="ceremony_address"
            label="Address"
            hint="Used for the “Get directions” button on your site."
          />
        </fieldset>
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-3 text-sm font-medium">Reception</legend>
          <ProfileTextField control={control} name="reception_time" label="Time" placeholder="6:00 PM" />
          <ProfileTextField control={control} name="reception_venue" label="Venue" />
          <ProfileTextField control={control} name="reception_address" label="Address" />
        </fieldset>
      </div>
    </ProfileSection>
  );
}

export function VenueSection({ control }: Props) {
  return (
    <ProfileSection id="venue" title="Map & dress code" description="Optional. Shown with your event details.">
      <div className="grid gap-4 sm:grid-cols-2">
        <ProfileTextField
          control={control}
          name="map_url"
          label="Map link"
          placeholder="https://maps.app.goo.gl/…"
          hint="A Google Maps share link. https only."
        />
        <ProfileTextField
          control={control}
          name="dress_code"
          label="Dress code"
          placeholder="e.g. Black tie · jewel tones welcome"
        />
      </div>
    </ProfileSection>
  );
}
