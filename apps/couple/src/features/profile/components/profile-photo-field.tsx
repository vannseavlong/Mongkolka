"use client";

import { useRef, useState } from "react";
import { ImageOff, ImagePlus } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { cn } from "@mongkolka/ui/utils";
import { AssetPicker } from "@/features/website/components/asset-picker";

interface ProfilePhotoFieldProps {
  label: string;
  hint?: string;
  value: string | null;
  onChange: (url: string | null) => void;
  /** `arch` is the cover's arched frame (3:4); `wide` is a 4:3 venue picture. */
  shape: "arch" | "wide";
}

/**
 * A photo chosen from the couple's image library (the picker also uploads). The preview is only a click target
 * for the mouse; the buttons below are the one keyboard and screen reader path.
 */
export function ProfilePhotoField({ label, hint, value, onChange, shape }: ProfilePhotoFieldProps) {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const frame = shape === "arch" ? "aspect-[3/4] rounded-t-full rounded-b-md" : "aspect-[4/3] rounded-md";
  const labelId = `${shape}-photo-label`;

  return (
    <div role="group" aria-labelledby={labelId} className="flex flex-col gap-2">
      <p id={labelId} className="text-sm font-medium">
        {label}
      </p>
      <div
        onClick={() => setOpen(true)}
        className={cn(
          "flex w-full cursor-pointer items-center justify-center overflow-hidden border bg-muted text-muted-foreground transition-colors hover:border-foreground/40",
          frame,
          !value && "border-dashed",
        )}
      >
        {value ? <Preview key={value} url={value} /> : <Empty icon={<ImagePlus className="size-6" aria-hidden />} text="Add a photo" />}
      </div>
      <p className="sr-only">{value ? "A photo is set." : "No photo yet."}</p>
      <div className="flex flex-wrap gap-2">
        <Button ref={opener} type="button" size="sm" variant="outline" onClick={() => setOpen(true)}>
          {value ? "Change photo" : "Choose or upload"}
        </Button>
        {value && (
          <Button type="button" size="sm" variant="ghost" onClick={() => onChange(null)}>
            Remove
          </Button>
        )}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <AssetPicker
        open={open}
        onOpenChange={setOpen}
        multiple={false}
        title={`Choose ${label.toLowerCase()}`}
        returnFocusRef={opener}
        onConfirm={([url]) => url && onChange(url)}
      />
    </div>
  );
}

function Empty({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="flex flex-col items-center gap-1 px-3 text-center text-xs">
      {icon}
      {text}
    </span>
  );
}

/** Keyed by URL, so a new photo gets a fresh chance to load after an earlier one failed. */
function Preview({ url }: { url: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <Empty icon={<ImageOff className="size-6" aria-hidden />} text="This photo is no longer available. Choose another." />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" onError={() => setFailed(true)} className="size-full object-cover" />;
}
