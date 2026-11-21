import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function PageMessage({ title, body, withChrome = true }: { title: string; body?: string; withChrome?: boolean }) {
  const content = (
    <section className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-24 text-center">
      <h1 className="text-xl font-medium">{title}</h1>
      {body && <p className="text-muted-foreground">{body}</p>}
      <Link href="/" className="mt-2 text-sm underline underline-offset-4">
        Back to home
      </Link>
    </section>
  );
  if (!withChrome) return <main className="flex min-h-screen flex-col">{content}</main>;
  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />
      {content}
      <SiteFooter />
    </main>
  );
}

export function PageLoading({ withChrome = true }: { withChrome?: boolean }) {
  const content = <div className="flex flex-1 items-center justify-center py-24 text-sm text-muted-foreground">Loading…</div>;
  if (!withChrome) return <main className="flex min-h-screen flex-col">{content}</main>;
  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />
      {content}
      <SiteFooter />
    </main>
  );
}
