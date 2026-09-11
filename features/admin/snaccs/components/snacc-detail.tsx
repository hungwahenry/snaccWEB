"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { REPORT_STATUS } from "@/features/admin/reports/utils/status"
import { ActionButton } from "@/features/admin/shell/components/action-button"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  DetailHeader,
  EmptyNote,
  Section,
} from "@/features/admin/shell/components/detail"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import { reportPath, snaccPath } from "@/features/admin/shell/routes"
import { formatDate } from "@/lib/format"
import type { AdminSnaccDetail, SnaccActions } from "../types"
import { reportTally, snaccBadges } from "../utils/snaccs"
import { SnaccView } from "./snacc-view"

function HeaderActions({
  snacc,
  actions,
}: {
  snacc: AdminSnaccDetail
  actions: SnaccActions
}) {
  return (
    <>
      <CanAct permission="snaccs.pin">
        <ActionButton
          variant="outline"
          size="sm"
          onClick={() =>
            snacc.pinned ? actions.unpin(snacc.id) : actions.pin(snacc.id)
          }
        >
          {snacc.pinned ? "Unpin" : "Pin"}
        </ActionButton>
      </CanAct>
      {snacc.deleted_at ? null : (
        <>
          <CanAct permission="snaccs.hold">
            {snacc.held_at ? (
              <ConfirmAction
                trigger={
                  <Button variant="outline" size="sm">
                    Release
                  </Button>
                }
                tone="default"
                title="Put this snacc back?"
                description="It becomes visible in every feed again, replies included."
                confirmLabel="Release it"
                onConfirm={() => actions.release(snacc.id)}
              />
            ) : (
              <ConfirmAction
                trigger={
                  <Button variant="outline" size="sm">
                    Hold
                  </Button>
                }
                title="Hold this snacc?"
                description="It is hidden from every feed while you decide, and its replies go with it. Nothing is deleted."
                confirmLabel="Hold it"
                onConfirm={() => actions.hold(snacc.id)}
              />
            )}
          </CanAct>
          <CanAct permission="snaccs.delete">
            <ConfirmAction
              trigger={
                <Button variant="destructive" size="sm">
                  Remove
                </Button>
              }
              title="Remove this snacc?"
              description="It disappears from the app but stays here, and its replies go with it."
              confirmLabel="Remove"
              reason={{ label: "Reason" }}
              onConfirm={(reason) => actions.remove(snacc.id, reason)}
            />
          </CanAct>
        </>
      )}
    </>
  )
}

export function SnaccDetail({
  snacc,
  actions,
}: {
  snacc: AdminSnaccDetail
  actions: SnaccActions
}) {
  const flagged = snacc.reports.length > 0

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        title={snacc.parent_id ? "Reply" : "Snacc"}
        badges={snaccBadges(snacc).map((badge) => (
          <StatusBadge key={badge.label} status={badge} />
        ))}
        meta={
          <>
            <span>Posted {formatDate(snacc.created_at)}</span>
            {flagged ? <span>{reportTally(snacc.reports)}</span> : null}
            {snacc.parent_id ? (
              <Link
                href={snaccPath(snacc.parent_id)}
                className="underline underline-offset-4"
              >
                Open the snacc it replies to
              </Link>
            ) : null}
          </>
        }
        actions={<HeaderActions snacc={snacc} actions={actions} />}
      />

      <SnaccView snacc={snacc} />

      <Section title={flagged ? reportTally(snacc.reports) : "Reports"}>
        {flagged ? (
          <div className="divide-y rounded-lg border">
            {snacc.reports.map((report) => (
              <div key={report.id} className="flex flex-col gap-2 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={reportPath(report.id)}
                      className="text-sm font-medium underline-offset-4 hover:underline"
                    >
                      {report.reason.label}
                    </Link>
                    <StatusBadge status={REPORT_STATUS[report.status]} />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(report.created_at)}
                  </span>
                </div>
                {report.reporter ? (
                  <UserCell user={report.reporter} size="sm" />
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
        ) : (
          <EmptyNote>Nobody has flagged this snacc.</EmptyNote>
        )}
      </Section>
    </div>
  )
}
