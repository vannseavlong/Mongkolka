import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { FEATURES } from "./content";

export function Features() {
  return (
    <section id="features" className="px-5 py-20 sm:px-12 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Why Mongkolka"
          title="Everything you need, in one wedding platform"
          description="Planning tools, a beautiful website and trusted vendors, all working together."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.07} className="h-full">
              <div className="group h-full rounded-3xl border bg-card p-7 transition duration-300 hover:-translate-y-1.5 hover:border-brand-line hover:shadow-xl hover:shadow-primary/10">
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-brand-tint transition-colors group-hover:bg-primary">
                  <feature.icon className="size-5 text-primary transition-colors group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-display mb-2 text-xl font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
