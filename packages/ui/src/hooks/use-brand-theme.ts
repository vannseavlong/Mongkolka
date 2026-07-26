"use client";

import { useCallback, useEffect, useState } from "react";
import { type BrandThemeId, DEFAULT_BRAND_THEME } from "../lib/brand-themes";

const STORAGE_KEY = "mongkolka-brand-theme";

function applyBrandTheme(theme: BrandThemeId) {
  document.documentElement.setAttribute("data-brand-theme", theme);
}

export function useBrandTheme() {
  const [theme, setThemeState] = useState<BrandThemeId>(DEFAULT_BRAND_THEME);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as BrandThemeId | null;
    const initial = stored ?? DEFAULT_BRAND_THEME;
    setThemeState(initial);
    applyBrandTheme(initial);
  }, []);

  const setTheme = useCallback((next: BrandThemeId) => {
    setThemeState(next);
    applyBrandTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return { theme, setTheme };
}
