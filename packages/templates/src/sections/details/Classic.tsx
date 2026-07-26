import type { DetailsContent, Theme } from "../../types";

export interface DetailsClassicProps {
  theme: Theme;
  content?: DetailsContent;
}

function Card({
  title,
  time,
  venue,
  address,
  theme,
}: {
  title: string;
  time?: string;
  venue?: string;
  address?: string;
  theme: Theme;
}) {
  if (!time && !venue && !address) return null;
  return (
    <div className="rounded-md border p-6 text-center" style={{ borderColor: theme.accent_color }}>
      <h3 className="mb-2 text-lg font-medium" style={{ color: theme.accent_color }}>
        {title}
      </h3>
      {time && <p className="opacity-90">{time}</p>}
      {venue && <p className="opacity-90">{venue}</p>}
      {address && <p className="text-sm opacity-70">{address}</p>}
    </div>
  );
}

export function DetailsClassic({ theme, content }: DetailsClassicProps) {
  return (
    <section
      className="px-6 py-20"
      style={{
        backgroundColor: theme.bg_color,
        color: theme.text_color,
        fontFamily: theme.font_style === "serif" ? "serif" : "sans-serif",
      }}
    >
      <h2 className="mb-8 text-center text-2xl font-medium" style={{ color: theme.accent_color }}>
        Event Details
      </h2>
      <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
        <Card
          title="Ceremony"
          time={content?.ceremonyTime}
          venue={content?.ceremonyVenue}
          address={content?.ceremonyAddress}
          theme={theme}
        />
        <Card
          title="Reception"
          time={content?.receptionTime}
          venue={content?.receptionVenue}
          address={content?.receptionAddress}
          theme={theme}
        />
      </div>
      {content?.dressCode && (
        <p className="mt-8 text-center text-sm opacity-80">Dress code: {content.dressCode}</p>
      )}
    </section>
  );
}
