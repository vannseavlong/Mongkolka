import { Gift } from "lucide-react";
import type { RegistryContent, Theme } from "../../types";

export interface RegistryClassicProps {
  theme: Theme;
  content?: RegistryContent;
}

export function RegistryClassic({ theme, content }: RegistryClassicProps) {
  const links = content?.links ?? [];
  if (links.length === 0) return null;

  return (
    <section
      className="mx-auto max-w-lg px-6 py-20 text-center"
      style={{
        backgroundColor: theme.bg_color,
        color: theme.text_color,
        fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
      }}
    >
      <Gift className="mx-auto mb-4 size-8" style={{ color: theme.accent_color }} />
      <h2 className="mb-6 text-2xl font-medium" style={{ color: theme.accent_color }}>
        Registry
      </h2>
      <div className="flex flex-col gap-3">
        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border px-4 py-3 font-medium hover:opacity-80"
            style={{ borderColor: theme.accent_color, color: theme.accent_color }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
