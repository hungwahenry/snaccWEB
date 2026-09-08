export type Tool = "draw" | "text" | "blur" | "crop"

export type Layer =
  | { kind: "stroke"; id: string; path: string; color: string; width: number }
  | {
      kind: "text"
      id: string
      text: string
      x: number
      y: number
      color: string
      size: number
    }
  | { kind: "blur"; id: string; path: string; width: number }

export type Ratio = "free" | "original" | "square" | "portrait" | "wide"

export const FIXED_RATIOS: Record<
  Exclude<Ratio, "free" | "original">,
  number
> = {
  square: 1,
  portrait: 4 / 5,
  wide: 16 / 9,
}

export const PALETTE = [
  "#FFFFFF",
  "#000000",
  "#FF3B30",
  "#FFCC00",
  "#34C759",
  "#0A84FF",
  "#AF52DE",
] as const

export const STROKE_WIDTHS = [4, 10, 20] as const
export const BLUR_WIDTHS = [30, 55, 90] as const
export const TEXT_SIZES = [24, 36, 52] as const

export const BLUR_SIGMA = 14

export const HANDLE = 36

export const LINE_HEIGHT = 1.25
export const TEXT_PAD = 12
