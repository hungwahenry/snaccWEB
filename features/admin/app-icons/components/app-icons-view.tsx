"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import { useState } from "react"
import { TableFrame } from "@/components/data-table/table-frame"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAppIconMutations } from "../hooks/use-app-icons"
import type { AdminAppIcon } from "../types"

export function AppIconsView({ icons }: { icons: AdminAppIcon[] }) {
  const save = useAppIconMutations()
  const rows = icons

  /** Reordering is a swap, so both rows move — there is no gap to slot into. */
  function move(index: number, delta: number) {
    const row = rows[index]
    const swap = rows[index + delta]
    if (!row || !swap) return

    save.mutate({ id: row.id, input: { position: swap.position } })
    save.mutate({ id: swap.id, input: { position: row.position } })
  }

  return (
    <TableFrame>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">Order</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Name in the picker</TableHead>
            <TableHead className="w-28 text-right">Offered</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((icon, index) => (
            <Row
              key={icon.id}
              icon={icon}
              first={index === 0}
              last={index === rows.length - 1}
              onMove={(delta) => move(index, delta)}
              onRename={(label) =>
                save.mutate({ id: icon.id, input: { label } })
              }
              onToggle={(enabled) =>
                save.mutate({ id: icon.id, input: { enabled } })
              }
            />
          ))}
        </TableBody>
      </Table>
    </TableFrame>
  )
}

function Row({
  icon,
  first,
  last,
  onMove,
  onRename,
  onToggle,
}: {
  icon: AdminAppIcon
  first: boolean
  last: boolean
  onMove: (delta: number) => void
  onRename: (label: string) => void
  onToggle: (enabled: boolean) => void
}) {
  const [label, setLabel] = useState(icon.label)

  return (
    <TableRow>
      <TableCell>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            disabled={first}
            onClick={() => onMove(-1)}
            aria-label={`Move ${icon.label} up`}
          >
            <ArrowUp className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            disabled={last}
            onClick={() => onMove(1)}
            aria-label={`Move ${icon.label} down`}
          >
            <ArrowDown className="size-4" />
          </Button>
        </div>
      </TableCell>

      {/* The identifier compiled into the app. Renaming happens next door; this cannot move. */}
      <TableCell className="font-mono text-xs text-muted-foreground">
        {icon.key}
      </TableCell>

      <TableCell>
        <Input
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          onBlur={() =>
            label.trim() && label !== icon.label && onRename(label.trim())
          }
          className="max-w-56"
        />
      </TableCell>

      <TableCell className="text-right">
        <Switch checked={icon.enabled} onCheckedChange={onToggle} />
      </TableCell>
    </TableRow>
  )
}
