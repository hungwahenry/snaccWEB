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
  SmilePlusIcon,
  VolleyballIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"
import { useState, type ReactNode } from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { useReactionPicker } from "../hooks/use-reaction-picker"
import { QUICK_CATEGORY, type PickerCategory } from "../utils/emoji"
import { ReactionGrid } from "./reaction-grid"

const REACTION_CATEGORIES: { key: PickerCategory; icon: LucideIcon }[] = [
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

  function select(emoji: string) {
    onSelect(emoji)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
        className="gap-0 overflow-hidden rounded-2xl p-0"
        style={{ width: POPOVER_WIDTH }}
      >
        <ReactionPickerContent onSelect={select} />
      </PopoverContent>
    </Popover>
  )
}

function ReactionPickerContent({
  onSelect,
}: {
  onSelect: (emoji: string) => void
}) {
  const picker = useReactionPicker()

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
          <ReactionGrid
            emojis={picker.emojis}
            columns={COLUMNS}
            cellSize={CELL_SIZE}
            emojiSize={EMOJI_SIZE}
            onSelect={onSelect}
          />
        )}
      </div>

      {picker.searching ? null : (
        <div className="flex items-center justify-between border-t border-border px-2 py-2">
          {REACTION_CATEGORIES.map(({ key, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => picker.setCategory(key)}
              aria-label={key === QUICK_CATEGORY ? "Quick reactions" : key}
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
