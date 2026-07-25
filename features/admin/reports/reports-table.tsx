"use client"

import Link from "next/link"
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

function handleOf(author: { username: string | null; display_name: string | null }) {
  return author.username ? `@${author.username}` : (author.display_name ?? "unknown")
}

function targetLabel(target: AdminReport["target"]) {
  if (!target) return "—"
  if (target.type === "snacc") {
    return `${target.snacc.body?.slice(0, 40) || "media snacc"} · ${handleOf(target.snacc.author)}`
  }
  if (target.type === "user") {
    return `User ${handleOf(target.user)}`
  }
  // A DM is de-masked here: the real sender behind the pseudonym.
  return `${target.message.body?.slice(0, 40) || "message"} · ${handleOf(target.message.sender)}`
}

const TARGET_NOUN = { snacc: "snacc", user: "user", message: "message" } as const

function actChoicesFor(target: AdminReport["target"]) {
  if (target?.type === "snacc") return [{ value: "delete_snacc", label: "Remove the snacc" }]
  if (target?.type === "user") return [{ value: "suspend_user", label: "Suspend the user" }]
  if (target?.type === "message")
    return [
      { value: "delete_message", label: "Remove the message" },
      { value: "suspend_sender", label: "Suspend the sender" },
    ]
  return []
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
  const [act, setAct] = useState<string>("none")

  const target = report.target
  const noun = target ? TARGET_NOUN[target.type] : "target"
  const actChoices = actChoicesFor(target)
  const threadId = target?.type === "message" ? target.message.conversation.id : null

  function submit() {
    const input: ResolveReportInput = { status }
    if (target?.type === "snacc") input.snaccId = target.snacc.id
    else if (target?.type === "user") input.reportedUserId = target.user.id
    else if (target?.type === "message") input.messageId = target.message.id
    if (note.trim()) input.note = note.trim()
    if (act !== "none") input.act = act as ResolveReportInput["act"]
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
          Resolves every open report on this {noun} together.
        </p>
        {threadId ? (
          <Link
            href={`/admin/messages/${threadId}`}
            className="text-sm font-medium underline underline-offset-4"
          >
            View the full thread →
          </Link>
        ) : null}
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
        {actChoices.length > 0 && (
          <Field>
            <FieldLabel>Action (optional)</FieldLabel>
            <Select value={act} onValueChange={(value) => setAct(value || "none")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Resolve only</SelectItem>
                {actChoices.map((choice) => (
                  <SelectItem key={choice.value} value={choice.value}>
                    {choice.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
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
            <SelectItem value="message">Messages</SelectItem>
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
