import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type ColorSwatchProps = {
  color: string
  selected: boolean
  onPress: () => void
  tone?: "onDark" | "onSurface"
  showCheck?: boolean
  className?: string
}

export function ColorSwatch({
  color,
  selected,
  onPress,
  tone = "onSurface",
  showCheck = false,
  className,
}: ColorSwatchProps) {
  const ring =
    tone === "onDark"
      ? selected
        ? "border-white"
        : "border-white/25"
      : selected
        ? "border-foreground"
        : "border-transparent"

  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={`Colour ${color}`}
      aria-pressed={selected}
      style={{ backgroundColor: color }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border-2 transition-opacity active:opacity-70",
        ring,
        className
      )}
    >
      {showCheck && selected ? (
        <CheckIcon className="size-4 text-white" />
      ) : null}
    </button>
  )
}
