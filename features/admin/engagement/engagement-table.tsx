"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import type { AdminEngagementKind, EngagementChanges } from "./index"

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
  const [score, setScore] = useState(kind.score_weight === null ? "" : String(kind.score_weight))
  const [feed, setFeed] = useState(kind.feed_weight === null ? "" : String(kind.feed_weight))

  function save() {
    onUpdate({
      key: kind.key,
      scoreWeight: score.trim() === "" ? null : Number(score),
      feedWeight: feed.trim() === "" ? null : Number(feed),
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
        <p className="text-muted-foreground text-sm">{kind.description}</p>
        <Field>
          <FieldLabel htmlFor={`score-${kind.key}`}>
            Points on the board — shipped as {weight(kind.default_score_weight)}
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
        <p className="text-muted-foreground text-xs">
          Points are frozen into each credit when it is earned, so a change here prices new
          engagement only and never restates anyone&apos;s score. The feed weight is read live.
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
          <Card key={source}>
            <CardHeader>
              <CardTitle className="text-base">
                {source === "server" ? "Recorded by Snacc" : "Reported by the app"}
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {source === "server"
                  ? "Rows we wrote ourselves, so the counts can be trusted."
                  : "The app says these happened, so each is capped at one per person per snacc."}
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {rows.map((kind) => (
                    <TableRow key={kind.key}>
                      <TableCell className="align-top">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{kind.label}</span>
                          <span className="text-muted-foreground font-mono text-xs">{kind.key}</span>
                          {kind.is_default ? null : (
                            <Badge variant="outline">Changed from shipped</Badge>
                          )}
                          {kind.enabled ? null : <Badge variant="secondary">Off</Badge>}
                        </div>
                        <p className="text-muted-foreground mt-1 text-sm">{kind.description}</p>
                      </TableCell>
                      <TableCell className="w-28 text-right align-top tabular-nums">
                        <div className="text-sm">{weight(kind.score_weight)}</div>
                        <div className="text-muted-foreground text-xs">board</div>
                      </TableCell>
                      <TableCell className="w-28 text-right align-top tabular-nums">
                        <div className="text-sm">{weight(kind.feed_weight)}</div>
                        <div className="text-muted-foreground text-xs">feed</div>
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
                          <EditDialog kind={kind} onUpdate={onUpdate} pending={pending} />
                          <Switch
                            checked={kind.enabled}
                            disabled={pending}
                            onCheckedChange={(enabled) => onUpdate({ key: kind.key, enabled })}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
