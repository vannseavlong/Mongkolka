import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { STEPS } from "./content";

export function HowItWorks() {
  return (
    <section className="bg-brand-deep px-5 py-20 text-primary-foreground sm:px-12 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="[&_p]:text-primary-foreground/75 [&_p:first-child]:text-brand-gold">
          <SectionHeading
            eyebrow="How it works"
            title="From “we're engaged” to “see you there”"
            description="Three simple steps. No spreadsheets, no group-chat chaos."
          />
        </div>

        <ol className="relative grid gap-6 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.1}>
              <li className="h-full rounded-3xl border border-primary-foreground/15 bg-primary-foreground/5 p-7 backdrop-blur-sm">
                <span className="font-display mb-4 block text-5xl leading-none text-brand-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mb-2 text-2xl font-medium">{step.title}</h3>
                <p className="text-primary-foreground/75">{step.description}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
