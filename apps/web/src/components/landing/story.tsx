import { Check } from "lucide-react";
import { ImageWithFallback } from "@mongkolka/ui/figma/ImageWithFallback";
import { Reveal } from "./reveal";
import { IMAGES, STORY_POINTS, photo } from "./content";

export function Story() {
  return (
    <section id="about" className="px-5 py-20 sm:px-12 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative order-2 lg:order-1">
          <ImageWithFallback
            src={photo(IMAGES.story, 1200)}
            alt="A couple on their wedding day, smiling"
            className="aspect-[5/4] w-full rounded-3xl object-cover shadow-xl"
          />
          <div className="absolute -right-2 -bottom-5 max-w-[14rem] rounded-2xl border bg-card p-4 shadow-lg sm:-right-6">
            <p className="font-display text-lg leading-snug italic">&ldquo;Joyful, not overwhelming.&rdquo;</p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="order-1 lg:order-2">
          <p className="mb-3 text-xs font-medium tracking-[0.22em] text-brand-gold uppercase">About Mongkolka</p>
          <h2 className="font-display mb-5 text-3xl leading-tight font-medium text-balance sm:text-4xl lg:text-5xl">
            Planning a wedding should feel like a celebration
          </h2>
          <p className="mb-7 text-base text-muted-foreground sm:text-lg">
            Mongkolka helps couples in Cambodia plan their wedding and share a beautiful website with their guests,
            and helps local wedding vendors get discovered. We keep the tools simple so you can focus on the day.
          </p>
          <ul className="space-y-3">
            {STORY_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-tint">
                  <Check className="size-3.5 text-primary" />
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
