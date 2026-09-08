import { ColorSwatch } from "@/components/ui/color-swatch"
import { MOMENT_BACKGROUNDS } from "../../utils/backgrounds"

export function MomentBackgroundRow({
  value,
  onChange,
}: {
  value: string
  onChange: (background: string) => void
}) {
  return (
    <div className="flex [scrollbar-width:none] gap-2.5 overflow-x-auto px-4 py-1 [&::-webkit-scrollbar]:hidden">
      {MOMENT_BACKGROUNDS.map((background) => (
        <ColorSwatch
          key={background}
          color={background}
          selected={background === value}
          onPress={() => onChange(background)}
          showCheck
          className="size-9"
        />
      ))}
    </div>
  )
}
