"use client";

import { motion } from "motion/react";

export function About() {
  return (
    <section className="px-6 py-20 sm:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-center"
      >
        <h2 className="mb-4 text-2xl font-medium tracking-tight sm:text-3xl">About Mongkolka</h2>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Mongkolka helps couples in Cambodia plan their wedding and share a beautiful website with
          their guests — and helps local wedding vendors get discovered. Planning a wedding should
          be joyful, not overwhelming, so we keep the tools simple and let you focus on the
          celebration.
        </p>
      </motion.div>
    </section>
  );
}
