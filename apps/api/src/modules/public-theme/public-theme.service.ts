import { ThemesModel } from "../themes/themes.model.js";
import type { ThemeScope } from "../themes/themes.service.js";

export const PublicThemeService = {
  async getActiveTheme(scope: ThemeScope) {
    const field = scope === "web" ? "is_active_web" : "is_active_couple";
    const themes = await ThemesModel.findMany({ [field]: true });
    const theme = themes[0];
    if (!theme) return null;
    return {
      theme_id: theme.theme_id,
      name: theme.name,
      tokens: theme.tokens,
    };
  },
};
