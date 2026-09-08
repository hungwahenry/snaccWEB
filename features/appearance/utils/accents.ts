export interface AccentTone {
  primary: string
  foreground: string
}

export interface Accent {
  key: string
  label: string
  light: AccentTone
  dark: AccentTone
}

export const INK: Accent = {
  key: "ink",
  label: "Ink",
  light: { primary: "#000000", foreground: "#FFFFFF" },
  dark: { primary: "#FFFFFF", foreground: "#000000" },
}

export const ACCENTS: Accent[] = [
  INK,
  {
    key: "cherry",
    label: "Cherry",
    light: { primary: "#E11D48", foreground: "#FFFFFF" },
    dark: { primary: "#FB7185", foreground: "#000000" },
  },
  {
    key: "blossom",
    label: "Blossom",
    light: { primary: "#EC4899", foreground: "#FFFFFF" },
    dark: { primary: "#F9A8D4", foreground: "#000000" },
  },
  {
    key: "ocean",
    label: "Ocean",
    light: { primary: "#2563EB", foreground: "#FFFFFF" },
    dark: { primary: "#60A5FA", foreground: "#000000" },
  },
  {
    key: "matcha",
    label: "Matcha",
    light: { primary: "#16A34A", foreground: "#FFFFFF" },
    dark: { primary: "#4ADE80", foreground: "#000000" },
  },
  {
    key: "butter",
    label: "Butter",
    light: { primary: "#D97706", foreground: "#FFFFFF" },
    dark: { primary: "#FDE047", foreground: "#000000" },
  },
  {
    key: "grape",
    label: "Grape",
    light: { primary: "#7C3AED", foreground: "#FFFFFF" },
    dark: { primary: "#A78BFA", foreground: "#000000" },
  },
  {
    key: "tangerine",
    label: "Tangerine",
    light: { primary: "#EA580C", foreground: "#FFFFFF" },
    dark: { primary: "#FB923C", foreground: "#000000" },
  },
  {
    key: "lagoon",
    label: "Lagoon",
    light: { primary: "#0891B2", foreground: "#FFFFFF" },
    dark: { primary: "#22D3EE", foreground: "#000000" },
  },
  {
    key: "lime",
    label: "Lime",
    light: { primary: "#65A30D", foreground: "#FFFFFF" },
    dark: { primary: "#A3E635", foreground: "#000000" },
  },
  {
    key: "midnight",
    label: "Midnight",
    light: { primary: "#4338CA", foreground: "#FFFFFF" },
    dark: { primary: "#818CF8", foreground: "#000000" },
  },
  {
    key: "storm",
    label: "Storm",
    light: { primary: "#475569", foreground: "#FFFFFF" },
    dark: { primary: "#94A3B8", foreground: "#000000" },
  },
]

export function accentOf(key: string | null): Accent {
  return ACCENTS.find((accent) => accent.key === key) ?? INK
}
