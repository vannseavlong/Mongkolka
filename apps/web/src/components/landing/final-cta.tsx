import { Heart } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { ImageWithFallback } from "@mongkolka/ui/figma/ImageWithFallback";
import { COUPLE_URL, VENDOR_URL } from "@/lib/app-urls";
import { Reveal } from "./reveal";
import { IMAGES, photo } from "./content";

export function FinalCta() {
  return (
    <section className="px-5 pb-20 sm:px-12 sm:pb-28">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] text-primary-foreground sm:rounded-[2.5rem]">
        <ImageWithFallback
          src={photo(IMAGES.ctaBackdrop, 1600)}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-deep/80" />

        <div className="relative flex flex-col items-center gap-6 px-6 py-16 text-center sm:px-12 sm:py-24">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary-foreground/15">
            <Heart className="size-6 text-brand-gold" />
          </div>
          <h2 className="font-display max-w-2xl text-3xl leading-tight font-medium text-balance sm:text-5xl">
            Ready to start planning your wedding?
          </h2>
          <p className="max-w-xl text-primary-foreground/85 sm:text-lg">
            Join couples across Cambodia planning their wedding, and sharing a website their guests will love.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button size="lg" variant="secondary" asChild className="h-12 px-7 text-base">
              <a href={COUPLE_URL}>Start planning for free</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 border-primary-foreground/40 bg-transparent px-7 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <a href={VENDOR_URL}>List your business</a>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
