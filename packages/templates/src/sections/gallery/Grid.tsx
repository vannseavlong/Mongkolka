import type { GalleryContent, Theme } from "../../types";

export interface GalleryGridProps {
  theme: Theme;
  content?: GalleryContent;
  /** False for the 2nd and later layouts of a stacked gallery, so the heading shows once. */
  showHeading?: boolean;
}

export function GalleryGrid({ theme, content, showHeading = true }: GalleryGridProps) {
  const photos = content?.photos ?? [];
  if (photos.length === 0) return null;

  return (
    <section
      className={showHeading ? "px-6 py-20" : "px-6 pb-12"}
      style={{ backgroundColor: theme.bg_color, color: theme.text_color }}
    >
      {showHeading && (
        <h2
          className="mb-8 text-center text-2xl font-medium"
          style={{
            color: theme.accent_color,
            fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
          }}
        >
          Gallery
        </h2>
      )}
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((url) => (
          // Plain <img>, not next/image — see the note in sections/hero/Classic.tsx.
          <img key={url} src={url} alt="" className="aspect-square w-full rounded-md object-cover" />
        ))}
      </div>
    </section>
  );
}
