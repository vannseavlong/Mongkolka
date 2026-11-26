import { cn } from "../ui/utils";

/** Mongkolka logo (the app's /icon.svg). Pass sizing/rounding through className. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <img src="/icon.svg" alt="" aria-hidden className={cn("size-7 shrink-0 rounded-md", className)} />
  );
}
