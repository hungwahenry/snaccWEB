"use client"
import { TableFrame } from "@/components/data-table/table-frame"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import type { AdminEngagementKind, EngagementChanges } from "../types"

type UpdateInput = { key: string } & EngagementChanges

function weight(value: number | null): string {
  return value === null ? "—" : String(value)
}

function EditDialog({
  kind,
  onUpdate,
  pending,
}: {
  kind: AdminEngagementKind
  onUpdate: (input: UpdateInput) => void
  pending: boolean
}) {
  const [open, setOpen] = useState(false)
  const [score, setScore] = useState(
    kind.score_weight === null ? "" : String(kind.score_weight)
  )
  const [feed, setFeed] = useState(
    kind.feed_weight === null ? "" : String(kind.feed_weight)
  )
  const [kobo, setKobo] = useState(
    kind.earn_kobo === null ? "" : String(kind.earn_kobo)
  )

  function save() {
    onUpdate({
      key: kind.key,
      scoreWeight: score.trim() === "" ? null : Number(score),
      feedWeight: feed.trim() === "" ? null : Number(feed),
      earnKobo: kobo.trim() === "" ? null : Number(kobo),
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            Reprice
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-mono text-sm">{kind.key}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{kind.description}</p>
        <Field>
          <FieldLabel htmlFor={`score-${kind.key}`}>
            Snacc Score points — shipped as {weight(kind.default_score_weight)}
          </FieldLabel>
          <Input
            id={`score-${kind.key}`}
            value={score}
            onChange={(event) => setScore(event.target.value)}
            placeholder="Empty earns nothing"
            inputMode="numeric"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={`feed-${kind.key}`}>
            Weight in the feed — shipped as {weight(kind.default_feed_weight)}
          </FieldLabel>
          <Input
            id={`feed-${kind.key}`}
            value={feed}
            onChange={(event) => setFeed(event.target.value)}
            placeholder="Empty is ignored by the feed"
            inputMode="decimal"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={`kobo-${kind.key}`}>
            Kobo paid to the author — shipped as{" "}
            {weight(kind.default_earn_kobo)}
          </FieldLabel>
          <Input
            id={`kobo-${kind.key}`}
            value={kobo}
            onChange={(event) => setKobo(event.target.value)}
            placeholder="Empty earns no money"
            inputMode="numeric"
          />
        </Field>
        <p className="text-xs text-muted-foreground">
          Points and kobo are frozen into each credit when it is earned, so a
          change here prices new engagement only and never restates
          anyone&apos;s score or balance. The feed weight is read live.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={pending}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function EngagementTable({
  kinds,
  onUpdate,
  onReset,
  pending,
}: {
  kinds: AdminEngagementKind[]
  onUpdate: (input: UpdateInput) => void
  onReset: (key: string) => void
  pending: boolean
}) {
  const groups = ["server", "client"] as const

  return (
    <div className="space-y-6">
      {groups.map((source) => {
        const rows = kinds.filter((kind) => kind.source === source)
        if (rows.length === 0) return null

        return (
          <TableFrame
            key={source}
            title={
              source === "server" ? "Recorded by Snacc" : "Reported by the app"
            }
            description={
              source === "server"
                ? "Rows we wrote ourselves, so the counts can be trusted."
                : "The app says these happened, so each is capped at one per person per snacc."
            }
          >
            <Table>
              <TableBody>
                {rows.map((kind) => (
                  <TableRow key={kind.key}>
                    <TableCell className="align-top">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{kind.label}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {kind.key}
                        </span>
                        {kind.is_default ? null : (
                          <Badge variant="outline">Changed from shipped</Badge>
                        )}
                        {kind.enabled ? null : (
                          <Badge variant="secondary">Off</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {kind.description}
                      </p>
                    </TableCell>
                    <TableCell className="w-28 text-right align-top tabular-nums">
                      <div className="text-sm">{weight(kind.score_weight)}</div>
                      <div className="text-xs text-muted-foreground">board</div>
                    </TableCell>
                    <TableCell className="w-28 text-right align-top tabular-nums">
                      <div className="text-sm">{weight(kind.feed_weight)}</div>
                      <div className="text-xs text-muted-foreground">feed</div>
                    </TableCell>
                    <TableCell className="w-28 text-right align-top tabular-nums">
                      <div className="text-sm">{weight(kind.earn_kobo)}</div>
                      <div className="text-xs text-muted-foreground">kobo</div>
                    </TableCell>
                    <TableCell className="w-44 text-right align-top">
                      <div className="flex justify-end gap-2">
                        {kind.is_default ? null : (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={pending}
                            onClick={() => onReset(kind.key)}
                          >
                            Reset
                          </Button>
                        )}
                        <EditDialog
                          kind={kind}
                          onUpdate={onUpdate}
                          pending={pending}
                        />
                        <Switch
                          checked={kind.enabled}
                          disabled={pending}
                          onCheckedChange={(enabled) =>
                            onUpdate({ key: kind.key, enabled })
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
      })}
    </div>
  )
}
