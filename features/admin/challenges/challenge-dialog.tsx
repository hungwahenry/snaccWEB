"use client"

import { Plus, X } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { AccentField } from "./accent-field"
import { useChallengeForm, type useChallengeMutations } from "./use-challenges"
import type { AdminChallenge } from "./types"

export function ChallengeDialog({
  challenge,
  mutations,
  trigger,
}: {
  challenge?: AdminChallenge
  mutations: ReturnType<typeof useChallengeMutations>
  trigger: ReactElement
}) {
  const [open, setOpen] = useState(false)
  const form = useChallengeForm(challenge, mutations, () => setOpen(false))

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) form.reset()
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent className="flex max-h-[85dvh] flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{form.editing ? "Edit challenge" : "New challenge"}</DialogTitle>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
          <Field>
            <FieldLabel>Title</FieldLabel>
            <Input value={form.title} onChange={(event) => form.setTitle(event.target.value)} maxLength={120} />
          </Field>
          <Field>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              value={form.description}
              onChange={(event) => form.setDescription(event.target.value)}
              rows={2}
              maxLength={500}
            />
          </Field>
          <div className="flex gap-3">
            <Field className="flex-1">
              <FieldLabel>Tag (no #)</FieldLabel>
              <Input
                value={form.tag}
                onChange={(event) => form.setTag(event.target.value)}
                disabled={form.editing}
                placeholder="snaccweek"
              />
            </Field>
            <Field className="flex-1">
              <FieldLabel>Reward / day (₦)</FieldLabel>
              <Input
                type="number"
                value={form.rewardNaira}
                onChange={(event) => form.setRewardNaira(event.target.value)}
              />
            </Field>
          </div>

          <AccentField from={form.accentFrom} to={form.accentTo} onChange={form.setAccent} />

          <Field>
            <FieldLabel>Day prompts</FieldLabel>
            <div className="flex flex-col gap-2">
              {form.prompts.map((prompt, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-muted-foreground w-12 shrink-0 text-xs">Day {index + 1}</span>
                  <Input
                    value={prompt}
                    onChange={(event) => form.setPromptAt(index, event.target.value)}
                    disabled={!form.daysEditable}
                    maxLength={280}
                    placeholder={`Prompt for day ${index + 1}`}
                  />
                  {form.daysEditable && form.prompts.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => form.removePrompt(index)}
                      aria-label={`Remove day ${index + 1}`}
                    >
                      <X className="size-4" />
                    </Button>
                  ) : null}
                </div>
              ))}
              {form.daysEditable ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="self-start"
                  onClick={form.addPrompt}
                >
                  <Plus className="size-4" /> Add day
                </Button>
              ) : (
                <p className="text-muted-foreground text-xs">
                  Day prompts can only be edited while the challenge is a draft.
                </p>
              )}
            </div>
          </Field>
        </div>

        <DialogFooter className="border-border border-t px-6 py-4">
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button disabled={!form.valid || form.submitting} onClick={form.submit}>
            {form.editing ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
