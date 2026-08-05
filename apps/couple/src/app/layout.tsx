import type { Metadata } from "next";
import { Toaster } from "@mongkolka/ui/sonner";
import "./globals.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const metadata: Metadata = {
  title: "Mongkolka Couple",
  description: "Mongkolka couple portal",
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
    const res = await fetch(`${API_URL}/public/api/active-theme?app=couple`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as ActiveThemeResponse;
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
        <Toaster />
      </body>
    </html>
  );
}
