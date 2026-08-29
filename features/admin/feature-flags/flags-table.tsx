"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TableFrame } from "@/components/data-table/table-frame"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import type { AdminFeatureFlag, FlagChanges } from "./index"

type UpdateInput = { key: string } & FlagChanges

export function windowLabel(flag: AdminFeatureFlag): string | null {
  if (flag.min_version && flag.max_version)
    return `${flag.min_version} – ${flag.max_version}`
  if (flag.min_version) return `${flag.min_version}+`
  if (flag.max_version) return `up to ${flag.max_version}`
  return null
}

function VersionDialog({
  flag,
  onUpdate,
  pending,
}: {
  flag: AdminFeatureFlag
  onUpdate: (input: UpdateInput) => void
  pending: boolean
}) {
  const [open, setOpen] = useState(false)
  const [min, setMin] = useState(flag.min_version ?? "")
  const [max, setMax] = useState(flag.max_version ?? "")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            Versions
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-mono text-sm">{flag.key}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Which app builds this reaches. A build only changes when someone
          installs from a store, so an over-the-air update never moves anyone
          past these. Leave a field empty for no limit.
        </p>
        <Field>
          <FieldLabel>Oldest build</FieldLabel>
          <Input
            value={min}
            placeholder="1.2.0"
            onChange={(event) => setMin(event.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>Newest build</FieldLabel>
          <Input
            value={max}
            placeholder="no limit"
            onChange={(event) => setMax(event.target.value)}
          />
        </Field>
        <p className="text-xs text-muted-foreground">
          Anything that doesn&apos;t say which build it is gets treated as too
          old and won&apos;t see the feature.
        </p>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            disabled={pending}
            onClick={() => {
              onUpdate({
                key: flag.key,
                minVersion: min.trim(),
                maxVersion: max.trim(),
              })
              setOpen(false)
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
                <TableHead className="w-40 text-right">State</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flags
                .filter((f) => f.category === category)
                .map((flag) => {
                  const gated = windowLabel(flag)

                  return (
                    <TableRow key={flag.key}>
                      <TableCell className="align-top">
                        <div className="font-mono text-xs">{flag.key}</div>
                        <div className="mt-1 text-xs text-pretty text-muted-foreground">
                          {flag.description}
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        {gated ? (
                          <Badge variant="outline" className="tabular-nums">
                            {gated}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Every build
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex items-center justify-end gap-3">
                          <VersionDialog
                            flag={flag}
                            onUpdate={onToggle}
                            pending={pending}
                          />
                          <Switch
                            checked={flag.enabled}
                            disabled={pending}
                            onCheckedChange={(enabled) =>
                              onToggle({ key: flag.key, enabled })
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableFrame>
      ))}
    </div>
  )
}
