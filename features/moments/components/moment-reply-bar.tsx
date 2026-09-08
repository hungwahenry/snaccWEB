"use client"

import { PlusIcon } from "lucide-react"
import type { ReactNode } from "react"
import { ReactionPicker } from "@/features/reactions/components/reaction-picker"
import { cn } from "@/lib/utils"
import { MomentReplyComposer } from "../containers/moment-reply-composer"

export function MomentReplyBar({
  reaction,
  quick,
  overflow,
  onReact,
  onReply,
  replying,
  onFocus,
  onBlur,
}: {
  reaction: string | null
  quick: string[]
  overflow: string | null
  onReact: (emoji: string) => void
  onReply: (body: string) => void
  replying: boolean
  onFocus: () => void
  onBlur: () => void
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2 px-3 pb-1">
        {quick.map((emoji) => (
          <Pill
            key={emoji}
            selected={reaction === emoji}
            label={`React ${emoji}`}
            onPress={() => onReact(emoji)}
          >
            <span className="text-xl leading-none">{emoji}</span>
          </Pill>
        ))}

        <ReactionPicker
          mine={reaction}
          onSelect={onReact}
          align="end"
          trigger={
            <Pill selected={overflow !== null} label="Pick another emoji">
              {overflow ? (
                <span className="text-xl leading-none">{overflow}</span>
              ) : (
                <PlusIcon className="size-5 text-white" />
              )}
            </Pill>
          }
        />
      </div>

      <MomentReplyComposer
        onReply={onReply}
        replying={replying}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  )
}

function Pill({
  selected,
  label,
  onPress,
  children,
}: {
  selected: boolean
  label: string
  onPress?: () => void
  children: ReactNode
}) {
  const className = cn(
    "flex size-10 items-center justify-center rounded-full transition-opacity active:opacity-70",
    selected ? "bg-white/25" : "bg-black/25"
  )

  // Without a handler it is the face of a popover trigger, which does the clicking itself.
  if (!onPress) {
    return (
      <span aria-label={label} className={className}>
        {children}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      aria-pressed={selected}
      className={className}
    >
      {children}
    </button>
  )
}
