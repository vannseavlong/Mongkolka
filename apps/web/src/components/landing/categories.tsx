import Link from "next/link";
import { ImageWithFallback } from "@mongkolka/ui/figma/ImageWithFallback";
import { Reveal } from "./reveal";
import { CATEGORIES, photo } from "./content";

export function Categories() {
  return (
    <div className="mb-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {CATEGORIES.map((category, index) => (
        <Reveal key={category.label} delay={index * 0.07}>
          <Link
            href="/marketplace"
            className="group relative block aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-3xl"
          >
            <ImageWithFallback
              src={photo(category.image, 700)}
              alt=""
              loading="lazy"
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/85 via-brand-deep/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-3 text-primary-foreground sm:p-5">
              <category.icon className="size-4 shrink-0 text-brand-gold sm:size-5" />
              <span className="font-display text-lg leading-tight sm:text-xl">{category.label}</span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
