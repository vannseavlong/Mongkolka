import type { ReactNode } from "react";

/** One titled card of the profile page. `id` is the anchor the side navigation links to. */
export function ProfileSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 rounded-xl border bg-card">
      <div className="border-b px-5 py-4">
        <h2 id={`${id}-title`} className="font-semibold">
          {title}
        </h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
