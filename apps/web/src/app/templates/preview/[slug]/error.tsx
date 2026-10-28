"use client";

export default function TemplatePreviewError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-medium">This preview is unavailable right now</h1>
      <p className="text-muted-foreground">We couldn&apos;t load the template. Please try again in a moment.</p>
      <button type="button" onClick={reset} className="rounded-full border px-4 py-2 text-sm hover:bg-accent">
        Try again
      </button>
    </main>
  );
}
