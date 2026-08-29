"use client"

import { Radio, VenetianMask } from "lucide-react"
import { useEffect, useState } from "react"
import { ConfirmAction } from "@/components/admin/confirm-action"
import { Stat, StatGrid } from "@/components/admin/detail"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { formatDate } from "@/lib/format"
import { OpenDialog } from "./open-dialog"
import { useGhostMutations, useGhostWindow } from "./use-ghost-hour"
import type { GhostWindowState } from "./types"

function useRemaining(state: GhostWindowState | undefined): number | null {
  const endsAt = state?.active ? state.ends_at : null
  const serverTime = state?.server_time ?? null

  const [base, setBase] = useState(serverTime)
  const [elapsed, setElapsed] = useState(0)

  if (base !== serverTime) {
    setBase(serverTime)
    setElapsed(0)
  }

  useEffect(() => {
    if (!endsAt) return
    const id = setInterval(() => setElapsed((value) => value + 1_000), 1_000)
    return () => clearInterval(id)
  }, [endsAt, base])

  if (!endsAt || !serverTime) return null

  return Math.max(0, Date.parse(endsAt) - Date.parse(serverTime) - elapsed)
}

function countdown(ms: number): string {
  const total = Math.floor(ms / 1000)
  const minutes = Math.floor(total / 60)
  const seconds = total % 60

  return `${minutes}:${String(seconds).padStart(2, "0")}`
}

export function GhostHourPanel() {
  const query = useGhostWindow()
  const actions = useGhostMutations()
  const remaining = useRemaining(query.data)

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
    <div className="flex flex-col gap-6">
      <div
        className={`flex flex-col gap-4 rounded-lg border p-6 sm:flex-row sm:items-center sm:justify-between ${
          state.active ? "border-resnacc/40 bg-resnacc/5" : ""
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`flex size-12 shrink-0 items-center justify-center rounded-full ${
              state.active ? "bg-resnacc/15 text-resnacc" : "bg-muted"
            }`}
          >
            {state.active ? (
              <Radio className="size-5" />
            ) : (
              <VenetianMask className="size-5" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">
                {state.active ? "Ghost Hour is live" : "Ghost Hour is closed"}
              </h2>
              {state.active && <Badge>live</Badge>}
            </div>
            <p className="text-sm text-pretty text-muted-foreground">
              {state.active && remaining !== null
                ? `${countdown(remaining)} left — closes ${formatDate(state.ends_at)}`
                : state.starts_at
                  ? `Next window opens ${formatDate(state.starts_at)}`
                  : "Nothing scheduled. The nightly job picks a slot each morning."}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          {state.active ? (
            <ConfirmAction
              label="Close now"
              title="Close Ghost Hour early?"
              description="Anonymous posting stops immediately for everyone, before the window was due to end. No push is sent when it closes."
              confirmLabel="Close the window"
              pending={actions.close.isPending}
              onConfirm={(close) =>
                actions.close.mutate(undefined, { onSuccess: close })
              }
            />
          ) : (
            <OpenDialog
              defaultMinutes={state.window_minutes}
              pending={actions.open.isPending}
              onOpen={(minutes, close) =>
                actions.open.mutate(minutes, { onSuccess: close })
              }
            />
          )}
        </div>
      </div>

      <StatGrid columns={4}>
        <Stat label="Default length" value={`${state.window_minutes} min`} />
        <Stat label="Opens" value={formatDate(state.starts_at)} />
        <Stat label="Closes" value={formatDate(state.ends_at)} />
        <Stat label="Server time" value={formatDate(state.server_time)} />
      </StatGrid>

      <p className="text-sm text-pretty text-muted-foreground">
        A window is scheduled automatically each morning between the earliest
        and latest hour set in Config. Opening one by hand starts it now and
        pushes every device; closing early stops it quietly.
      </p>
    </div>
  )
}
