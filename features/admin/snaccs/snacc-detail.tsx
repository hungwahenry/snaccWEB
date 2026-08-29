"use client"

import Link from "next/link"
import { useState } from "react"
import { ConfirmAction } from "@/components/admin/confirm-action"
import { DetailHeader, Section } from "@/components/admin/detail"
import { CanAct } from "@/components/rbac/can"
import { UserInline } from "@/components/admin/user-inline"
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
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/format"
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
  const open = snacc.reports.filter((report) => report.status === "open").length

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        title={snacc.parent_id ? "Reply" : "Snacc"}
        badges={
          <>
            {snacc.pinned ? <Badge variant="outline">Pinned</Badge> : null}
            {snacc.held_at ? <Badge variant="secondary">Held</Badge> : null}
            {snacc.deleted_at ? (
              <Badge variant="destructive">Removed</Badge>
            ) : null}
          </>
        }
        meta={
          <>
            <span>Posted {formatDate(snacc.created_at)}</span>
            {snacc.reports.length > 0 ? (
              <span>
                {snacc.reports.length} reports
                {open > 0 ? ` · ${open} open` : ""}
              </span>
            ) : null}
            {snacc.parent_id ? (
              <Link
                href={`/admin/snaccs/${snacc.parent_id}`}
                className="underline underline-offset-4"
              >
                Open the snacc it replies to
              </Link>
            ) : null}
          </>
        }
        actions={
          <>
            <CanAct permission="snaccs.pin">
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
            </CanAct>
            {snacc.deleted_at ? null : (
              <>
                <CanAct permission="snaccs.hold">
                  {snacc.held_at ? (
                    <ConfirmAction
                      label="Release"
                      confirmVariant="default"
                      title="Put this snacc back?"
                      description="It becomes visible in every feed again, replies included."
                      confirmLabel="Release it"
                      pending={actions.release.isPending}
                      onConfirm={(close) =>
                        actions.release.mutate(snacc.id, { onSuccess: close })
                      }
                    />
                  ) : (
                    <ConfirmAction
                      label="Hold"
                      title="Hold this snacc?"
                      description="It is hidden from every feed while you decide, and its replies go with it. Nothing is deleted."
                      confirmLabel="Hold it"
                      pending={actions.hold.isPending}
                      onConfirm={(close) =>
                        actions.hold.mutate(
                          { id: snacc.id },
                          { onSuccess: close }
                        )
                      }
                    />
                  )}
                </CanAct>
                <CanAct permission="snaccs.delete">
                  <RemoveDialog snacc={snacc} actions={actions} />
                </CanAct>
              </>
            )}
          </>
        }
      />

      <SnaccView snacc={snacc} />

      <Section
        title={
          snacc.reports.length === 0
            ? "Reports"
            : `${snacc.reports.length} ${snacc.reports.length === 1 ? "report" : "reports"}${open > 0 ? ` · ${open} open` : ""}`
        }
      >
        {snacc.reports.length === 0 ? (
          <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
            Nobody has flagged this snacc.
          </p>
        ) : (
          <div className="divide-y rounded-lg border">
            {snacc.reports.map((report) => (
              <div key={report.id} className="flex flex-col gap-2 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
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
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(report.created_at)}
                  </span>
                </div>
                {report.reporter ? (
                  <UserInline user={report.reporter} size="sm" />
                ) : (
                  <Badge variant="outline">Automatic check</Badge>
                )}
                {report.detail ? (
                  <p className="text-sm text-pretty text-muted-foreground">
                    “{report.detail}”
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}
