import type { Metadata } from "next";
import "./globals.css";
import { fetchJson } from "@/lib/api";

export const metadata: Metadata = {
  title: "Mongkolka",
  description: "Plan your wedding and share a beautiful website with your guests.",
};

type ActiveThemeTokens = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  inputBackground: string;
  ring: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

type ActiveThemeResponse = {
  theme_id: string;
  name: string;
  tokens: ActiveThemeTokens;
};

function buildThemeStyle(tokens: ActiveThemeTokens): string {
  const declarations = Object.entries(tokens)
    .map(([key, value]) => `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};`)
    .join(" ");
  return `:root { ${declarations} }`;
}

async function getActiveThemeStyle(): Promise<string | null> {
  try {
    const data = await fetchJson<ActiveThemeResponse>("/public/api/active-theme?app=web", {
      next: { revalidate: 60 },
    });
    if (!data) return null;
    return buildThemeStyle(data.tokens);
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeStyle = await getActiveThemeStyle();

  return (
    <html lang="en">
      <body>
        {themeStyle && <style>{themeStyle}</style>}
        {children}
      </body>
    </html>
  );
}
