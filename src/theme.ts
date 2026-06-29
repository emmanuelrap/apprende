export const colors = {
  primary: "#078F83",
  primaryDark: "#0F766E",
  primaryMedium: "#14B8A6",
  primaryLight: "#34D399",
  primaryDarkest: "#056860",
  primaryBg: "#E8F5F3",
  primaryBgAlt: "#E1F5EE",

  bg: "#F7FAFC",
  white: "#FFFFFF",

  text: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  textVeryMuted: "#CBD5E1",

  border: "#E2E8F0",
  borderAlt: "#E5E7EB",

  success: "#16A34A",
  successBg: "#F0FDF4",
  warning: "#F59E0B",
  warningBg: "#FFFBEB",
  error: "#EF4444",
  errorBg: "#FEF2F2",

  reading: "#3B82F6",
  readingBg: "#EFF6FF",

  shadow: "#000",

  coverColors: [
    ["#078F83", "#056860"],
    ["#6366F1", "#4F46E5"],
    ["#E11D48", "#BE123C"],
    ["#D97706", "#B45309"],
    ["#7C3AED", "#6D28D9"],
    ["#0891B2", "#0E7490"],
    ["#059669", "#047857"],
    ["#DB2777", "#BE185D"],
  ] as [string, string][],
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 20,
  full: 100,
} as const;

export const typography = {
  h1: { fontSize: 26, fontWeight: "900" as const },
  h2: { fontSize: 22, fontWeight: "800" as const },
  h3: { fontSize: 18, fontWeight: "700" as const },
  h4: { fontSize: 17, fontWeight: "700" as const },
  body: { fontSize: 13, color: colors.textSecondary },
  caption: { fontSize: 11, color: colors.textMuted },
  badge: { fontSize: 10, fontWeight: "700" as const },
  small: { fontSize: 9 },
} as const;

export const THEME_COLORS = {
  light: { bg: "#FFFFFF", text: "#1C1C1E", highlight: "#eda98c" },
  sepia: { bg: "#EDE0C8", text: "#3C2F1F", highlight: "#d4a574" },
  dark: { bg: "#1C1C1E", text: "#E5E5E5", highlight: "#4A4A6A" },
} as const;

export type Theme = keyof typeof THEME_COLORS;

export const shadows = {
  card: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLg: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  dropdown: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4000,
  },
} as const;
