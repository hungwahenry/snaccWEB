"use client"

import { Radio, VenetianMask } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import { Stat, StatGrid } from "@/features/admin/shell/components/detail"
import { formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { GhostWindowState } from "../types"
import { windowNote } from "../utils/ghost-hour"
import { OpenDialog } from "./open-dialog"

export function GhostHourPanel({
  state,
  remaining,
  onOpen,
  onClose,
}: {
  state: GhostWindowState
  remaining: number | null
  onOpen: (minutes: number | undefined) => Promise<unknown>
  onClose: () => Promise<unknown>
}) {
  return (
    <div className="flex flex-col gap-6">
      <div
        className={cn(
          "flex flex-col gap-4 rounded-lg border p-6 sm:flex-row sm:items-center sm:justify-between",
          state.active && "border-resnacc/40 bg-resnacc/5"
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-full",
              state.active ? "bg-resnacc/15 text-resnacc" : "bg-muted"
            )}
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
              {state.active ? <Badge>live</Badge> : null}
            </div>
            <p className="text-sm text-pretty text-muted-foreground">
              {windowNote(state, remaining)}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          {state.active ? (
            <ConfirmAction
              trigger={
                <Button variant="outline" size="sm">
                  Close now
                </Button>
              }
              title="Close Ghost Hour early?"
              description="Anonymous posting stops immediately for everyone, before the window was due to end. No push is sent when it closes."
              confirmLabel="Close the window"
              onConfirm={() => onClose()}
            />
          ) : (
            <OpenDialog
              defaultMinutes={state.window_minutes}
              trigger={<Button size="sm">Open Ghost Hour now</Button>}
              onOpen={onOpen}
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
