import { Repeat1Icon, RepeatIcon } from "lucide-react"
import { compactCount } from "@/lib/format"
import { cn } from "@/lib/utils"

type ResnaccButtonProps = {
  count: number
  mine: boolean
  onPress: () => void
}

export function ResnaccButton({ count, mine, onPress }: ResnaccButtonProps) {
  const Icon = mine ? Repeat1Icon : RepeatIcon

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation()
        onPress()
      }}
      aria-label={mine ? "Undo resnacc" : "Resnacc"}
      className={cn(
        "flex h-9 items-center gap-1.5 rounded-full px-1.5 transition-colors hover:bg-accent active:scale-95",
        mine ? "text-success" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="size-[22px]" />
      {count > 0 ? (
        <span className="text-sm font-bold">{compactCount(count)}</span>
      ) : null}
    </button>
  )
}
