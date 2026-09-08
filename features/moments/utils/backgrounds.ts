export const MOMENT_BACKGROUNDS = [
  "#C62A2F",
  "#C82366",
  "#A62A8C",
  "#7C3FB0",
  "#5B47C0",
  "#3A5BD0",
  "#0B6BB8",
  "#0E6E78",
  "#0E7F72",
  "#237A33",
  "#4F6B28",
  "#9A5C00",
  "#A9491A",
  "#7A5B45",
  "#1C2024",
] as const

export type MomentBackground = (typeof MOMENT_BACKGROUNDS)[number]

export const DEFAULT_BACKGROUND: MomentBackground = "#3A5BD0"
