import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@mongkolka/ui/accordion";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { FAQS } from "./content";

export function Faq() {
  return (
    <section className="px-5 py-20 sm:px-12 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="Questions" title="Good to know" />
        <Reveal>
          <Accordion type="single" collapsible className="rounded-3xl border bg-card px-6">
            {FAQS.map((item, index) => (
              <AccordionItem key={item.q} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-base">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
