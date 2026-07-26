import { Music2 } from "lucide-react";
import type { MusicContent, Theme } from "../../types";

export interface MusicClassicProps {
  theme: Theme;
  content?: MusicContent;
}

export function MusicClassic({ theme, content }: MusicClassicProps) {
  if (!content?.playlistUrl) return null;

  return (
    <section
      className="mx-auto max-w-lg px-6 py-20 text-center"
      style={{
        backgroundColor: theme.bg_color,
        color: theme.text_color,
        fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
      }}
    >
      <Music2 className="mx-auto mb-4 size-8" style={{ color: theme.accent_color }} />
      <h2 className="mb-6 text-2xl font-medium" style={{ color: theme.accent_color }}>
        Our Playlist
      </h2>
      <a
        href={content.playlistUrl}
        target="_blank"
        rel="noreferrer"
        className="rounded-md border px-4 py-3 font-medium hover:opacity-80"
        style={{ borderColor: theme.accent_color, color: theme.accent_color }}
      >
        Listen along
      </a>
    </section>
  );
}
