"use client"

import Link from "next/link"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CanAct } from "@/components/rbac/can"
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
import { Textarea } from "@/components/ui/textarea"
import { formatDate, handleOf } from "@/lib/format"
import { SnaccView } from "./snacc-view"
import type { useSnaccMutations } from "./use-snaccs"
import type { AdminSnaccDetail } from "./types"

const STATUS_VARIANT = {
  open: "secondary",
  actioned: "default",
  dismissed: "outline",
} as const

function RemoveDialog({
  snacc,
  actions,
}: {
  snacc: AdminSnaccDetail
  actions: ReturnType<typeof useSnaccMutations>
}) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="destructive" size="sm">
            Remove
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove this snacc?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          It disappears from the app but stays here, and its replies go with it.
        </p>
        <Field>
          <FieldLabel>Reason (optional)</FieldLabel>
          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            maxLength={500}
          />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button
            variant="destructive"
            disabled={actions.remove.isPending}
            onClick={() =>
              actions.remove.mutate(
                { id: snacc.id, reason: reason.trim() || undefined },
                { onSuccess: () => setOpen(false) }
              )
            }
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function SnaccDetail({
  snacc,
  actions,
}: {
  snacc: AdminSnaccDetail
  actions: ReturnType<typeof useSnaccMutations>
}) {
  const openReports = snacc.reports.filter(
    (report) => report.status === "open"
  ).length

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Snacc</CardTitle>
          <div className="flex gap-2">
            {snacc.deleted_at ? (
              <span className="text-sm text-muted-foreground">Removed</span>
            ) : (
              <>
                <CanAct permission="snaccs.hold">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      actions.hold.isPending || actions.release.isPending
                    }
                    onClick={() =>
                      snacc.held_at
                        ? actions.release.mutate(snacc.id)
                        : actions.hold.mutate({ id: snacc.id })
                    }
                  >
                    {snacc.held_at ? "Release" : "Hold"}
                  </Button>
                </CanAct>
                <RemoveDialog snacc={snacc} actions={actions} />
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              disabled={actions.pin.isPending || actions.unpin.isPending}
              onClick={() =>
                snacc.pinned
                  ? actions.unpin.mutate(snacc.id)
                  : actions.pin.mutate(snacc.id)
              }
            >
              {snacc.pinned ? "Unpin" : "Pin"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <SnaccView snacc={snacc} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {snacc.reports.length === 0
              ? "No reports"
              : `${snacc.reports.length} ${snacc.reports.length === 1 ? "report" : "reports"}${
                  openReports > 0 ? ` · ${openReports} open` : ""
                }`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {snacc.reports.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nobody has flagged this snacc.
            </p>
          ) : (
            snacc.reports.map((report) => (
              <div
                key={report.id}
                className="flex flex-col gap-1 border-b border-border py-3 last:border-b-0"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/reports/${report.id}`}
                    className="text-sm font-medium underline-offset-4 hover:underline"
                  >
                    {report.reason.label}
                  </Link>
                  <Badge variant={STATUS_VARIANT[report.status]}>
                    {report.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {handleOf(report.reporter)} ·{" "}
                    {formatDate(report.created_at)}
                  </span>
                </div>
                {report.detail ? (
                  <p className="text-sm text-muted-foreground">
                    “{report.detail}”
                  </p>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
