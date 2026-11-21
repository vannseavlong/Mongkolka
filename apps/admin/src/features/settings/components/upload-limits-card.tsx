"use client";

import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@mongkolka/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@mongkolka/ui/card";
import { Input } from "@mongkolka/ui/input";
import { Label } from "@mongkolka/ui/label";
import { Skeleton } from "@mongkolka/ui/skeleton";
import { ApiError } from "@/lib/api";
import { useApiQuery } from "@/lib/use-api-query";
import { UPLOAD_LIMITS_KEY, type LimitKey, type UploadLimitsView } from "../data/schema";
import { saveUploadLimits } from "../data/settings-api";
import { buildPayload, isDirty, LIMIT_KEYS, toFormValues, type FormErrors, type FormValues } from "../logic/upload-limits-form";

const FIELDS: Record<LimitKey, { label: string; unit: string; help: string }> = {
  maxMb: {
    label: "Max file size",
    unit: "MB",
    help: "Per image, after the couple's browser converts it to WebP. The API holds each upload in memory, so raise this carefully.",
  },
  maxPerCouple: { label: "Images per couple", unit: "images", help: "Size of each couple's image library." },
  maxDimension: { label: "Max image size", unit: "px", help: "Longest side. WebP cannot go above 16383." },
};

/** Loads the saved limits, then mounts the form; the key remounts it with fresh values after a save. */
export function UploadLimitsCard() {
  const { data, error, loading } = useApiQuery<UploadLimitsView>(UPLOAD_LIMITS_KEY);
  if (error) return <p className="text-destructive">{error}</p>;
  if (loading || !data) return <Skeleton className="h-80 w-full max-w-2xl" />;
  return <UploadLimitsForm key={JSON.stringify(data.overrides)} data={data} />;
}

function UploadLimitsForm({ data }: { data: UploadLimitsView }) {
  const [values, setValues] = useState<FormValues>(() => toFormValues(data.overrides));
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  async function submit(next: FormValues) {
    const built = buildPayload(next, data.ranges);
    if (!built.ok) {
      setErrors(built.errors);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const saved = await saveUploadLimits(built.payload);
      await mutate(UPLOAD_LIMITS_KEY, saved, { revalidate: false });
      toast.success("Upload limits saved");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save the limits");
    } finally {
      setSaving(false);
    }
  }

  const dirty = isDirty(values, data.overrides);
  const hasOverrides = Object.keys(data.overrides).length > 0;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Image uploads</CardTitle>
        <CardDescription>
          Limits for the couple image library. Leave a field blank to use the server default. Changes reach couples within
          about a minute.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {LIMIT_KEYS.map((key) => {
          const f = FIELDS[key];
          const { min, max } = data.ranges[key];
          return (
            <div key={key} className="flex flex-col gap-1.5">
              <Label htmlFor={`limit-${key}`}>{f.label}</Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`limit-${key}`}
                  inputMode="numeric"
                  className="max-w-40"
                  placeholder={String(data.defaults[key])}
                  value={values[key]}
                  min={min}
                  max={max}
                  aria-invalid={!!errors[key]}
                  aria-describedby={`limit-${key}-help`}
                  onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                />
                <span className="text-sm text-muted-foreground">{f.unit}</span>
                <span className="text-sm text-muted-foreground">
                  · now {data.effective[key]}
                  {data.overrides[key] === undefined ? " (default)" : ""}
                </span>
              </div>
              <p id={`limit-${key}-help`} className={errors[key] ? "text-sm text-destructive" : "text-xs text-muted-foreground"}>
                {errors[key] ?? f.help}
              </p>
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="gap-2">
        <Button onClick={() => submit(values)} disabled={saving || !dirty}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
        <Button
          variant="outline"
          disabled={saving || !hasOverrides}
          onClick={() => submit({ maxMb: "", maxPerCouple: "", maxDimension: "" })}
        >
          Reset to defaults
        </Button>
      </CardFooter>
    </Card>
  );
}
