"use client"

import type { ReactElement } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { JsonBlock } from "@/features/admin/shell/components/json-block"
import { formatDate } from "@/lib/format"
import type { AuditLog } from "../types"
import { actionLabel, adminLabel } from "../utils/audit"

export function AuditChangeDialog({
  log,
  trigger,
}: {
  log: AuditLog
  trigger: ReactElement
}) {
  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{actionLabel(log.action)}</DialogTitle>
          <DialogDescription>
            By {adminLabel(log)} on {formatDate(log.created_at)}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <JsonBlock label="Before" value={log.before} />
          <JsonBlock label="After" value={log.after} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
