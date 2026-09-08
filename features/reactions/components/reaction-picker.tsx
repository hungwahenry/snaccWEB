"use client"

import { EmojiPicker } from "frimousse"
import { SearchIcon, SmilePlusIcon, ZapIcon } from "lucide-react"
import { useState, type ReactNode } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { QUICK_REACTIONS } from "../utils/quick"

type ReactionPickerProps = {
  mine: string | null
  onSelect: (emoji: string) => void
  /** Replaces the default trigger, for surfaces that open the picker from their own control. */
  trigger?: ReactNode
  align?: "start" | "center" | "end"
}

export function ReactionPicker({
  mine,
  onSelect,
  trigger,
  align = "start",
}: ReactionPickerProps) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"quick" | "all">("quick")

  function pick(emoji: string) {
    onSelect(emoji)
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setMode("quick")
      }}
    >
      <PopoverTrigger
        aria-label={mine ? `Change your ${mine} reaction` : "React"}
        className="flex h-9 items-center justify-center rounded-full px-1 text-muted-foreground transition-colors hover:text-foreground active:opacity-70"
        render={trigger ? <span /> : undefined}
      >
        {trigger ??
          (mine ? (
            <span className="text-base leading-none">{mine}</span>
          ) : (
            <SmilePlusIcon className="size-[22px]" />
          ))}
      </PopoverTrigger>

      <PopoverContent
        align={align}
        sideOffset={8}
        className="w-72 gap-0 overflow-hidden p-0"
      >
        {mode === "quick" ? (
          <div className="flex flex-col">
            <div className="grid grid-cols-7 gap-0.5 p-2">
              {QUICK_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => pick(emoji)}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl text-2xl transition-colors hover:bg-accent",
                    mine === emoji && "bg-accent"
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setMode("all")}
              className="flex items-center justify-center gap-2 border-t border-border py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <SearchIcon className="size-4" /> Search all emoji
            </button>
          </div>
        ) : (
          <EmojiPicker.Root
            columns={7}
            onEmojiSelect={({ emoji }) => pick(emoji)}
            className="isolate flex h-[300px] w-full flex-col"
          >
            <div className="flex items-center gap-2 border-b border-border p-2">
              <button
                type="button"
                onClick={() => setMode("quick")}
                aria-label="Quick reactions"
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <ZapIcon className="size-4" />
              </button>
              <EmojiPicker.Search
                autoFocus
                placeholder="Search emoji"
                className="h-9 flex-1 rounded-full bg-input px-3 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <EmojiPicker.Viewport className="relative flex-1 outline-hidden">
              <EmojiPicker.Loading className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                Loading…
              </EmojiPicker.Loading>
              <EmojiPicker.Empty className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                No emoji found.
              </EmojiPicker.Empty>
              <EmojiPicker.List
                className="pb-1.5 select-none"
                components={{
                  CategoryHeader: ({ category, ...props }) => (
                    <div
                      {...props}
                      className="bg-popover px-3 pt-3 pb-1.5 text-xs font-bold text-muted-foreground"
                    >
                      {category.label}
                    </div>
                  ),
                  Row: ({ children, ...props }) => (
                    <div {...props} className="scroll-my-1.5 px-1.5">
                      {children}
                    </div>
                  ),
                  Emoji: ({ emoji, ...props }) => (
                    <button
                      {...props}
                      className="flex size-9 items-center justify-center rounded-xl text-2xl data-[active]:bg-accent"
                    >
                      {emoji.emoji}
                    </button>
                  ),
                }}
              />
            </EmojiPicker.Viewport>
          </EmojiPicker.Root>
        )}
      </PopoverContent>
    </Popover>
  )
}
