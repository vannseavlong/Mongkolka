import type { ReactNode } from "react";

/**
 * Split-screen auth chrome shared by the sign-in and register pages — a
 * branded panel on the wide viewport, the actual form content on the right.
 * Marketing copy is passed in per page rather than hardcoded here.
 */
export function AuthShell({
  headline,
  tagline,
  title,
  description,
  children,
  footer,
}: {
  headline: string;
  tagline: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -bottom-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        />
        <span className="relative text-lg font-semibold tracking-tight">Mongkolka</span>
        <div className="relative flex flex-col gap-3">
          <p className="text-xs font-medium tracking-[0.2em] text-primary-foreground/70 uppercase">{tagline}</p>
          <h2 className="max-w-sm text-3xl leading-tight font-semibold text-balance">{headline}</h2>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
          {footer}
        </div>
      </div>
    </main>
  );
}
