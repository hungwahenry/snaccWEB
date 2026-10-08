"use client"

import { tileWidth } from "@/features/chat-themes/utils/grid"
import { useElementWidth } from "@/hooks/use-element-width"
import { ThemeSwatch, type ThemeSwatchProps } from "./theme-swatch"

const COLUMNS = 3
const GAP = 12
const ROW_GAP = 16

export function ThemeGrid({
  swatches,
}: {
  swatches: (ThemeSwatchProps & { key: string })[]
}) {
  const { ref, width } = useElementWidth<HTMLDivElement>()
  const tile = tileWidth(width, COLUMNS, GAP)

  return (
    <div
      ref={ref}
      className="flex flex-wrap"
      style={{ columnGap: GAP, rowGap: ROW_GAP }}
    >
      {tile > 0
        ? swatches.map(({ key, ...swatch }) => (
            <ThemeSwatch key={key} width={tile} {...swatch} />
          ))
        : null}
    </div>
  )
}
