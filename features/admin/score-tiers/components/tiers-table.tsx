"use client"

import { ConfirmAction } from "@/components/admin/confirm-action"

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
import { TableFrame } from "@/components/data-table/table-frame"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { NAMED_ICON_NAMES, NamedIcon } from "@/lib/icons/named-icon"
import type { AdminTier } from "../types"
import type { useTierMutations } from "../hooks/use-score-tiers"

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
  const [minScore, setMinScore] = useState(String(tier?.min_score ?? 0))
  const [position, setPosition] = useState(String(tier?.position ?? 0))
  const [label, setLabel] = useState(tier?.label ?? "")
  const [icon, setIcon] = useState(tier?.icon ?? "")
  const [color, setColor] = useState(tier?.color ?? "")

  const editing = Boolean(tier)
  const valid = key.trim() !== "" && minScore.trim() !== ""

  function save() {
    const base = {
      key: key.trim(),
      minScore: Number(minScore) || 0,
      position: Number(position) || 0,
      label: label.trim(),
      icon: icon.trim(),
      color: color.trim(),
    }
    if (editing && tier) {
      mutations.update.mutate(
        { id: tier.id, input: base },
        { onSuccess: () => setOpen(false) }
      )
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
            <FieldLabel>From score</FieldLabel>
            <Input
              type="number"
              value={minScore}
              onChange={(event) => setMinScore(event.target.value)}
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
            <Input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="Voice"
              maxLength={40}
            />
          </Field>
          <Field className="w-32">
            <FieldLabel>Icon</FieldLabel>
            <div className="flex items-center gap-2">
              <Input
                value={icon}
                onChange={(event) => setIcon(event.target.value)}
                placeholder="medal"
                maxLength={16}
              />
              <NamedIcon
                name={icon}
                color={color}
                className="size-5 shrink-0"
              />
            </div>
          </Field>
          <Field className="w-28">
            <FieldLabel>Color</FieldLabel>
            <Input
              value={color}
              onChange={(event) => setColor(event.target.value)}
              placeholder="#38BDF8"
              maxLength={24}
            />
          </Field>
        </div>
        <p className="text-xs text-muted-foreground">
          The lowest score that earns this rung. Keep the floor at 0 so every
          account has a tier; leave its icon blank so it stays a plain handle.
          Saving re-tiers everyone. Icon is one of:{" "}
          {NAMED_ICON_NAMES.join(", ")}.
        </p>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            disabled={
              !valid || mutations.create.isPending || mutations.update.isPending
            }
            onClick={save}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function TiersTable({
  tiers,
  mutations,
}: {
  tiers: AdminTier[]
  mutations: Mutations
}) {
  return (
    <TableFrame
      toolbar={
        <div className="flex justify-end">
          <TierDialog
            mutations={mutations}
            trigger={<Button size="sm">Add tier</Button>}
          />
        </div>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tier</TableHead>
            <TableHead>From</TableHead>
            <TableHead className="text-right">Position</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tiers.map((tier) => (
            <TableRow key={tier.id}>
              <TableCell className="font-medium">
                <span className="inline-flex items-center gap-2">
                  <NamedIcon
                    name={tier.icon}
                    color={tier.color}
                    className="size-4 shrink-0"
                  />
                  {tier.label || tier.key}
                </span>
              </TableCell>
              <TableCell className="text-sm">
                {tier.min_score === 0
                  ? "Floor"
                  : `${tier.min_score.toLocaleString()} points`}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {tier.position}
              </TableCell>
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
                  <ConfirmAction
                    label="Delete"
                    variant="ghost"
                    title="Delete this tier?"
                    description="Every profile standing on the ladder is recomputed straight away, so people can move tier the moment you confirm."
                    confirmLabel="Delete tier"
                    pending={mutations.remove.isPending}
                    onConfirm={(close) =>
                      mutations.remove.mutate(tier.id, { onSuccess: close })
                    }
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableFrame>
  )
}
