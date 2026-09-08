import { DeleteIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const KEYS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ".",
  "0",
  "back",
] as const

export type KeypadKey = (typeof KEYS)[number]

export function Keypad({
  onKey,
  decimal = true,
  className,
}: {
  onKey: (key: KeypadKey) => void
  decimal?: boolean
  className?: string
}) {
  return (
    <div className={cn("grid grid-cols-3 px-4", className)}>
      {KEYS.map((key) =>
        key === "." && !decimal ? (
          <span key={key} className="h-16" />
        ) : (
          <button
            key={key}
            type="button"
            onClick={() => onKey(key)}
            aria-label={key === "back" ? "Delete" : key}
            className="flex h-16 items-center justify-center rounded-2xl text-2xl font-extrabold text-foreground transition-colors hover:bg-accent/60 active:opacity-50"
          >
            {key === "back" ? <DeleteIcon className="size-6" /> : key}
          </button>
        )
      )}
    </div>
  )
}
