"use client"

import { useState, type ReactElement } from "react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCategories } from "./use-moderation"
import type {
  ModerationAction,
  ModerationRule,
  ModerationSurface,
} from "./index"
import type { useModerationMutations } from "./use-moderation"

const ACTIONS: { value: ModerationAction; label: string; hint: string }[] = [
  {
    value: "allow",
    label: "Allow",
    hint: "An exemption: never escalate this category here.",
  },
  {
    value: "flag",
    label: "Flag",
    hint: "Open a report. The content stays up.",
  },
  { value: "hold", label: "Hold", hint: "Hide it and open a report." },
  {
    value: "block",
    label: "Block",
    hint: "Refuse it outright, if the surface checks inline.",
  },
]

const SURFACES: ModerationSurface[] = [
  "snacc",
  "comment",
  "moment",
  "message",
  "anon_message",
  "profile",
]

export function RuleDialog({
  rule,
  surface,
  mutations,
  trigger,
}: {
  rule?: ModerationRule
  surface?: ModerationSurface
  mutations: ReturnType<typeof useModerationMutations>
  trigger: ReactElement
}) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    surface: rule?.surface ?? surface ?? "snacc",
    category: rule?.category ?? "",
    threshold: String(rule?.threshold ?? 0.85),
    action: rule?.action ?? ("flag" as ModerationAction),
    note: rule?.note ?? "",
  })

  // The categories the classifier has actually returned, so the list grows with theirs.
  const categories = useCategories().data ?? []
  const chosen = categories.find((entry) => entry.category === form.category)
  const editing = Boolean(rule)
  const threshold = Number(form.threshold)
  const valid =
    form.category.trim() !== "" &&
    Number.isFinite(threshold) &&
    threshold >= 0 &&
    threshold <= 1

  function save() {
    const input = {
      surface: form.surface as ModerationSurface,
      category: form.category.trim(),
      threshold,
      action: form.action,
      note: form.note.trim() || undefined,
    }

    if (editing && rule) {
      mutations.update.mutate(
        { id: rule.id, input },
        { onSuccess: () => setOpen(false) }
      )
    } else {
      mutations.create.mutate(input, { onSuccess: () => setOpen(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit rule" : "New rule"}</DialogTitle>
        </DialogHeader>

        <div className="flex gap-3">
          <Field className="flex-1">
            <FieldLabel>Surface</FieldLabel>
            <Select
              value={form.surface}
              onValueChange={(next) =>
                next && setForm({ ...form, surface: next as ModerationSurface })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SURFACES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field className="w-32">
            <FieldLabel>Threshold</FieldLabel>
            <Input
              inputMode="decimal"
              value={form.threshold}
              onChange={(event) =>
                setForm({ ...form, threshold: event.target.value })
              }
              placeholder="0.85"
            />
          </Field>
        </div>

        <Field>
          <FieldLabel>Category</FieldLabel>
          <Select
            value={form.category}
            onValueChange={(next) =>
              next && setForm({ ...form, category: next })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pick a category…" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((entry) => (
                <SelectItem key={entry.category} value={entry.category}>
                  {entry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {chosen ? (
            <p className="text-xs text-pretty text-muted-foreground">
              {chosen.description}
            </p>
          ) : null}
          {chosen && !chosen.scores_image ? (
            <p className="text-xs text-pretty text-destructive">
              Scored from text only — this rule will never fire on a picture.
            </p>
          ) : null}
        </Field>

        <Field>
          <FieldLabel>What it does</FieldLabel>
          <Select
            value={form.action}
            onValueChange={(next) =>
              next && setForm({ ...form, action: next as ModerationAction })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTIONS.map((action) => (
                <SelectItem key={action.value} value={action.value}>
                  {action.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {ACTIONS.find((action) => action.value === form.action)?.hint}
          </p>
        </Field>

        <Field>
          <FieldLabel>Why this number</FieldLabel>
          <Textarea
            value={form.note}
            onChange={(event) => setForm({ ...form, note: event.target.value })}
            rows={3}
            maxLength={500}
            placeholder="What you measured, or what you are trading off."
          />
        </Field>

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
