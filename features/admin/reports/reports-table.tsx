"use client"

import { useState } from "react"
import { DataPagination } from "@/components/data-pagination"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { formatDate } from "@/lib/format"
import type { Paginated } from "@/lib/api/types"
import type { useResolveReport } from "./use-reports"
import type { AdminReport, ListReportsParams, ResolveReportInput } from "./types"

const STATUS_VARIANT: Record<AdminReport["status"], "secondary" | "default" | "outline"> = {
  open: "secondary",
  actioned: "default",
  dismissed: "outline",
}

function targetLabel(target: AdminReport["target"]) {
  if (!target) return "—"
  if (target.type === "snacc") {
    const handle = target.snacc.author.username
      ? `@${target.snacc.author.username}`
      : target.snacc.author.display_name
    return `${target.snacc.body?.slice(0, 40) || "media snacc"} · ${handle}`
  }
  const handle = target.user.username ? `@${target.user.username}` : target.user.display_name
  return `User ${handle}`
}

function ResolveDialog({
  report,
  resolve,
}: {
  report: AdminReport
  resolve: ReturnType<typeof useResolveReport>
}) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<"actioned" | "dismissed">("actioned")
  const [note, setNote] = useState("")
  const [act, setAct] = useState(false)

  const isSnacc = report.target?.type === "snacc"
  const isUser = report.target?.type === "user"
  const actLabel = isSnacc ? "Also remove the snacc" : "Also suspend the user"

  function submit() {
    const input: ResolveReportInput = { status }
    if (isSnacc && report.target?.type === "snacc") input.snaccId = report.target.snacc.id
    if (isUser && report.target?.type === "user") input.reportedUserId = report.target.user.id
    if (note.trim()) input.note = note.trim()
    if (act) input.act = isSnacc ? "delete_snacc" : "suspend_user"
    resolve.mutate(input, { onSuccess: () => setOpen(false) })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            Resolve
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolve reports</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Resolves every open report on this {isSnacc ? "snacc" : "user"} together.
        </p>
        <Field>
          <FieldLabel>Outcome</FieldLabel>
          <Select value={status} onValueChange={(value) => value && setStatus(value as never)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="actioned">Actioned</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        {report.target && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{actLabel}</span>
            <Switch checked={act} onCheckedChange={setAct} />
          </div>
        )}
        <Field>
          <FieldLabel>Note (optional)</FieldLabel>
          <Textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            maxLength={500}
          />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button disabled={resolve.isPending} onClick={submit}>
            Resolve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ReportsTable({
  data,
  params,
  onParams,
  resolve,
}: {
  data: Paginated<AdminReport>
  params: ListReportsParams
  onParams: (patch: Partial<ListReportsParams>) => void
  resolve: ReturnType<typeof useResolveReport>
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={params.status ?? "all"}
          onValueChange={(value) =>
            onParams({ status: !value || value === "all" ? undefined : (value as never), page: 1 })
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="actioned">Actioned</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={params.targetType ?? "all"}
          onValueChange={(value) =>
            onParams({
              targetType: !value || value === "all" ? undefined : (value as never),
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Target" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All targets</SelectItem>
            <SelectItem value="snacc">Snaccs</SelectItem>
            <SelectItem value="user">Users</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Target</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Reporter</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reported</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-muted-foreground py-10 text-center text-sm">
                No reports match these filters.
              </TableCell>
            </TableRow>
          ) : (
            data.items.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="max-w-xs">
                  <p className="truncate text-sm">{targetLabel(report.target)}</p>
                  {report.detail && (
                    <p className="text-muted-foreground truncate text-xs">“{report.detail}”</p>
                  )}
                </TableCell>
                <TableCell className="text-sm">{report.reason.label}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {report.reporter.username ? `@${report.reporter.username}` : report.reporter.display_name}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[report.status]}>{report.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(report.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  {report.status === "open" ? (
                    <ResolveDialog report={report} resolve={resolve} />
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      {report.reviewed_by?.username ? `@${report.reviewed_by.username}` : "resolved"}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DataPagination
        page={data.page}
        lastPage={data.last_page}
        total={data.total}
        onPage={(page) => onParams({ page })}
      />
    </div>
  )
}
