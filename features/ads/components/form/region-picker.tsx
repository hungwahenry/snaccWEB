"use client"

import { ChevronDownIcon } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { NigerianState, Region, RegionStates } from "../../types"
import { regionCoverage, regionSummary, stateName } from "../../utils/regions"
import { Chip } from "./choice-chips"

export function RegionPicker({
  regions,
  picked,
  onToggleRegion,
  onToggleState,
}: {
  regions: RegionStates[]
  picked: NigerianState[]
  onToggleRegion: (region: RegionStates) => void
  onToggleState: (state: NigerianState) => void
}) {
  const [open, setOpen] = useState<Region | null>(null)

  return (
    <div className="flex flex-col divide-y divide-border/60 overflow-hidden rounded-2xl border border-border">
      {regions.map((region) => {
        const expanded = open === region.key

        return (
          <div key={region.key}>
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : region.key)}
              className="flex h-12 w-full items-center justify-between gap-3 px-4 text-left transition-colors hover:bg-accent/40"
            >
              <span className="truncate text-sm font-bold text-foreground">
                {region.label}
              </span>
              <span className="flex shrink-0 items-center gap-2 text-xs font-semibold text-muted-foreground">
                {regionSummary(region, picked)}
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
                <Chip
                  active={regionCoverage(region, picked) === "all"}
                  onPress={() => onToggleRegion(region)}
                >
                  All of {region.label}
                </Chip>
                {region.states.map((state) => (
                  <Chip
                    key={state}
                    active={picked.includes(state)}
                    onPress={() => onToggleState(state)}
                  >
                    {stateName(state)}
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
