import { Star } from "lucide-react";
import { ImageWithFallback } from "@mongkolka/ui/figma/ImageWithFallback";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { TESTIMONIALS, photo } from "./content";

export function Testimonials() {
  return (
    <section className="bg-brand-wash px-5 py-20 sm:px-12 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Love notes" title="What couples say" />

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, index) => (
            <Reveal key={t.name} delay={index * 0.1} className="h-full">
              <figure className="flex h-full flex-col gap-5 rounded-3xl border bg-card p-7 shadow-sm">
                <div className="flex gap-1" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-brand-gold text-brand-gold" />
                  ))}
                </div>
                <blockquote className="font-display flex-1 text-xl leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <ImageWithFallback
                    src={photo(t.avatar, 120)}
                    alt=""
                    loading="lazy"
                    className="size-11 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.detail}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
