"use client"

import { useState } from "react"
import { DataPagination } from "@/components/data-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/format"
import type { Paginated } from "@/lib/api/types"
import type { AuditLog, ListAuditParams } from "./types"

function DiffDialog({ log }: { log: AuditLog }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm">
            View
          </Button>
        }
      />
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm">{log.action}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-muted-foreground mb-1 text-xs font-medium">Before</div>
            <pre className="bg-muted max-h-80 overflow-auto rounded-lg p-3 text-xs">
              {JSON.stringify(log.before, null, 2)}
            </pre>
          </div>
          <div>
            <div className="text-muted-foreground mb-1 text-xs font-medium">After</div>
            <pre className="bg-muted max-h-80 overflow-auto rounded-lg p-3 text-xs">
              {JSON.stringify(log.after, null, 2)}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function AuditTable({
  data,
  params,
  onParams,
}: {
  data: Paginated<AuditLog>
  params: ListAuditParams
  onParams: (patch: Partial<ListAuditParams>) => void
}) {
  const [action, setAction] = useState(params.action ?? "")

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          onParams({ action: action.trim() || undefined, page: 1 })
        }}
      >
        <Input
          placeholder="Filter by action, e.g. user.suspend"
          value={action}
          onChange={(event) => setAction(event.target.value)}
          className="max-w-xs"
        />
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>When</TableHead>
            <TableHead className="text-right">Detail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground py-10 text-center text-sm">
                No audit entries.
              </TableCell>
            </TableRow>
          ) : (
            data.items.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs">{log.action}</TableCell>
                <TableCell className="text-sm">
                  {log.admin_username ? `@${log.admin_username}` : log.admin_email}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{log.target_type}</Badge>
                  {log.target_id && (
                    <span className="text-muted-foreground ml-2 font-mono text-xs">
                      {log.target_id.slice(0, 8)}…
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(log.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <DiffDialog log={log} />
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
