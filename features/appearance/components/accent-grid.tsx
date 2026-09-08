import { CheckIcon, LockIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Accent } from "../utils/accents"

export function AccentGrid({
  accents,
  selectedKey,
  lockedKeys,
  mode,
  onPick,
}: {
  accents: Accent[]
  selectedKey: string
  lockedKeys: Set<string>
  mode: "light" | "dark"
  onPick: (accent: Accent) => void
}) {
  return (
    <div className="grid grid-cols-4">
      {accents.map((option) => {
        const locked = lockedKeys.has(option.key)
        const selected = selectedKey === option.key

        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onPick(option)}
            aria-label={`${option.label} accent`}
            aria-pressed={selected}
            className="flex flex-col items-center gap-2 py-3 transition-opacity active:opacity-70"
          >
            <span
              style={{ backgroundColor: option[mode].primary }}
              className={cn(
                "flex size-14 items-center justify-center rounded-full border-2",
                selected ? "border-foreground" : "border-transparent"
              )}
            >
              {selected ? (
                <CheckIcon
                  className="size-5"
                  style={{ color: option[mode].foreground }}
                />
              ) : locked ? (
                <LockIcon
                  className="size-4 opacity-70"
                  style={{ color: option[mode].foreground }}
                />
              ) : null}
            </span>
            <span
              className={cn(
                "text-xs",
                selected ? "font-bold text-foreground" : "text-muted-foreground"
              )}
            >
              {option.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
