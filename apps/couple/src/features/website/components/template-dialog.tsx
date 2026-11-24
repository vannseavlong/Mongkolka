"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@mongkolka/ui/dialog";
import type { SiteTemplate } from "../data/schema";
import { TemplatePicker } from "./template-picker";

/** Template gallery in a dialog, so it no longer pushes the editor down the page. */
export function TemplateDialog({
  open,
  onOpenChange,
  templates,
  selectedTemplateId,
  templatesLoading,
  settingsError,
  onRetry,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: SiteTemplate[];
  selectedTemplateId: string | null | undefined;
  templatesLoading: boolean;
  settingsError: string | null;
  onRetry: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Choose a template</DialogTitle>
          <DialogDescription>Switching keeps your details. You can change colors any time.</DialogDescription>
        </DialogHeader>
        <TemplatePicker
          templates={templates}
          selectedTemplateId={selectedTemplateId}
          templatesLoading={templatesLoading}
          settingsError={settingsError}
          onRetry={onRetry}
        />
      </DialogContent>
    </Dialog>
  );
}
