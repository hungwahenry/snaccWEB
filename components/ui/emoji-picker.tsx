"use client"

import {
  FlagIcon,
  HandIcon,
  HashIcon,
  LeafIcon,
  LightbulbIcon,
  PizzaIcon,
  PlaneIcon,
  SmileIcon,
  VolleyballIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"
import { useState, type ReactElement, type ReactNode } from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
import { useEmojiPicker } from "@/hooks/use-emoji-picker"
import {
  QUICK_CATEGORY,
  type CatalogEmoji,
  type PickerCategory,
} from "@/lib/emoji"
import { cn } from "@/lib/utils"

const CATEGORIES: { key: PickerCategory; icon: LucideIcon }[] = [
  { key: QUICK_CATEGORY, icon: ZapIcon },
  { key: "smileys_emotion", icon: SmileIcon },
  { key: "people_body", icon: HandIcon },
  { key: "animals_nature", icon: LeafIcon },
  { key: "food_drink", icon: PizzaIcon },
  { key: "activities", icon: VolleyballIcon },
  { key: "travel_places", icon: PlaneIcon },
  { key: "objects", icon: LightbulbIcon },
  { key: "symbols", icon: HashIcon },
  { key: "flags", icon: FlagIcon },
]

const POPOVER_WIDTH = 288
const GRID_HEIGHT = 200
const GRID_PADDING = 8
const COLUMNS = 7
const CELL_SIZE = (POPOVER_WIDTH - GRID_PADDING * 2) / COLUMNS
const EMOJI_SIZE = 24

type EmojiPickerProps = {
  quick: readonly string[]
  onSelect: (emoji: string) => void
  label: string
  children: ReactNode
  triggerClassName?: string
  triggerRender?: ReactElement
  align?: "start" | "center" | "end"
}

export function EmojiPicker({
  quick,
  onSelect,
  label,
  children,
  triggerClassName,
  triggerRender,
  align = "start",
}: EmojiPickerProps) {
  const [open, setOpen] = useState(false)

  function select(emoji: string) {
    onSelect(emoji)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={label}
        className={triggerClassName}
        render={triggerRender}
      >
        {children}
      </PopoverTrigger>

      <PopoverContent
        align={align}
        sideOffset={8}
        className="gap-0 overflow-hidden rounded-2xl p-0"
        style={{ width: POPOVER_WIDTH }}
      >
        <PickerContent quick={quick} onSelect={select} />
      </PopoverContent>
    </Popover>
  )
}

function PickerContent({
  quick,
  onSelect,
}: {
  quick: readonly string[]
  onSelect: (emoji: string) => void
}) {
  const picker = useEmojiPicker(quick)

  return (
    <>
      <div className="border-b border-border p-2">
        <Input
          value={picker.query}
          onChange={(event) => picker.setQuery(event.target.value)}
          placeholder="Search emoji"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          className="h-9"
        />
      </div>

      <div
        className="overflow-y-auto"
        style={{ height: GRID_HEIGHT, paddingInline: GRID_PADDING }}
      >
        {picker.loading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner className="text-muted-foreground" />
          </div>
        ) : picker.searching && picker.emojis.length === 0 ? (
          <EmptyState compact title="No emoji found." className="h-full" />
        ) : (
          <EmojiGrid emojis={picker.emojis} onSelect={onSelect} />
        )}
      </div>

      {picker.searching ? null : (
        <div className="flex items-center justify-between border-t border-border px-2 py-2">
          {CATEGORIES.map(({ key, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => picker.setCategory(key)}
              aria-label={key === QUICK_CATEGORY ? "Quick picks" : key}
              aria-pressed={picker.category === key}
              className={cn(
                "flex size-6 items-center justify-center rounded-full transition-colors",
                picker.category === key && "bg-primary"
              )}
            >
              <Icon
                className={cn(
                  "size-4",
                  picker.category === key
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>
      )}
    </>
  )
}

function EmojiGrid({
  emojis,
  onSelect,
}: {
  emojis: CatalogEmoji[]
  onSelect: (emoji: string) => void
}) {
  return (
    <div
      className="grid content-start"
      style={{ gridTemplateColumns: `repeat(${COLUMNS}, ${CELL_SIZE}px)` }}
    >
      {emojis.map((item) => (
        <button
          key={item.emoji}
          type="button"
          onClick={() => onSelect(item.emoji)}
          aria-label={item.name || item.emoji}
          style={{ width: CELL_SIZE, height: CELL_SIZE, fontSize: EMOJI_SIZE }}
          className="flex items-center justify-center rounded-xl leading-none transition-colors hover:bg-accent active:bg-accent"
        >
          {item.emoji}
        </button>
      ))}
    </div>
  )
}
