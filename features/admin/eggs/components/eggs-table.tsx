"use client"

import { ConfirmAction } from "@/components/admin/confirm-action"

import { useRef, useState } from "react"
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
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { TableFrame } from "@/components/data-table/table-frame"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AdminEgg, EggRarity } from "../types"
import type { useEggMutations } from "../hooks/use-eggs"

type Mutations = ReturnType<typeof useEggMutations>

const RARITIES: EggRarity[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
]

function triggerText(trigger: unknown): string {
  return trigger ? JSON.stringify(trigger, null, 2) : ""
}

function EggDialog({
  egg,
  mutations,
  trigger,
}: {
  egg?: AdminEgg
  mutations: Mutations
  trigger: React.ReactElement
}) {
  const [open, setOpen] = useState(false)
  const [slug, setSlug] = useState(egg?.slug ?? "")
  const [name, setName] = useState(egg?.name ?? "")
  const [description, setDescription] = useState(egg?.description ?? "")
  const [hint, setHint] = useState(egg?.hint ?? "")
  const [rarity, setRarity] = useState<EggRarity>(egg?.rarity ?? "common")
  const [color, setColor] = useState(egg?.color ?? "#5b6ec2")
  const [enabled, setEnabled] = useState(egg?.enabled ?? true)
  const [spec, setSpec] = useState(triggerText(egg?.trigger))

  const editing = Boolean(egg)

  let specValid = true
  let parsedSpec: Record<string, unknown> | undefined
  if (spec.trim()) {
    try {
      parsedSpec = JSON.parse(spec) as Record<string, unknown>
    } catch {
      specValid = false
    }
  }

  const valid =
    name.trim() !== "" &&
    description.trim() !== "" &&
    /^#[0-9a-fA-F]{6}$/.test(color.trim()) &&
    specValid &&
    (editing || /^[a-z0-9-]{3,40}$/.test(slug.trim()))

  function save() {
    if (editing && egg) {
      mutations.update.mutate(
        {
          id: egg.id,
          input: {
            name: name.trim(),
            description: description.trim(),
            hint: hint.trim(),
            color: color.trim(),
            enabled,
            trigger: spec.trim() ? parsedSpec : null,
          },
        },
        { onSuccess: () => setOpen(false) }
      )
    } else {
      mutations.create.mutate(
        {
          slug: slug.trim(),
          name: name.trim(),
          description: description.trim(),
          hint: hint.trim() || undefined,
          rarity,
          color: color.trim(),
          trigger: parsedSpec,
        },
        { onSuccess: () => setOpen(false) }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit egg" : "Hide a new egg"}</DialogTitle>
        </DialogHeader>
        {editing ? null : (
          <div className="flex gap-3">
            <Field className="flex-1">
              <FieldLabel>Slug</FieldLabel>
              <Input
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="tuesday-surprise"
                maxLength={40}
              />
            </Field>
            <Field className="w-36">
              <FieldLabel>Rarity</FieldLabel>
              <NativeSelect
                value={rarity}
                onChange={(event) => setRarity(event.target.value as EggRarity)}
              >
                {RARITIES.map((tier) => (
                  <NativeSelectOption key={tier} value={tier}>
                    {tier}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
          </div>
        )}
        <div className="flex gap-3">
          <Field className="flex-1">
            <FieldLabel>Name</FieldLabel>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Sevens"
              maxLength={60}
            />
          </Field>
          <Field className="w-28">
            <FieldLabel>Colour</FieldLabel>
            <Input
              value={color}
              onChange={(event) => setColor(event.target.value)}
              placeholder="#c23d6e"
              maxLength={7}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Shown after it's found."
            maxLength={200}
          />
        </Field>
        <Field>
          <FieldLabel>Hint</FieldLabel>
          <Input
            value={hint}
            onChange={(event) => setHint(event.target.value)}
            placeholder="Blank keeps it fully secret."
            maxLength={120}
          />
        </Field>
        <Field>
          <FieldLabel>Trigger spec</FieldLabel>
          <Textarea
            value={spec}
            onChange={(event) => setSpec(event.target.value)}
            rows={6}
            className="font-mono text-xs"
            placeholder='{"on": "tap", "where": {"anchor": "wordmark"}, "burst": {"count": 7, "windowMs": 4000}}'
          />
        </Field>
        {editing ? (
          <Field className="flex-row items-center justify-between">
            <FieldLabel>Discoverable</FieldLabel>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </Field>
        ) : null}
        <p className="text-xs text-muted-foreground">
          The spec arms every client on its next refresh; blank means only the
          server can grant it. Verified eggs also need a server check, so keep
          admin-created ones to honest client triggers.
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

function ArtDialog({
  egg,
  mutations,
  trigger,
}: {
  egg: AdminEgg
  mutations: Mutations
  trigger: React.ReactElement
}) {
  const [open, setOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function upload() {
    const file = fileRef.current?.files?.[0]
    if (!file) return
    mutations.uploadImage.mutate(
      { id: egg.id, file },
      { onSuccess: () => setOpen(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Artwork — {egg.name}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-4">
          {egg.image_url ? (
            <img
              src={egg.image_url}
              alt={egg.name}
              className="size-24 rounded-full object-cover"
            />
          ) : (
            <div
              className="size-24 rounded-full"
              style={{ backgroundColor: `${egg.color}33` }}
            />
          )}
          <div className="flex flex-1 flex-col gap-2">
            <Input ref={fileRef} type="file" accept="image/*" />
            <p className="text-xs text-muted-foreground">
              Square works best; served at 512px on the reveal card.
            </p>
          </div>
        </div>
        <DialogFooter>
          {egg.image_url ? (
            <Button
              variant="ghost"
              disabled={mutations.removeImage.isPending}
              onClick={() =>
                mutations.removeImage.mutate(egg.id, {
                  onSuccess: () => setOpen(false),
                })
              }
            >
              Remove
            </Button>
          ) : null}
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button disabled={mutations.uploadImage.isPending} onClick={upload}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function EggsTable({
  eggs,
  mutations,
}: {
  eggs: AdminEgg[]
  mutations: Mutations
}) {
  return (
    <TableFrame
      toolbar={
        <div className="flex justify-end">
          <EggDialog
            mutations={mutations}
            trigger={<Button size="sm">Hide an egg</Button>}
          />
        </div>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Egg</TableHead>
            <TableHead>Rarity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Found by</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {eggs.map((egg) => (
            <TableRow key={egg.id}>
              <TableCell className="font-medium">
                <span className="inline-flex items-center gap-2">
                  {egg.image_url ? (
                    <img
                      src={egg.image_url}
                      alt=""
                      className="size-6 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      className="size-3 shrink-0 rounded-full"
                      style={{ backgroundColor: egg.color }}
                    />
                  )}
                  <span>
                    {egg.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {egg.slug}
                    </span>
                  </span>
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  style={{ borderColor: egg.color, color: egg.color }}
                >
                  {egg.rarity}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="inline-flex gap-1.5">
                  {egg.enabled ? (
                    <Badge variant="secondary">live</Badge>
                  ) : (
                    <Badge variant="outline">off</Badge>
                  )}
                  {egg.seeded ? null : <Badge variant="outline">custom</Badge>}
                </span>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {egg.discoveries_count.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <EggDialog
                    egg={egg}
                    mutations={mutations}
                    trigger={
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    }
                  />
                  <ArtDialog
                    egg={egg}
                    mutations={mutations}
                    trigger={
                      <Button variant="outline" size="sm">
                        Art
                      </Button>
                    }
                  />
                  {egg.seeded ? null : (
                    <ConfirmAction
                      label="Delete"
                      variant="ghost"
                      title="Delete this egg?"
                      description="Its discoveries go with it and clients stop hunting it on their next refresh."
                      confirmLabel="Delete egg"
                      pending={mutations.remove.isPending}
                      onConfirm={(close) =>
                        mutations.remove.mutate(egg.id, { onSuccess: close })
                      }
                    />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableFrame>
  )
}
