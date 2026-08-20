"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
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
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { NAMED_ICON_NAMES, NamedIcon } from "@/lib/icons/named-icon"
import type { AdminBadge } from "./types"
import { useBadgeHolders, type useBadgeMutations } from "./use-badges"

type Mutations = ReturnType<typeof useBadgeMutations>

function BadgeDialog({
  badge,
  mutations,
  trigger,
}: {
  badge?: AdminBadge
  mutations: Mutations
  trigger: React.ReactElement
}) {
  const [open, setOpen] = useState(false)
  const [key, setKey] = useState(badge?.key ?? "")
  const [label, setLabel] = useState(badge?.label ?? "")
  const [icon, setIcon] = useState(badge?.icon ?? "")
  const [color, setColor] = useState(badge?.color ?? "")
  const [description, setDescription] = useState(badge?.description ?? "")
  const [position, setPosition] = useState(String(badge?.position ?? 0))
  const [isActive, setIsActive] = useState(badge?.is_active ?? true)

  const editing = Boolean(badge)
  const valid = key.trim() !== "" && label.trim() !== ""

  function save() {
    const base = {
      key: key.trim(),
      label: label.trim(),
      icon: icon.trim(),
      color: color.trim(),
      description: description.trim(),
      position: Number(position) || 0,
      isActive,
    }
    if (editing && badge) {
      mutations.update.mutate({ id: badge.id, input: base }, { onSuccess: () => setOpen(false) })
    } else {
      mutations.create.mutate(base, { onSuccess: () => setOpen(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit badge" : "New badge"}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-3">
          <Field className="flex-1">
            <FieldLabel>Label</FieldLabel>
            <Input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="Campus Ambassador"
              maxLength={40}
            />
          </Field>
          <Field className="w-40">
            <FieldLabel>Key</FieldLabel>
            <Input
              value={key}
              onChange={(event) => setKey(event.target.value)}
              placeholder="ambassador"
              maxLength={30}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Represents Snacc on their campus."
            maxLength={200}
          />
        </Field>
        <div className="flex gap-3">
          <Field className="flex-1">
            <FieldLabel>Icon</FieldLabel>
            <div className="flex items-center gap-2">
              <Input
                value={icon}
                onChange={(event) => setIcon(event.target.value)}
                placeholder="megaphone"
                maxLength={16}
              />
              <NamedIcon name={icon} color={color} className="size-5 shrink-0" />
            </div>
          </Field>
          <Field className="w-32">
            <FieldLabel>Color</FieldLabel>
            <Input
              value={color}
              onChange={(event) => setColor(event.target.value)}
              placeholder="#F97316"
              maxLength={24}
            />
          </Field>
          <Field className="w-24">
            <FieldLabel>Position</FieldLabel>
            <Input
              type="number"
              value={position}
              onChange={(event) => setPosition(event.target.value)}
            />
          </Field>
        </div>
        <Field orientation="horizontal">
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          <FieldLabel>Active — inactive badges stay granted but stop being worn.</FieldLabel>
        </Field>
        <p className="text-muted-foreground text-xs">
          Badges are handed out by hand and grant no permissions. Position orders them beside a name,
          lowest first. Icon is one of: {NAMED_ICON_NAMES.join(", ")}.
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

function DeleteBadgeDialog({ badge, mutations }: { badge: AdminBadge; mutations: Mutations }) {
  const [open, setOpen] = useState(false)
  const holders = badge.holders_count ?? 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="text-destructive">
            Delete
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {badge.label}?</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          {holders > 0
            ? `This takes it off ${holders} ${holders === 1 ? "person" : "people"} wearing it. To hide it without losing who has it, edit the badge and turn Active off instead.`
            : "Nobody is wearing this badge."}
        </p>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            variant="destructive"
            disabled={mutations.remove.isPending}
            onClick={() => mutations.remove.mutate(badge.id, { onSuccess: () => setOpen(false) })}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function HoldersDialog({ badge, mutations }: { badge: AdminBadge; mutations: Mutations }) {
  const [open, setOpen] = useState(false)
  const holders = useBadgeHolders(open ? badge.id : null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            Holders
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{badge.label} holders</DialogTitle>
        </DialogHeader>
        {holders.isPending ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : holders.data && holders.data.length > 0 ? (
          <div className="flex max-h-96 flex-col gap-2 overflow-y-auto">
            {(badge.holders_count ?? 0) > holders.data.length && (
              <p className="text-muted-foreground text-xs">
                Showing the {holders.data.length} most recent of {badge.holders_count}.
              </p>
            )}
            {holders.data.map((holder) => (
              <div key={holder.user.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {holder.user.display_name ?? holder.user.username ?? holder.user.email}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    @{holder.user.username ?? "—"}
                    {holder.note ? ` · ${holder.note}` : ""}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  disabled={mutations.revoke.isPending}
                  onClick={() =>
                    mutations.revoke.mutate({ id: badge.id, userId: holder.user.id })
                  }
                >
                  Revoke
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Nobody holds this badge yet. Grant it from a user&apos;s page.
          </p>
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Done</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function BadgesTable({
  badges,
  mutations,
}: {
  badges: AdminBadge[]
  mutations: Mutations
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <BadgeDialog mutations={mutations} trigger={<Button size="sm">Add badge</Button>} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Badge</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Holders</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {badges.map((badge) => (
            <TableRow key={badge.id}>
              <TableCell className="font-medium">
                <span className="inline-flex items-center gap-2">
                  <NamedIcon name={badge.icon} color={badge.color} className="size-4 shrink-0" />
                  {badge.label}
                  {badge.is_active ? null : <Badge variant="outline">Inactive</Badge>}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground max-w-sm truncate text-sm">
                {badge.description ?? "—"}
              </TableCell>
              <TableCell className="text-right tabular-nums">{badge.holders_count ?? 0}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <HoldersDialog badge={badge} mutations={mutations} />
                  <BadgeDialog
                    badge={badge}
                    mutations={mutations}
                    trigger={
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    }
                  />
                  <DeleteBadgeDialog badge={badge} mutations={mutations} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
