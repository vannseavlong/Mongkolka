import { ImageWithFallback } from "@mongkolka/ui/figma/ImageWithFallback";
import { Reveal } from "./reveal";
import { SHOWCASE, photo } from "./content";

/** Photo mosaic that sets the mood between the feature and template sections. */
export function Showcase() {
  return (
    <section className="px-5 pb-20 sm:px-12 sm:pb-28">
      <Reveal className="mx-auto grid max-w-6xl auto-rows-[10rem] grid-cols-2 gap-3 sm:auto-rows-[14rem] sm:gap-5 md:grid-flow-dense md:grid-cols-4">
        {SHOWCASE.map((item) => (
          <div key={item.id} className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl ${item.span}`}>
            <ImageWithFallback
              src={photo(item.id, 700)}
              alt={item.alt}
              loading="lazy"
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        ))}
      </Reveal>
    </section>
  );
}
