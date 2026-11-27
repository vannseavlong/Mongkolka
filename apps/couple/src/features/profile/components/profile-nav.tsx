import { PROFILE_SECTIONS } from "../lib/profile-form";

/** Jump links to each section. Desktop only: on a phone the page is one short column. */
export function ProfileNav() {
  return (
    <nav aria-label="Profile sections" className="sticky top-[calc(5rem+var(--assist-banner,0px))] hidden w-44 shrink-0 self-start lg:block">
      <ul className="flex flex-col gap-1 border-l text-sm">
        {PROFILE_SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="-ml-px block border-l border-transparent px-3 py-1.5 text-muted-foreground hover:border-foreground/40 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
