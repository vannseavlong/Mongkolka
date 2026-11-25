"use client";

import { useState } from "react";
import { defaultSectionTitle } from "@mongkolka/templates";
import { Button } from "@mongkolka/ui/button";
import { Input } from "@mongkolka/ui/input";
import { Label } from "@mongkolka/ui/label";
import type { WebsiteSection } from "../data/schema";
import { TITLE_MAX, titleChanged, titleToForm, titleToPatch, type TitleFormValues } from "../lib/section-title";
import { sectionLabel } from "../workspace/section-labels";

/**
 * The section's heading in Khmer and in English. Empty keeps the template's wording (shown in grey). Saved on its own,
 * so it never interferes with the section's content form below it.
 */
export function SectionTitleFields({
  section,
  onSave,
}: {
  section: WebsiteSection;
  onSave: (title: { kh?: string; en?: string } | null) => Promise<boolean>;
}) {
  const [values, setValues] = useState<TitleFormValues>(() => titleToForm(section.title));
  const [saving, setSaving] = useState(false);
  const dirty = titleChanged(section.title, values);
  const name = sectionLabel(section.section_key);

  async function save() {
    setSaving(true);
    try {
      await onSave(titleToPatch(values));
    } finally {
      setSaving(false);
    }
  }

  return (
    <fieldset className="flex flex-col gap-3 rounded-md border p-3">
      <legend className="px-1 text-sm font-medium">{name} title</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`title-kh-${section.section_id}`}>Khmer</Label>
          <Input
            id={`title-kh-${section.section_id}`}
            value={values.kh}
            maxLength={TITLE_MAX}
            placeholder={defaultSectionTitle(section.section_key, "kh")}
            onChange={(e) => setValues((v) => ({ ...v, kh: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`title-en-${section.section_id}`}>English</Label>
          <Input
            id={`title-en-${section.section_id}`}
            value={values.en}
            maxLength={TITLE_MAX}
            placeholder={defaultSectionTitle(section.section_key, "en")}
            onChange={(e) => setValues((v) => ({ ...v, en: e.target.value }))}
          />
        </div>
      </div>
      <Button type="button" size="sm" className="w-fit" disabled={!dirty || saving} onClick={() => void save()}>
        Save title
      </Button>
    </fieldset>
  );
}
