import { Button } from "@mongkolka/ui/button";
import { PageHeader } from "@mongkolka/ui/layout/page-header";

interface ProfileSaveBarProps {
  formId: string;
  dirty: boolean;
  saving: boolean;
  onDiscard: () => void;
}

/** Title and save controls, shown in the app header. */
export function ProfileSaveBar({ formId, dirty, saving, onDiscard }: ProfileSaveBarProps) {
  return (
    <PageHeader
      title="Profile"
      description="This is what appears on your website and invitations. Changes go live when you save."
      actions={
        <>
          <p className="text-muted-foreground text-sm max-lg:hidden" aria-live="polite">
            {dirty ? "You have unsaved changes." : "All changes saved."}
          </p>
          <Button type="button" variant="ghost" className="max-sm:px-2" disabled={!dirty || saving} onClick={onDiscard}>
            Discard
          </Button>
          <Button type="submit" form={formId} disabled={!dirty || saving}>
            {saving ? (
              "Saving…"
            ) : (
              <span>
                Save<span className="max-sm:sr-only">&nbsp;changes</span>
              </span>
            )}
          </Button>
        </>
      }
    />
  );
}
