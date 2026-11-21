"use client";

import { useRef, useState } from "react";
import type { Control, UseFormReturn } from "react-hook-form";
import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { AssetPicker } from "./asset-picker";
import { TextRow } from "./section-form-fields";

/** The gift fields every registry form shares. Mirrors the server limits (UX only; the API enforces them). */
export interface GiftFormValues {
  khqrImageUrl: string;
  bank: string;
  accountName: string;
  accountNumber: string;
}

export const GIFT_LIMITS = { bank: 80, accountName: 120, accountNumber: 34 } as const;

/** Server rule: digits, spaces and hyphens, starting with a digit. */
export const ACCOUNT_NUMBER_PATTERN = /^[0-9][0-9 -]*$/;

export function giftFromContent(content: Record<string, unknown>): GiftFormValues {
  const s = (v: unknown) => (typeof v === "string" ? v : "");
  return {
    khqrImageUrl: s(content.khqrImageUrl),
    bank: s(content.bank),
    accountName: s(content.accountName),
    accountNumber: s(content.accountNumber),
  };
}

/** Only non-empty values go out; the API drops empty strings anyway. */
export function giftToContent(values: GiftFormValues): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) {
    const trimmed = value.trim();
    if (trimmed) out[key] = trimmed;
  }
  return out;
}

type Host = { gift: GiftFormValues };

/** KHQR image (picked from the asset library), bank, account name and number. Display only: no amounts. */
export function GiftContentFields<T extends Host>({ form }: { form: UseFormReturn<T> }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerButtonRef = useRef<HTMLButtonElement>(null);
  const control = form.control as unknown as Control<Host>;
  const typed = form as unknown as UseFormReturn<Host>;
  const image = typed.watch("gift.khqrImageUrl");

  return (
    <fieldset className="flex flex-col gap-3 rounded-md border p-3">
      <legend className="px-1 text-sm font-medium">Gift (KHQR)</legend>
      <p className="text-xs text-muted-foreground">
        Shown on your site with a copy button. Guests send gifts in their own banking app; nothing is collected here.
      </p>
      <div className="flex items-center gap-3">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- user-supplied library image
          <img src={image} alt="KHQR preview" className="size-20 rounded-md border bg-white object-contain" />
        ) : (
          <div className="flex size-20 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">No QR</div>
        )}
        <div className="flex flex-col gap-2">
          <Button ref={pickerButtonRef} type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
            <ImagePlus className="size-3" /> {image ? "Change KHQR image" : "Choose KHQR image"}
          </Button>
          {image && (
            <Button type="button" variant="ghost" size="sm" onClick={() => typed.setValue("gift.khqrImageUrl", "", { shouldDirty: true })}>
              <Trash2 className="size-3" /> Remove
            </Button>
          )}
        </div>
      </div>
      <AssetPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        multiple={false}
        title="Choose your KHQR image"
        returnFocusRef={pickerButtonRef}
        onConfirm={([url]) => url && typed.setValue("gift.khqrImageUrl", url, { shouldDirty: true })}
      />
      <TextRow control={control} name="gift.bank" label="Bank" placeholder="ABA Bank" />
      <TextRow control={control} name="gift.accountName" label="Account name" />
      <TextRow control={control} name="gift.accountNumber" label="Account number" hint="Digits, spaces and hyphens only." />
    </fieldset>
  );
}
