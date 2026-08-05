"use client";

import { motion } from "motion/react";
import { Star, Users } from "lucide-react";
import { Card, CardContent } from "@mongkolka/ui/card";

const TESTIMONIALS = [
  {
    quote:
      "Planning felt overwhelming until we found Mongkolka. The checklist and budget tracker kept us on track from day one.",
    name: "Sophea & Dara",
  },
  {
    quote:
      "Our wedding website was ready in an afternoon, and it looked exactly how we imagined — guests loved the RSVP page.",
    name: "Chenda & Vibol",
  },
  {
    quote:
      "We found our photographer through the marketplace and booked within a week. So much easier than searching around.",
    name: "Srey Leak & Panha",
  },
];

export function Testimonials() {
  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center text-2xl font-medium tracking-tight sm:text-3xl"
        >
          What couples say
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-4 pt-6">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="flex-1 text-muted-foreground italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                      <Users className="size-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{testimonial.name}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
