"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { formatDate } from "@/lib/format"
import { useGhostMutations, useGhostWindow } from "./use-ghost-hour"

function OpenDialog({
  defaultMinutes,
  pending,
  onOpen,
}: {
  defaultMinutes: number
  pending: boolean
  onOpen: (minutes: number | undefined, close: () => void) => void
}) {
  const [open, setOpen] = useState(false)
  const [minutes, setMinutes] = useState("")

  const parsed = Number(minutes)
  const value =
    minutes.trim() !== "" && Number.isFinite(parsed) && parsed > 0
      ? Math.round(parsed)
      : undefined

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm">Open Ghost Hour now</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Open Ghost Hour</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This broadcasts a push to{" "}
          <span className="font-medium text-foreground">every device</span> and
          turns on anonymous posting for the window.
        </p>
        <Field>
          <FieldLabel>Window length (minutes, optional)</FieldLabel>
          <Input
            type="number"
            value={minutes}
            onChange={(event) => setMinutes(event.target.value)}
            placeholder={String(defaultMinutes)}
          />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            disabled={pending}
            onClick={() => onOpen(value, () => setOpen(false))}
          >
            Open now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function GhostHourPanel() {
  const query = useGhostWindow()
  const actions = useGhostMutations()

  if (query.isPending) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    )
  }

  if (query.isError || !query.data) {
    return (
      <p className="text-sm text-muted-foreground">
        Couldn&apos;t load Ghost Hour state.
      </p>
    )
  }

  const state = query.data

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          Ghost Hour
          {state.active ? (
            <Badge>live</Badge>
          ) : (
            <Badge variant="outline">idle</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Open an anonymous window on demand. Default length{" "}
          {state.window_minutes} min.
        </p>

        <div className="text-sm">
          {state.active
            ? `Live until ${formatDate(state.ends_at)}`
            : state.starts_at
              ? `Next window scheduled for ${formatDate(state.starts_at)}`
              : "No window scheduled."}
        </div>

        {state.active ? (
          <div>
            <Button
              variant="outline"
              size="sm"
              disabled={actions.close.isPending}
              onClick={() => actions.close.mutate()}
            >
              Close now
            </Button>
          </div>
        ) : (
          <div>
            <OpenDialog
              defaultMinutes={state.window_minutes}
              pending={actions.open.isPending}
              onOpen={(minutes, close) =>
                actions.open.mutate(minutes, { onSuccess: close })
              }
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
