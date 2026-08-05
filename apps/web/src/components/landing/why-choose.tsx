"use client";

import { motion } from "motion/react";
import { LayoutTemplate, Palette, PenLine, Store, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@mongkolka/ui/card";

const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: PenLine,
    title: "Smart planning tools",
    description: "Guests, budget, checklist, and countdown milestones — shared with your partner.",
  },
  {
    icon: Palette,
    title: "Digital wedding websites",
    description: "Pick a template, adjust the colors, and share your story with the people you love.",
  },
  {
    icon: Store,
    title: "Vendor marketplace",
    description: "Discover photographers, venues, salons, and more — trusted vendors for your big day.",
  },
  {
    icon: LayoutTemplate,
    title: "Flexible templates",
    description: "Every section is customizable, so your website looks exactly the way you want it to.",
  },
];

export function WhyChoose() {
  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">Why choose Mongkolka</h2>
          <p className="mt-2 text-muted-foreground">Everything you need, in one wedding platform.</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="h-full"
            >
              <Card className="h-full text-center">
                <CardContent className="flex h-full flex-col items-center gap-3 pt-6">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <feature.icon className="size-5 text-primary" />
                  </div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
