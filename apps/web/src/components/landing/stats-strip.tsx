import { Reveal } from "./reveal";
import { STATS } from "./content";

export function StatsStrip() {
  return (
    <section className="border-y border-brand-line bg-brand-wash px-5 py-8 sm:px-12">
      <Reveal>
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-y-6 text-center lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="px-2">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-display text-3xl font-medium text-brand-deep sm:text-4xl">{stat.value}</dd>
              <p className="mt-1 text-xs tracking-wide text-muted-foreground sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
