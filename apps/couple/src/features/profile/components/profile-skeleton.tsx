import { Skeleton } from "@mongkolka/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="flex max-w-3xl flex-col gap-6" aria-busy="true" aria-label="Loading profile">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-xl border bg-card p-5">
          <Skeleton className="mb-4 h-5 w-40" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
