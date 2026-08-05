"use client";

import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { Button } from "@mongkolka/ui/button";

const COUPLE_URL = process.env.NEXT_PUBLIC_COUPLE_URL ?? "http://localhost:3002";
const VENDOR_URL = process.env.NEXT_PUBLIC_VENDOR_URL ?? "http://localhost:3003";

export function FinalCta() {
  return (
    <section className="bg-gradient-to-r from-primary to-accent px-6 py-16 text-primary-foreground sm:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center"
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-primary-foreground/15">
          <Heart className="size-6" />
        </div>
        <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
          Ready to start planning your wedding?
        </h2>
        <p className="max-w-xl text-primary-foreground/90">
          Join couples across Cambodia planning their wedding — and sharing a website their guests
          will love.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button size="lg" variant="secondary" asChild>
              <a href={COUPLE_URL}>Start planning for free</a>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <a href={VENDOR_URL}>List your business</a>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
