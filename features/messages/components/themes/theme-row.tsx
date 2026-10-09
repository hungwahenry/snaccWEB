import { ThemeSwatch, type ThemeSwatchProps } from "./theme-swatch"

export const THEME_TILE = 104

export function ThemeRow({
  swatches,
}: {
  swatches: (ThemeSwatchProps & { key: string })[]
}) {
  return (
    <div className="-mx-6 flex [scrollbar-width:none] gap-3 overflow-x-auto px-6 py-1 [&::-webkit-scrollbar]:hidden">
      {swatches.map(({ key, ...swatch }) => (
        <ThemeSwatch key={key} width={THEME_TILE} {...swatch} />
      ))}
    </div>
  )
}
