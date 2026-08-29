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
import { Textarea } from "@/components/ui/textarea"
import type { AdminPrompt } from "./types"
import type { usePromptMutations } from "./use-onboarding-prompts"

type Mutations = ReturnType<typeof usePromptMutations>

function PromptDialog({
  prompt,
  mutations,
  trigger,
}: {
  prompt?: AdminPrompt
  mutations: Mutations
  trigger: React.ReactElement
}) {
  const [open, setOpen] = useState(false)
  const [emoji, setEmoji] = useState(prompt?.emoji ?? "")
  const [label, setLabel] = useState(prompt?.label ?? "")
  const [placeholder, setPlaceholder] = useState(prompt?.placeholder ?? "")
  const [position, setPosition] = useState(String(prompt?.position ?? 0))

  const editing = Boolean(prompt)
  const valid =
    emoji.trim() !== "" && label.trim() !== "" && placeholder.trim() !== ""

  function save() {
    const base = {
      emoji: emoji.trim(),
      label: label.trim(),
      placeholder: placeholder.trim(),
      position: Number(position) || 0,
    }
    if (editing && prompt) {
      mutations.update.mutate(
        { id: prompt.id, input: base },
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
          <DialogTitle>{editing ? "Edit prompt" : "New prompt"}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-3">
          <Field className="w-24">
            <FieldLabel>Emoji</FieldLabel>
            <Input
              value={emoji}
              onChange={(event) => setEmoji(event.target.value)}
              placeholder="🔥"
              maxLength={16}
            />
          </Field>
          <Field className="flex-1">
            <FieldLabel>Label</FieldLabel>
            <Input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="Hot take"
              maxLength={100}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel>Placeholder</FieldLabel>
          <Textarea
            value={placeholder}
            onChange={(event) => setPlaceholder(event.target.value)}
            placeholder="Drop a hot take about {campus}…"
            maxLength={200}
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
        <p className="text-xs text-muted-foreground">
          {"{campus}"} is replaced with the user&apos;s campus acronym.
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

export function PromptsTable({
  prompts,
  mutations,
}: {
  prompts: AdminPrompt[]
  mutations: Mutations
}) {
  return (
    <TableFrame
      toolbar={
        <div className="flex justify-end">
          <PromptDialog
            mutations={mutations}
            trigger={<Button size="sm">Add prompt</Button>}
          />
        </div>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prompt</TableHead>
            <TableHead>Placeholder</TableHead>
            <TableHead className="text-right">Position</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prompts.map((prompt) => (
            <TableRow key={prompt.id}>
              <TableCell className="font-medium">
                <span className="mr-1.5">{prompt.emoji}</span>
                {prompt.label}
              </TableCell>
              <TableCell className="max-w-sm truncate text-sm text-muted-foreground">
                {prompt.placeholder}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {prompt.position}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <PromptDialog
                    prompt={prompt}
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
                    title="Delete this prompt?"
                    description="New sign-ups will stop being offered it. Answers people already gave stay where they are."
                    confirmLabel="Delete prompt"
                    pending={mutations.remove.isPending}
                    onConfirm={(close) =>
                      mutations.remove.mutate(prompt.id, { onSuccess: close })
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
