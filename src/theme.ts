export type Theme = "light" | "sepia" | "dark";

export const THEME_COLORS: Record<Theme, { bg: string; text: string; highlight: string }> = {
  light: { bg: "#FFFFFF", text: "#1C1C1E", highlight: "#eda98c" },
  sepia: { bg: "#F5F0E8", text: "#3C2F1F", highlight: "#d4a574" },
  dark: { bg: "#1C1C1E", text: "#E5E5E5", highlight: "#4A4A6A" },
};
