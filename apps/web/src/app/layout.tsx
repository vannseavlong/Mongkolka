import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Serif_Khmer, Jost, Great_Vibes, Moul, Battambang, Cinzel, Fredoka, Moulpali, Koulen, Siemreap, Kantumruy_Pro, Playfair_Display, Dancing_Script, Parisienne } from "next/font/google";
import "./globals.css";
import { fetchJson } from "@/lib/api";

// Display/label fonts for the "Ink & Gold" template pack (packages/templates/src/
// sections/ink/shared.tsx reads these CSS variables, falling back to Georgia/Arial).
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});
const khmer = Noto_Serif_Khmer({ subsets: ["khmer"], variable: "--font-khmer", display: "swap" });
const label = Jost({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-label", display: "swap" });
// Script font for couple names in the "Grace" pack (Latin only; Khmer names use --font-khmer).
const script = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-script", display: "swap" });

// Khmer e-invitation templates (packages/templates/src/chrome/fonts.ts reads these variables).
// preload is off for all four: a face is only downloaded by a page whose text actually uses it,
// so the rounded kids face (Fredoka) costs nothing on a wedding template.
const moul = Moul({ subsets: ["khmer", "latin"], weight: "400", variable: "--font-moul", display: "swap", preload: false });
const battambang = Battambang({ subsets: ["khmer", "latin"], weight: ["300", "400", "700"], variable: "--font-battambang", display: "swap", preload: false });
const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-cinzel", display: "swap", preload: false });
const rounded = Fredoka({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-rounded", display: "swap", preload: false });

// Extra faces a couple can pick (packages/templates/src/site-fonts.tsx). preload off: only the chosen ones download.
const moulpali = Moulpali({ subsets: ["khmer", "latin"], weight: "400", variable: "--face-moulpali", display: "swap", preload: false });
const koulen = Koulen({ subsets: ["khmer", "latin"], weight: "400", variable: "--face-koulen", display: "swap", preload: false });
const siemreap = Siemreap({ subsets: ["khmer"], weight: "400", variable: "--face-siemreap", display: "swap", preload: false });
const kantumruy = Kantumruy_Pro({ subsets: ["khmer", "latin"], variable: "--face-kantumruy", display: "swap", preload: false });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--face-playfair", display: "swap", preload: false });
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--face-dancing", display: "swap", preload: false });
const parisienne = Parisienne({ subsets: ["latin"], weight: "400", variable: "--face-parisienne", display: "swap", preload: false });

const SITE_URL = "https://mongkolka.web.app";
const SITE_DESCRIPTION = "Plan your wedding and share a beautiful website with your guests.";

// og:image / twitter:image come from the opengraph-image.png and twitter-image.png files in this folder;
// metadataBase turns their paths into absolute URLs, which social crawlers require.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Mongkolka",
  description: SITE_DESCRIPTION,
  applicationName: "Mongkolka",
  openGraph: {
    type: "website",
    siteName: "Mongkolka",
    title: "Mongkolka — Wedding websites, made beautiful",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Mongkolka — Wedding websites, made beautiful",
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#3B82F6",
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
  input: string;
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
      <body
        className={`${display.variable} ${khmer.variable} ${label.variable} ${script.variable} ${moul.variable} ${battambang.variable} ${cinzel.variable} ${rounded.variable} ${moulpali.variable} ${koulen.variable} ${siemreap.variable} ${kantumruy.variable} ${playfair.variable} ${dancing.variable} ${parisienne.variable}`}
      >
        {themeStyle && <style>{themeStyle}</style>}
        {children}
      </body>
    </html>
  );
}
