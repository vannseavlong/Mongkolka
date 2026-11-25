import { Suspense } from "react";
import { Storage } from "@/features/storage";

export default function Page() {
  // useSearchParams (the ?drive= result) needs a Suspense boundary in the App Router.
  return (
    <Suspense>
      <Storage />
    </Suspense>
  );
}
