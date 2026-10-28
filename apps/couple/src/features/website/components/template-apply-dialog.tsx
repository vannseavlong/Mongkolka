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
    body: "Your words, photos and which sections are on stay. Your saved colors and section styles go back to the new template.",
  },
  {
    value: "reset_all",
    title: "Start fresh",
    body: "Also clears the text and photos you added to each section, and your saved colors reset. Which sections are on and their order stay.",
  },
];

export function TemplateApplyDialog({
  templateName,
  pending,
  error,
  onCloseFocus,
  onCancel,
  onConfirm,
}: {
  templateName: string;
  pending: boolean;
  error: string | null;
  /** Where focus goes when the dialog closes (the card button that opened it). */
  onCloseFocus: () => void;
  onCancel: () => void;
  onConfirm: (mode: ApplyMode) => void;
}) {
  const [mode, setMode] = useState<ApplyMode>("keep_content");

  return (
    <Dialog open onOpenChange={(open) => !open && !pending && onCancel()}>
      <DialogContent
        className="max-h-[90dvh] overflow-y-auto"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          onCloseFocus();
        }}
      >
        <DialogHeader>
          <DialogTitle>Switch to {templateName}?</DialogTitle>
          <DialogDescription>
            Your saved colors and section styles will be replaced by the new template. Choose what happens to your
            content. This cannot be undone. If your site is published, it updates immediately.
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
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" aria-disabled={pending} onClick={() => !pending && onCancel()}>
            Cancel
          </Button>
          <Button aria-disabled={pending} onClick={() => !pending && onConfirm(mode)}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            {mode === "reset_all" ? "Clear content and apply" : "Apply template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
