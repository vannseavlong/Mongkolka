"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Heart, Sparkles, Star } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { ImageWithFallback } from "@mongkolka/ui/figma/ImageWithFallback";
import { COUPLE_URL, VENDOR_URL } from "@/lib/app-urls";
import { IMAGES, photo } from "./content";

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
  });

  return (
    <section className="bg-brand-glow relative overflow-hidden px-5 pt-8 pb-20 sm:px-12 sm:pt-14 sm:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div className="text-center lg:text-left">
          <motion.div
            {...rise(0)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-line bg-card/70 px-4 py-1.5 backdrop-blur"
          >
            <Sparkles className="size-4 text-brand-gold" />
            <span className="text-xs font-medium tracking-wide sm:text-sm">Wedding planning, made for Cambodia</span>
          </motion.div>

          <motion.h1
            {...rise(0.08)}
            className="font-display mb-6 text-[2.6rem] leading-[1.05] font-medium tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Plan your wedding, then share a website{" "}
            <span className="text-gradient-brand italic">your guests will love.</span>
          </motion.h1>

          <motion.p {...rise(0.16)} className="mx-auto mb-9 max-w-xl text-base text-muted-foreground sm:text-lg lg:mx-0">
            Guests, budget, checklist and a fully customisable wedding website, all in one place for couples in
            Cambodia.
          </motion.p>

          <motion.div {...rise(0.24)} className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button size="lg" asChild className="h-12 px-7 text-base shadow-lg shadow-primary/25">
              <a href={COUPLE_URL}>
                Start planning for free
                <Heart className="size-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 bg-card/60 px-7 text-base">
              <a href={VENDOR_URL}>
                List your business
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </motion.div>

          <motion.div {...rise(0.32)} className="mt-8 flex items-center justify-center gap-3 lg:justify-start">
            <div className="flex -space-x-2">
              {[IMAGES.heroSide, IMAGES.heroRings, IMAGES.photography].map((id) => (
                <ImageWithFallback
                  key={id}
                  src={photo(id, 120)}
                  alt=""
                  className="size-9 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <div className="text-left text-sm">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-brand-gold text-brand-gold" />
                ))}
              </div>
              <span className="text-muted-foreground">Loved by couples across Cambodia</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none"
        >
          {/* Arch-shaped hero photo with a gold outline offset behind it. */}
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-[999px] rounded-b-3xl border border-brand-line sm:translate-x-5 sm:translate-y-5" />
          <div className="relative overflow-hidden rounded-t-[999px] rounded-b-3xl shadow-2xl">
            <ImageWithFallback
              src={photo(IMAGES.heroMain, 1200)}
              alt="A couple kissing as petals fall around them"
              className="aspect-[4/5] w-full object-cover"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/35 via-transparent to-transparent" />
          </div>

          <div className="animate-drift absolute -bottom-6 -left-3 hidden w-40 overflow-hidden rounded-2xl border-4 border-background shadow-xl sm:block lg:-left-10 lg:w-44">
            <ImageWithFallback
              src={photo(IMAGES.heroRings, 700)}
              alt="Two hands with wedding rings"
              className="aspect-square w-full object-cover"
            />
          </div>

          <motion.div
            animate={reduce ? undefined : { y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -right-2 bottom-10 rounded-2xl border bg-card/95 p-3.5 shadow-xl backdrop-blur sm:-right-6 sm:p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-brand-tint">
                <Heart className="size-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">RSVP received</div>
                <div className="text-xs text-muted-foreground">Sokha + 2 guests</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
