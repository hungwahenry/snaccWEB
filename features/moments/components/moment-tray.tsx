"use client"

import { PlusIcon } from "lucide-react"
import type { ReactNode } from "react"
import { UserAvatar } from "@/components/ui/user-avatar"
import { useTier } from "@/features/score/hooks/use-tier"
import { cn } from "@/lib/utils"
import type { TrayEntry } from "../types"
import { ringColors, ringGradient } from "../utils/ring"
import { AVATAR_SIZE, squircleRadius } from "../utils/shape"

const RING = AVATAR_SIZE + 9

interface MomentTrayProps {
  mine: TrayEntry | null
  others: TrayEntry[]
  onOpen: (entry: TrayEntry) => void
  onCompose: () => void
}

export function MomentTray({
  mine,
  others,
  onOpen,
  onCompose,
}: MomentTrayProps) {
  return (
    <div className="flex [scrollbar-width:none] gap-4 overflow-x-auto px-4 py-3 [&::-webkit-scrollbar]:hidden">
      {mine ? (
        <TrayItem
          label="Your moment"
          entry={mine}
          onPress={() => onOpen(mine)}
          onAdd={onCompose}
        />
      ) : (
        <AddMomentItem onPress={onCompose} />
      )}

      {others.map((entry) => (
        <TrayItem
          key={entry.author.id}
          label={entry.author.username ?? "Someone"}
          entry={entry}
          onPress={() => onOpen(entry)}
        />
      ))}
    </div>
  )
}

function AddMomentItem({ onPress }: { onPress: () => void }) {
  return (
    <div className="flex w-16 shrink-0 flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={onPress}
        aria-label="Post a moment"
        style={{
          width: RING,
          height: RING,
          borderRadius: squircleRadius(RING),
        }}
        className="flex items-center justify-center border-2 border-dashed border-border bg-muted/40 transition-opacity active:opacity-70"
      >
        <PlusIcon className="size-7 text-muted-foreground" />
      </button>
      <span className="w-full truncate text-center text-xs text-muted-foreground">
        Add yours
      </span>
    </div>
  )
}

interface TrayItemProps {
  entry: TrayEntry
  label: string
  onPress: () => void
  onAdd?: () => void
}

function TrayItem({ entry, label, onPress, onAdd }: TrayItemProps) {
  const unseen = entry.unseen > 0
  const tier = useTier(entry.author.score.tier)
  const sweep = unseen ? ringColors(tier?.color) : null

  return (
    <div className="flex w-16 shrink-0 flex-col items-center gap-1.5">
      <div className="relative">
        <button
          type="button"
          onClick={onPress}
          aria-label={`${label}'s moments`}
          className="block transition-opacity active:opacity-70"
        >
          <Ring sweep={sweep} unseen={unseen}>
            <div
              className="bg-background p-[2px]"
              style={{ borderRadius: squircleRadius(AVATAR_SIZE + 4) }}
            >
              <UserAvatar
                alt={label}
                avatarUrl={entry.author.avatar_url}
                name={entry.author.display_name ?? label}
                className="size-14"
                shapeClassName="rounded-[18px]"
              />
            </div>
          </Ring>
        </button>

        {onAdd ? (
          <button
            type="button"
            onClick={onAdd}
            aria-label="Post another moment"
            className="absolute -right-0.5 -bottom-0.5 flex size-6 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground transition-opacity active:opacity-70"
          >
            <PlusIcon className="size-3.5" />
          </button>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onPress}
        className={cn(
          "w-full truncate text-center text-xs transition-opacity active:opacity-70",
          unseen ? "font-bold text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
      </button>
    </div>
  )
}

/** The tray's ring keeps the squircle the whole strip is built on, so it cannot go round here. */
function Ring({
  sweep,
  unseen,
  children,
}: {
  sweep: [string, string] | null
  unseen: boolean
  children: ReactNode
}) {
  const shape = { borderRadius: squircleRadius(RING), padding: 2.5 }

  if (!sweep) {
    return (
      <div style={shape} className={unseen ? "bg-primary" : "bg-border"}>
        {children}
      </div>
    )
  }

  return (
    <div style={{ ...shape, background: ringGradient(sweep) }}>{children}</div>
  )
}
