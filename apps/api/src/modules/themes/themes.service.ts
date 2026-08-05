import { ThemesModel } from "./themes.model.js";

export type ThemeScope = "web" | "couple";

export interface ThemeTokens {
  background?: string;
  foreground?: string;
  card?: string;
  cardForeground?: string;
  popover?: string;
  popoverForeground?: string;
  primary?: string;
  primaryForeground?: string;
  secondary?: string;
  secondaryForeground?: string;
  muted?: string;
  mutedForeground?: string;
  accent?: string;
  accentForeground?: string;
  border?: string;
  inputBackground?: string;
  ring?: string;
  sidebar?: string;
  sidebarForeground?: string;
  sidebarPrimary?: string;
  sidebarPrimaryForeground?: string;
  sidebarAccent?: string;
  sidebarAccentForeground?: string;
  sidebarBorder?: string;
  sidebarRing?: string;
}

export interface CreateThemeInput {
  theme_id: string;
  name: string;
  description?: string;
  tokens?: ThemeTokens;
}

export interface UpdateThemeInput {
  name?: string;
  description?: string;
  tokens?: ThemeTokens;
  status?: string;
}

export const ThemesService = {
  list(status?: string) {
    return ThemesModel.findMany(status ? { status } : undefined);
  },

  create(input: CreateThemeInput) {
    return ThemesModel.create({
      ...input,
      status: "active",
      is_active_web: false,
      is_active_couple: false,
    });
  },

  async update(themeId: string, input: UpdateThemeInput) {
    await ThemesModel.update(themeId, { ...input });
    return ThemesModel.findById(themeId);
  },

  async remove(themeId: string) {
    const theme = await ThemesModel.findById(themeId);
    if (theme && (theme.is_active_web === true || theme.is_active_couple === true)) {
      throw new Error("Cannot delete a theme that is active for web or couple");
    }
    return ThemesModel.delete(themeId);
  },

  async activate(themeId: string, scope: ThemeScope) {
    const field = scope === "web" ? "is_active_web" : "is_active_couple";
    const themes = await ThemesModel.findMany();
    const target = themes.find((t) => t.theme_id === themeId);
    if (!target) {
      throw new Error("Theme not found");
    }

    // No transactions available in longcelot-sheet-db — these updates run
    // sequentially, same caveat as other single-field toggles in this
    // codebase (see site-template-active-cell.tsx's status toggle). Only the
    // targeted scope's flag is touched, so activating for "web" never
    // disturbs whichever theme is currently active for "couple", and vice
    // versa.
    for (const theme of themes) {
      if (theme.theme_id === themeId) {
        await ThemesModel.update(theme.theme_id as string, { [field]: true });
      } else if (theme[field] === true) {
        await ThemesModel.update(theme.theme_id as string, { [field]: false });
      }
    }

    return ThemesModel.findById(themeId);
  },
};
