import { Button } from "@mongkolka/ui/button";
import { HeaderContent } from "@/components/layout/header-slot";

interface ProfileSaveBarProps {
  formId: string;
  dirty: boolean;
  saving: boolean;
  onDiscard: () => void;
}

/** Title and save controls, shown in the app header. */
export function ProfileSaveBar({ formId, dirty, saving, onDiscard }: ProfileSaveBarProps) {
  return (
    <HeaderContent>
      <h1 className="text-lg font-semibold tracking-tight">Profile</h1>
      <div className="ml-auto flex shrink-0 items-center gap-3">
        <p className="text-muted-foreground text-sm max-md:hidden" aria-live="polite">
          {dirty ? "You have unsaved changes." : "All changes saved."}
        </p>
        <Button type="button" variant="ghost" disabled={!dirty || saving} onClick={onDiscard}>
          Discard
        </Button>
        <Button type="submit" form={formId} disabled={!dirty || saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </HeaderContent>
  );
}
