import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function ViewOnceToggle({
  checked,
  onToggle,
}: {
  checked: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className="flex items-center gap-2 px-3.5 pb-2.5 text-left active:opacity-60"
    >
      <span
        className={cn(
          "flex size-4 items-center justify-center rounded-full border",
          checked ? "border-primary bg-primary" : "border-muted-foreground"
        )}
      >
        {checked ? (
          <CheckIcon className="size-3 text-primary-foreground" />
        ) : null}
      </span>
      <span
        className={cn(
          "text-xs",
          checked ? "font-bold text-foreground" : "text-muted-foreground"
        )}
      >
        View once, seen and then deleted
      </span>
    </button>
  )
}
