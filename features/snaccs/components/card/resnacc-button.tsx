"use client"

import { Repeat1Icon, RepeatIcon } from "lucide-react"
import { Bump } from "@/components/motion/bump"
import { useLongPress } from "@/hooks/use-long-press"
import { compactCount } from "@/lib/format"
import { cn } from "@/lib/utils"

type ResnaccButtonProps = {
  count: number
  mine: boolean
  onPress: () => void
  /** Who resnacced: a long press on a phone, a right click with a mouse. */
  onLongPress?: () => void
}

export function ResnaccButton({
  count,
  mine,
  onPress,
  onLongPress,
}: ResnaccButtonProps) {
  const Icon = mine ? Repeat1Icon : RepeatIcon
  const longPress = useLongPress(onLongPress)

  return (
    <button
      type="button"
      {...longPress}
      onClick={(event) => {
        event.stopPropagation()
        onPress()
      }}
      onContextMenu={
        onLongPress
          ? (event) => {
              event.preventDefault()
              event.stopPropagation()
              onLongPress()
            }
          : undefined
      }
      aria-label={mine ? "Undo resnacc" : "Resnacc"}
      className={cn(
        "flex h-9 items-center gap-1.5 rounded-full px-1.5 transition-colors hover:bg-accent active:scale-95",
        mine ? "text-success" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Bump value={mine}>
        <Icon className="size-[22px]" />
      </Bump>
      {count > 0 ? (
        <Bump value={count}>
          <span className="text-sm font-bold">{compactCount(count)}</span>
        </Bump>
      ) : null}
    </button>
  )
}
