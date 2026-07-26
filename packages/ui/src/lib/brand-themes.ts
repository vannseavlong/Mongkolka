export const BRAND_THEMES = [
  {
    id: "sage",
    label: "Sage & Champagne",
    description: "Premium and romantic — works for almost every wedding style.",
    swatch: ["#6f8f72", "#c9a86a", "#f5ebdd"],
  },
  {
    id: "rose",
    label: "Dusty Rose & Cream",
    description: "Very romantic but still elegant.",
    swatch: ["#d7a6a1", "#a68b7c", "#fff8f2"],
  },
  {
    id: "navy",
    label: "Navy & Gold",
    description: "Feels like a luxury hotel or high-end planner.",
    swatch: ["#223a5e", "#c7a96b", "#ffffff"],
  },
  {
    id: "terracotta",
    label: "Terracotta & Sand",
    description: "Trendy, great for rustic and outdoor weddings.",
    swatch: ["#c56a4d", "#79835c", "#f3e8da"],
  },
] as const;

export type BrandThemeId = (typeof BRAND_THEMES)[number]["id"];

export const DEFAULT_BRAND_THEME: BrandThemeId = "sage";
