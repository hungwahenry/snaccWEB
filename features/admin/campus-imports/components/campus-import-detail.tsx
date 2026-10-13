"use client"

import type { ReactNode } from "react"
import {
  DetailHeader,
  EmptyNote,
} from "@/features/admin/shell/components/detail"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { formatDate, formatNumber } from "@/lib/format"
import type { CampusImport } from "../types"
import { IMPORT_STATUS, importTitle, startedBy } from "../utils/campus-imports"
import { ImportActions } from "./import-actions"
import { ImportTallies } from "./import-tallies"

export function CampusImportDetail({
  run,
  rows,
  onApply,
  onRecheck,
  onDiscard,
}: {
  run: CampusImport
  rows: ReactNode
  onApply: () => Promise<unknown>
  onRecheck: () => Promise<unknown>
  onDiscard: () => Promise<unknown>
}) {
  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        title={importTitle(run)}
        badges={<StatusBadge status={IMPORT_STATUS[run.status]} />}
        meta={
          <>
            <span>{run.country.name}</span>
            <span>
              Started {formatDate(run.created_at)} {startedBy(run)}
            </span>
            {run.applied_at ? (
              <span>Applied {formatDate(run.applied_at)}</span>
            ) : null}
          </>
        }
        actions={
          <ImportActions
            run={run}
            onApply={onApply}
            onRecheck={onRecheck}
            onDiscard={onDiscard}
          />
        }
      />
      {run.status === "checking" ? (
        <EmptyNote>
          Checking {formatNumber(run.rows.total)} campuses against Snacc and the
          public registry. This page updates when it&apos;s done.
        </EmptyNote>
      ) : run.status === "failed" ? (
        <EmptyNote>{run.problem ?? "The check didn't finish."}</EmptyNote>
      ) : (
        <>
          <ImportTallies rows={run.rows} />
          {rows}
        </>
      )}
    </div>
  )
}
