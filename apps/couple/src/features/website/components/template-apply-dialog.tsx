"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@mongkolka/ui/dialog";
import { Label } from "@mongkolka/ui/label";
import { RadioGroup, RadioGroupItem } from "@mongkolka/ui/radio-group";

export type ApplyMode = "keep_content" | "reset_all";

const OPTIONS: { value: ApplyMode; title: string; body: string }[] = [
  {
    value: "keep_content",
    title: "Keep my text and photos, reset styles",
    body: "Your words, photos and which sections are on stay. Colors and section styles go back to the new template.",
  },
  {
    value: "reset_all",
    title: "Start fresh",
    body: "Also clears the text and photos you added to each section. Which sections are on and their order stay.",
  },
];

export function TemplateApplyDialog({
  templateName,
  pending,
  onCancel,
  onConfirm,
}: {
  templateName: string;
  pending: boolean;
  onCancel: () => void;
  onConfirm: (mode: ApplyMode) => void;
}) {
  const [mode, setMode] = useState<ApplyMode>("keep_content");

  return (
    <Dialog open onOpenChange={(open) => !open && !pending && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Switch to {templateName}?</DialogTitle>
          <DialogDescription>
            Your colors and section styles will be replaced by the new template. Choose what happens to your content.
          </DialogDescription>
        </DialogHeader>
        <RadioGroup value={mode} onValueChange={(v) => setMode(v as ApplyMode)} aria-label="What to keep">
          {OPTIONS.map((o) => (
            <div key={o.value} className="flex items-start gap-3 rounded-md border p-3">
              <RadioGroupItem value={o.value} id={`apply-${o.value}`} className="mt-1" />
              <Label htmlFor={`apply-${o.value}`} className="flex flex-col items-start gap-1 font-normal">
                <span className="font-medium">{o.title}</span>
                <span className="text-sm text-muted-foreground">{o.body}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
        <DialogFooter>
          <Button variant="outline" aria-disabled={pending} onClick={() => !pending && onCancel()}>
            Cancel
          </Button>
          <Button aria-disabled={pending} onClick={() => !pending && onConfirm(mode)}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            Apply template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
