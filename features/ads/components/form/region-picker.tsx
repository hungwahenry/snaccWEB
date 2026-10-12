"use client"

import { ChevronDownIcon } from "lucide-react"
import { useState } from "react"
import type { RegionGroup } from "@/features/places/types"
import { groupCoverage, groupSummary } from "@/features/places/utils/regions"
import { cn } from "@/lib/utils"
import { Chip } from "./choice-chips"

const LOOSE = "loose"

export function RegionPicker({
  groups,
  picked,
  onToggleGroup,
  onToggleMember,
}: {
  groups: RegionGroup[]
  picked: string[]
  onToggleGroup: (group: RegionGroup) => void
  onToggleMember: (group: RegionGroup, memberId: string) => void
}) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="flex flex-col divide-y divide-border/60 overflow-hidden rounded-2xl border border-border">
      {groups.map((group) => {
        const key = group.region?.id ?? LOOSE
        const expanded = open === key

        return (
          <div key={key}>
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : key)}
              className="flex h-12 w-full items-center justify-between gap-3 px-4 text-left transition-colors hover:bg-accent/40"
            >
              <span className="truncate text-sm font-bold text-foreground">
                {group.region?.name ?? "Regions"}
              </span>
              <span className="flex shrink-0 items-center gap-2 text-xs font-semibold text-muted-foreground">
                {groupSummary(group, picked)}
                <ChevronDownIcon
                  className={cn(
                    "size-4 transition-transform",
                    expanded && "rotate-180"
                  )}
                />
              </span>
            </button>

            {expanded ? (
              <div className="flex flex-wrap gap-2 px-4 pb-4">
                {group.region ? (
                  <Chip
                    active={groupCoverage(group, picked) === "all"}
                    onPress={() => onToggleGroup(group)}
                  >
                    All of {group.region.name}
                  </Chip>
                ) : null}
                {group.members.map((member) => (
                  <Chip
                    key={member.id}
                    active={
                      picked.includes(member.id) ||
                      (group.region !== null &&
                        picked.includes(group.region.id))
                    }
                    onPress={() => onToggleMember(group, member.id)}
                  >
                    {member.name}
                  </Chip>
                ))}
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
