"use client"

import { Badge } from "@/components/ui/badge"
import { CanAct } from "@/features/admin/auth/components/can"
import { TableFrame } from "@/components/data-table/table-frame"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { AvailabilityDialog } from "./availability-dialog"
import type { AdminFeatureFlag, FlagChanges } from "../types"
import { PLATFORM_LABELS, PLATFORMS, reachLabel, windowLabel } from "../utils"

type UpdateInput = { key: string } & FlagChanges

function Reaches({ flag }: { flag: AdminFeatureFlag }) {
  if (flag.overrides.length === 0) {
    const gated = windowLabel(flag)

    return gated ? (
      <Badge variant="outline" className="tabular-nums">
        {gated}
      </Badge>
    ) : (
      <span className="text-xs text-muted-foreground">Every build</span>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {PLATFORMS.map((platform) => {
        const label = reachLabel(flag, platform)

        return (
          <div key={platform} className="flex items-center gap-2">
            <span className="w-14 shrink-0 text-xs text-muted-foreground">
              {PLATFORM_LABELS[platform]}
            </span>
            <Badge
              variant={label === "Off" ? "secondary" : "outline"}
              className="tabular-nums"
            >
              {label}
            </Badge>
          </div>
        )
      })}
    </div>
  )
}

export function FlagsTable({
  flags,
  onToggle,
  pending,
}: {
  flags: AdminFeatureFlag[]
  onToggle: (input: UpdateInput) => void
  pending: boolean
}) {
  const categories = [...new Set(flags.map((f) => f.category))].sort()

  return (
    <div className="flex flex-col gap-6">
      {categories.map((category) => (
        <TableFrame
          key={category}
          title={<span className="capitalize">{category}</span>}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flag</TableHead>
                <TableHead>Reaches</TableHead>
                <TableHead className="w-48 text-right">State</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flags
                .filter((f) => f.category === category)
                .map((flag) => (
                  <TableRow key={flag.key}>
                    <TableCell className="align-top">
                      <div className="font-mono text-xs">{flag.key}</div>
                      <div className="mt-1 text-xs text-pretty text-muted-foreground">
                        {flag.description}
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <Reaches flag={flag} />
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex items-center justify-end gap-3">
                        <AvailabilityDialog
                          flag={flag}
                          onUpdate={onToggle}
                          pending={pending}
                        />
                        <CanAct permission="flags.write">
                          <Switch
                            checked={flag.enabled}
                            disabled={pending}
                            onCheckedChange={(enabled) =>
                              onToggle({ key: flag.key, enabled })
                            }
                          />
                        </CanAct>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableFrame>
      ))}
    </div>
  )
}
