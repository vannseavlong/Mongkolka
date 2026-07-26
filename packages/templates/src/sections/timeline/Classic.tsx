import type { Theme, TimelineContent } from "../../types";

export interface TimelineClassicProps {
  theme: Theme;
  content?: TimelineContent;
}

export function TimelineClassic({ theme, content }: TimelineClassicProps) {
  const chapters = content?.chapters ?? [];
  if (chapters.length === 0) return null;

  return (
    <section
      className="mx-auto max-w-2xl px-6 py-20"
      style={{
        backgroundColor: theme.bg_color,
        color: theme.text_color,
        fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
      }}
    >
      <h2 className="mb-10 text-center text-2xl font-medium" style={{ color: theme.accent_color }}>
        Our Journey
      </h2>
      <div className="flex flex-col gap-8">
        {chapters.map((chapter, i) => (
          <div key={i} className="flex gap-4">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: theme.accent_color }}
            >
              {chapter.year}
            </div>
            <div>
              <h3 className="font-medium">{chapter.title}</h3>
              <p className="opacity-80">{chapter.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
