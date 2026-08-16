"use client"

import { useState, type ReactElement } from "react"
import { DataPagination } from "@/components/data-pagination"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import type { Paginated } from "@/lib/api/types"
import type { useChallengeMutations } from "./use-challenges"
import type { AdminChallenge, ListChallengesParams } from "./types"

type Mutations = ReturnType<typeof useChallengeMutations>

const STATUS_VARIANT: Record<AdminChallenge["status"], "default" | "secondary" | "outline"> = {
  draft: "outline",
  active: "default",
  ended: "secondary",
}

function ChallengeDialog({
  challenge,
  mutations,
  trigger,
}: {
  challenge?: AdminChallenge
  mutations: Mutations
  trigger: ReactElement
}) {
  const editing = !!challenge
  const daysEditable = !editing || challenge.status === "draft"

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tag, setTag] = useState("")
  const [rewardNaira, setRewardNaira] = useState("")
  const [prompts, setPrompts] = useState("")

  function reset() {
    setTitle(challenge?.title ?? "")
    setDescription(challenge?.description ?? "")
    setTag(challenge?.tag ?? "")
    setRewardNaira(challenge ? String(challenge.reward_kobo / 100) : "")
    setPrompts(challenge ? challenge.day_prompts.map((day) => day.prompt).join("\n") : "")
  }

  const promptLines = prompts
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
  const rewardKobo = Math.round(Number(rewardNaira) * 100)
  const valid =
    title.trim() !== "" &&
    rewardKobo > 0 &&
    (editing ? true : tag.trim() !== "") &&
    (daysEditable ? promptLines.length > 0 : true)

  function submit() {
    const days = promptLines.map((prompt) => ({ prompt }))
    if (editing) {
      mutations.update.mutate(
        {
          id: challenge.id,
          input: {
            title: title.trim(),
            description: description.trim() || undefined,
            rewardKobo,
            ...(daysEditable ? { days } : {}),
          },
        },
        { onSuccess: () => setOpen(false) },
      )
    } else {
      mutations.create.mutate(
        {
          title: title.trim(),
          description: description.trim() || undefined,
          tag: tag.trim().replace(/^#/, ""),
          rewardKobo,
          days,
        },
        { onSuccess: () => setOpen(false) },
      )
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) reset()
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit challenge" : "New challenge"}</DialogTitle>
        </DialogHeader>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} />
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={2}
            maxLength={500}
          />
        </Field>
        <div className="flex gap-3">
          <Field className="flex-1">
            <FieldLabel>Tag (no #)</FieldLabel>
            <Input
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              disabled={editing}
              placeholder="snaccweek"
            />
          </Field>
          <Field className="flex-1">
            <FieldLabel>Reward / day (₦)</FieldLabel>
            <Input
              type="number"
              value={rewardNaira}
              onChange={(event) => setRewardNaira(event.target.value)}
            />
          </Field>
        </div>
        <Field>
          <FieldLabel>Day prompts — one per line</FieldLabel>
          <Textarea
            value={prompts}
            onChange={(event) => setPrompts(event.target.value)}
            rows={6}
            disabled={!daysEditable}
            placeholder={"Introduce yourself in 3 emojis\nPost your campus's hidden gem\n…"}
          />
          <p className="text-muted-foreground text-xs">
            {daysEditable
              ? `${promptLines.length} day${promptLines.length === 1 ? "" : "s"}`
              : "Day prompts can only be edited while the challenge is a draft."}
          </p>
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            disabled={!valid || mutations.create.isPending || mutations.update.isPending}
            onClick={submit}
          >
            {editing ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StatusAction({ challenge, mutations }: { challenge: AdminChallenge; mutations: Mutations }) {
  if (challenge.status === "draft") {
    return (
      <Button
        size="sm"
        variant="secondary"
        disabled={mutations.update.isPending}
        onClick={() => mutations.update.mutate({ id: challenge.id, input: { status: "active" } })}
      >
        Activate
      </Button>
    )
  }
  if (challenge.status === "active") {
    return (
      <Button
        size="sm"
        variant="secondary"
        disabled={mutations.update.isPending}
        onClick={() => mutations.update.mutate({ id: challenge.id, input: { status: "ended" } })}
      >
        End
      </Button>
    )
  }
  return null
}

export function ChallengesManager({
  data,
  params,
  onParams,
  mutations,
}: {
  data: Paginated<AdminChallenge>
  params: ListChallengesParams
  onParams: (patch: Partial<ListChallengesParams>) => void
  mutations: Mutations
}) {
  void params
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <ChallengeDialog mutations={mutations} trigger={<Button size="sm">New challenge</Button>} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Challenge</TableHead>
            <TableHead>Days</TableHead>
            <TableHead>Reward</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Players</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-muted-foreground py-10 text-center text-sm">
                No challenges yet.
              </TableCell>
            </TableRow>
          ) : (
            data.items.map((challenge) => (
              <TableRow key={challenge.id}>
                <TableCell className="max-w-xs">
                  <div className="font-medium">{challenge.title}</div>
                  <div className="text-muted-foreground text-xs">#{challenge.tag}</div>
                </TableCell>
                <TableCell>{challenge.days}</TableCell>
                <TableCell>₦{(challenge.reward_kobo / 100).toLocaleString()}/day</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[challenge.status]}>{challenge.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {challenge.participant_count} · {challenge.completion_count} done
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <StatusAction challenge={challenge} mutations={mutations} />
                  <ChallengeDialog
                    challenge={challenge}
                    mutations={mutations}
                    trigger={
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    }
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={mutations.remove.isPending}
                    onClick={() => mutations.remove.mutate(challenge.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <DataPagination
        page={data.page}
        lastPage={data.last_page}
        total={data.total}
        onPage={(page) => onParams({ page })}
      />
    </div>
  )
}
