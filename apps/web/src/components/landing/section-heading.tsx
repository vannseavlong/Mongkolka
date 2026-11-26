import type { ReactNode } from "react";
import { Reveal } from "./reveal";

/** Eyebrow + serif title + intro, used by every landing section so they stay consistent. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  action?: ReactNode;
}) {
  const centered = align === "center";
  return (
    <Reveal
      className={`mb-10 flex flex-col gap-4 sm:mb-14 ${
        centered ? "items-center text-center" : "items-start sm:flex-row sm:items-end sm:justify-between"
      }`}
    >
      <div className={centered ? "max-w-2xl" : "max-w-xl"}>
        <p className="mb-3 text-xs font-medium tracking-[0.22em] text-brand-gold uppercase">{eyebrow}</p>
        <h2 className="font-display text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {description && <p className="mt-4 text-base text-muted-foreground sm:text-lg">{description}</p>}
      </div>
      {action}
    </Reveal>
  );
}
