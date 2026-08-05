import { z } from "zod";

// App-chrome color themes (admin/couple portal UI), NOT the couple's public
// wedding-site theme (see site-templates' default_theme for that). tokens
// mirrors packages/ui/src/styles/theme.css's [data-brand-theme] custom
// properties. All optional since a theme can be created before every token
// is filled in — see themes-action-dialog.tsx for the fallback/mirroring
// logic that fills in the gaps on submit.
export const themeTokensSchema = z.object({
  background: z.string().optional(),
  foreground: z.string().optional(),
  card: z.string().optional(),
  cardForeground: z.string().optional(),
  popover: z.string().optional(),
  popoverForeground: z.string().optional(),
  primary: z.string().optional(),
  primaryForeground: z.string().optional(),
  secondary: z.string().optional(),
  secondaryForeground: z.string().optional(),
  muted: z.string().optional(),
  mutedForeground: z.string().optional(),
  accent: z.string().optional(),
  accentForeground: z.string().optional(),
  border: z.string().optional(),
  inputBackground: z.string().optional(),
  ring: z.string().optional(),
  sidebar: z.string().optional(),
  sidebarForeground: z.string().optional(),
  sidebarPrimary: z.string().optional(),
  sidebarPrimaryForeground: z.string().optional(),
  sidebarAccent: z.string().optional(),
  sidebarAccentForeground: z.string().optional(),
  sidebarBorder: z.string().optional(),
  sidebarRing: z.string().optional(),
});

export type ThemeTokens = z.infer<typeof themeTokensSchema>;

export const themeSchema = z.object({
  theme_id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  tokens: themeTokensSchema,
  // Landing site (apps/web) and couple portal (apps/couple) can each have a
  // different active theme.
  is_active_web: z.boolean(),
  is_active_couple: z.boolean(),
  status: z.enum(["active", "inactive"]),
  _created_at: z.string().optional(),
});

export type Theme = z.infer<typeof themeSchema>;
