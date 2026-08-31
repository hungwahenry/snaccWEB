"use client"

import { useState } from "react"
import { Fact, Facts, Section } from "@/components/admin/detail"
import { TableFrame } from "@/components/data-table/table-frame"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatNumber } from "@/lib/format"
import { useWebhookStats, useWebhooks } from "../hooks/use-webhooks"
import type { WebhookEvent, WebhookFilters, WebhookStatus } from "../types"
import { WebhookPayload } from "./webhook-payload"

const PROVIDERS: Record<string, string> = {
  revenuecat: "RevenueCat",
  paystack: "Paystack",
}

const STATUS_VARIANT: Record<WebhookStatus, "secondary" | "outline" | "destructive"> = {
  received: "outline",
  applied: "secondary",
  ignored: "outline",
  failed: "destructive",
}

export function WebhooksView() {
  const [params, setParams] = useState<WebhookFilters>({ page: 1 })
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState<string | null>(null)
  const stats = useWebhookStats()
  const events = useWebhooks(params)

  function patch(next: Partial<WebhookFilters>) {
    setParams((current) => ({ ...current, ...next }))
  }

  return (
    <div className="flex flex-col gap-6">
      <Section title="Deliveries">
        {stats.isPending ? (
          <Spinner />
        ) : stats.data ? (
          <Facts>
            <Fact label="Failed" value={formatNumber(stats.data.failed)} />
            {stats.data.byProvider.map((row) => (
              <Fact
                key={`${row.provider}:${row.status}`}
                label={`${PROVIDERS[row.provider] ?? row.provider} · ${row.status}`}
                value={formatNumber(row.count)}
              />
            ))}
          </Facts>
        ) : (
          <p className="text-sm text-muted-foreground">
            Couldn&apos;t load delivery figures.
          </p>
        )}
      </Section>

      <Section
        title="Log"
        description="Every delivery is recorded before it is acted on, so one that changed nothing is still here with the reason why. A provider that redelivers is applied once — unless the first attempt failed, which is retried."
      >
        <div className="flex flex-wrap items-center gap-2">
          <form
            className="flex-1"
            onSubmit={(event) => {
              event.preventDefault()
              patch({ q: search.trim() || undefined, page: 1 })
            }}
          >
            <Input
              placeholder="Search by name"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="max-w-xs"
            />
          </form>

          <Select
            value={params.provider ?? "all"}
            onValueChange={(value) =>
              patch({
                provider: value === "all" ? undefined : (value as never),
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All providers</SelectItem>
              <SelectItem value="revenuecat">RevenueCat</SelectItem>
              <SelectItem value="paystack">Paystack</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={params.status ?? "all"}
            onValueChange={(value) =>
              patch({
                status: value === "all" ? undefined : (value as never),
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Outcome" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All outcomes</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="ignored">Ignored</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="received">Unsettled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {events.isPending ? (
          <Spinner />
        ) : events.data ? (
          <TableFrame
            page={events.data.page}
            perPage={events.data.per_page}
            total={events.data.total}
            onPageChange={(page) => patch({ page })}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Who</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.data.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground">
                      Nothing delivered yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  events.data.items.map((row) => (
                    <EventRow
                      key={row.id}
                      row={row}
                      onOpen={() => setOpen(row.id)}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </TableFrame>
        ) : (
          <p className="text-sm text-muted-foreground">
            Couldn&apos;t load the log.
          </p>
        )}
      </Section>

      <WebhookPayload id={open} onClose={() => setOpen(null)} />
    </div>
  )
}

function EventRow({ row, onOpen }: { row: WebhookEvent; onOpen: () => void }) {
  const name = row.user
    ? (row.user.username ?? row.user.display_name ?? row.user.id)
    : null

  return (
    <TableRow className="cursor-pointer" onClick={onOpen}>
      <TableCell>{PROVIDERS[row.provider] ?? row.provider}</TableCell>
      <TableCell className="font-medium">{row.type}</TableCell>
      <TableCell className="text-muted-foreground">{name ?? "—"}</TableCell>
      <TableCell>
        <div className="flex flex-col items-start gap-1">
          <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>
          {row.note ? (
            <span className="text-muted-foreground text-xs">{row.note}</span>
          ) : null}
        </div>
      </TableCell>
      <TableCell className="tabular-nums">{formatDate(row.created_at)}</TableCell>
    </TableRow>
  )
}
