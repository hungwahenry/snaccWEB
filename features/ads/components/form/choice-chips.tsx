import { XIcon } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { Choice } from "../../types"

export function Chip({
  active,
  onPress,
  children,
}: {
  active: boolean
  onPress: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onPress}
      className={cn(
        "flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-bold transition-opacity active:opacity-70",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-accent"
      )}
    >
      {children}
    </button>
  )
}

export function RemovableChip({
  label,
  removeLabel,
  onRemove,
}: {
  label: string
  removeLabel: string
  onRemove: () => void
}) {
  return (
    <span className="flex h-9 max-w-full items-center gap-0.5 rounded-full bg-primary pr-1 pl-3.5 text-sm font-bold text-primary-foreground">
      <span className="truncate">{label}</span>
      <button
        type="button"
        aria-label={removeLabel}
        title={removeLabel}
        onClick={onRemove}
        className="flex size-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-primary-foreground/15"
      >
        <XIcon className="size-4" />
      </button>
    </span>
  )
}

export function ChoiceChips<T extends string>({
  choices,
  value,
  onToggle,
}: {
  choices: Choice<T>[]
  value: T[]
  onToggle: (value: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {choices.map((choice) => (
        <Chip
          key={choice.value}
          active={value.includes(choice.value)}
          onPress={() => onToggle(choice.value)}
        >
          {choice.label}
        </Chip>
      ))}
    </div>
  )
}
