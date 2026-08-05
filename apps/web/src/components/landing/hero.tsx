"use client";

import { motion } from "motion/react";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { Button } from "@mongkolka/ui/button";
import { ImageWithFallback } from "@mongkolka/ui/figma/ImageWithFallback";

const COUPLE_URL = process.env.NEXT_PUBLIC_COUPLE_URL ?? "http://localhost:3002";
const VENDOR_URL = process.env.NEXT_PUBLIC_VENDOR_URL ?? "http://localhost:3003";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-20 sm:px-12 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: "spring" }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2"
          >
            <Sparkles className="size-4 text-primary" />
            <span className="text-sm font-medium">Wedding planning, made for Cambodia</span>
          </motion.div>

          <h1 className="text-gradient-brand mb-6 text-4xl font-medium tracking-tight sm:text-5xl">
            Plan your wedding, then share a website your guests will love.
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground lg:mx-0">
            Guests, budget, checklist, and a fully customizable wedding website — all in one place
            for couples in Cambodia.
          </p>

          <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Button size="lg" asChild>
                <a href={COUPLE_URL}>
                  Start planning for free
                  <Heart className="size-4" />
                </a>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Button size="lg" variant="outline" asChild>
                <a href={VENDOR_URL}>
                  List your business
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="animate-float absolute -top-4 -left-4 z-10 hidden sm:block">
            <Sparkles className="animate-sparkle size-8 text-primary/60" />
          </div>

          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
              alt="A couple celebrating their wedding day"
              className="h-[420px] w-full object-cover sm:h-[500px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute -right-4 -bottom-6 rounded-2xl border bg-card p-5 shadow-xl sm:-right-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-primary/10">
                <Heart className="size-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Guests love it</div>
                <div className="text-sm text-muted-foreground">Beautiful, shareable websites</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
