"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TIER_ICON_NAMES, TierIcon } from "./tier-icon"
import type { AdminTier } from "./types"
import type { useTierMutations } from "./use-leaderboard-tiers"

type Mutations = ReturnType<typeof useTierMutations>

function TierDialog({
  tier,
  mutations,
  trigger,
}: {
  tier?: AdminTier
  mutations: Mutations
  trigger: React.ReactElement
}) {
  const [open, setOpen] = useState(false)
  const [key, setKey] = useState(tier?.key ?? "")
  const [percent, setPercent] = useState(String(tier ? Math.round(tier.max_percentile * 100) : 0))
  const [position, setPosition] = useState(String(tier?.position ?? 0))
  const [label, setLabel] = useState(tier?.label ?? "")
  const [icon, setIcon] = useState(tier?.icon ?? "")
  const [color, setColor] = useState(tier?.color ?? "")

  const editing = Boolean(tier)
  const valid = key.trim() !== "" && percent.trim() !== ""

  function save() {
    const base = {
      key: key.trim(),
      maxPercentile: (Number(percent) || 0) / 100,
      position: Number(position) || 0,
      label: label.trim(),
      icon: icon.trim(),
      color: color.trim(),
    }
    if (editing && tier) {
      mutations.update.mutate({ id: tier.id, input: base }, { onSuccess: () => setOpen(false) })
    } else {
      mutations.create.mutate(base, { onSuccess: () => setOpen(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit tier" : "New tier"}</DialogTitle>
        </DialogHeader>
        <Field>
          <FieldLabel>Key</FieldLabel>
          <Input
            value={key}
            onChange={(event) => setKey(event.target.value)}
            placeholder="diamond"
            maxLength={30}
          />
        </Field>
        <div className="flex gap-3">
          <Field className="flex-1">
            <FieldLabel>Top %</FieldLabel>
            <Input
              type="number"
              value={percent}
              onChange={(event) => setPercent(event.target.value)}
            />
          </Field>
          <Field className="w-28">
            <FieldLabel>Position</FieldLabel>
            <Input
              type="number"
              value={position}
              onChange={(event) => setPosition(event.target.value)}
            />
          </Field>
        </div>
        <div className="flex gap-3">
          <Field className="flex-1">
            <FieldLabel>Label</FieldLabel>
            <Input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Diamond" maxLength={40} />
          </Field>
          <Field className="w-32">
            <FieldLabel>Icon</FieldLabel>
            <div className="flex items-center gap-2">
              <Input value={icon} onChange={(event) => setIcon(event.target.value)} placeholder="gem" maxLength={16} />
              <TierIcon name={icon} color={color} className="size-5 shrink-0" />
            </div>
          </Field>
          <Field className="w-28">
            <FieldLabel>Color</FieldLabel>
            <Input value={color} onChange={(event) => setColor(event.target.value)} placeholder="#38BDF8" maxLength={24} />
          </Field>
        </div>
        <p className="text-muted-foreground text-xs">
          Cutoff by campus rank. Best tier first (lowest %); the last tier should be 100% — the floor. Label + icon show
          as flair in the app; leave the floor tier&apos;s icon blank so it stays a plain handle. Icon is one of:{" "}
          {TIER_ICON_NAMES.join(", ")}.
        </p>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            disabled={!valid || mutations.create.isPending || mutations.update.isPending}
            onClick={save}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function TiersTable({ tiers, mutations }: { tiers: AdminTier[]; mutations: Mutations }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <TierDialog mutations={mutations} trigger={<Button size="sm">Add tier</Button>} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tier</TableHead>
            <TableHead>Cutoff</TableHead>
            <TableHead className="text-right">Position</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tiers.map((tier) => (
            <TableRow key={tier.id}>
              <TableCell className="font-medium">
                <span className="inline-flex items-center gap-2">
                  <TierIcon name={tier.icon} color={tier.color} className="size-4 shrink-0" />
                  {tier.label || tier.key}
                </span>
              </TableCell>
              <TableCell className="text-sm">
                {tier.max_percentile >= 1
                  ? "Everyone else"
                  : `Top ${Math.round(tier.max_percentile * 100)}%`}
              </TableCell>
              <TableCell className="text-right tabular-nums">{tier.position}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <TierDialog
                    tier={tier}
                    mutations={mutations}
                    trigger={
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    }
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    disabled={mutations.remove.isPending}
                    onClick={() => mutations.remove.mutate(tier.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
