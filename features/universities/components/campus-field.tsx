import { ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function CampusField({
  placeholder,
  value,
  onPress,
}: {
  placeholder: string
  value: string | null
  onPress: () => void
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="flex h-14 w-full items-center justify-between rounded-full bg-input px-5 text-left transition-opacity active:opacity-80"
    >
      <span
        className={cn(
          "flex-1 truncate",
          value ? "font-semibold text-foreground" : "text-muted-foreground"
        )}
      >
        {value ?? placeholder}
      </span>
      <ChevronDownIcon className="ml-3 size-5 shrink-0 text-muted-foreground" />
    </button>
  )
}
