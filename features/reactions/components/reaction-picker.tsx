"use client"

import { SmilePlusIcon } from "lucide-react"
import type { ReactNode } from "react"
import { EmojiPicker } from "@/components/ui/emoji-picker"
import { QUICK_REACTIONS } from "../utils/quick-reactions"

type ReactionPickerProps = {
  mine: string | null
  onSelect: (emoji: string) => void
  trigger?: ReactNode
  align?: "start" | "center" | "end"
}

export function ReactionPicker({
  mine,
  onSelect,
  trigger,
  align = "start",
}: ReactionPickerProps) {
  return (
    <EmojiPicker
      quick={QUICK_REACTIONS}
      onSelect={onSelect}
      align={align}
      label={mine ? `Change your ${mine} reaction` : "React"}
      triggerClassName="flex h-9 items-center justify-center rounded-full px-1 text-muted-foreground transition-colors hover:text-foreground active:opacity-70"
      triggerRender={trigger ? <span /> : undefined}
    >
      {trigger ??
        (mine ? (
          <span className="text-base leading-none">{mine}</span>
        ) : (
          <SmilePlusIcon className="size-[22px]" />
        ))}
    </EmojiPicker>
  )
}
