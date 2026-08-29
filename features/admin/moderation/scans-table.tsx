"use client"

import Link from "next/link"
import { Section } from "@/components/admin/detail"
import { TableFrame } from "@/components/data-table/table-frame"
import { Badge } from "@/components/ui/badge"
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
import { formatDate } from "@/lib/format"
import type { Paginated } from "@/lib/api/types"
import type { ModerationAction, ModerationScan } from "./index"

const ACTION_VARIANT: Record<
  ModerationAction,
  "outline" | "secondary" | "default" | "destructive"
> = {
  allow: "outline",
  flag: "secondary",
  hold: "default",
  block: "destructive",
}

function targetHref(scan: ModerationScan): string | null {
  if (scan.target.snacc_id) return `/admin/snaccs/${scan.target.snacc_id}`
  if (scan.target.user_id) return `/admin/users/${scan.target.user_id}`
  return null
}

export function ScansTable({
  data,
  verdict,
  onVerdict,
  onPage,
}: {
  data: Paginated<ModerationScan>
  verdict: string
  onVerdict: (next: string) => void
  onPage: (next: number) => void
}) {
  return (
    <Section
      title="Reviews"
      description="Every review the pipeline has done. What it decided and what it was allowed to do differ while enforcement is off."
    >
      <TableFrame
        page={data.page}
        perPage={data.per_page}
        total={data.total}
        onPageChange={onPage}
        toolbar={
          <Select
            value={verdict}
            onValueChange={(next) => next && onVerdict(next)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Verdict" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All verdicts</SelectItem>
              <SelectItem value="flag">Flag</SelectItem>
              <SelectItem value="hold">Hold</SelectItem>
              <SelectItem value="block">Block</SelectItem>
              <SelectItem value="allow">Allow</SelectItem>
            </SelectContent>
          </Select>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Surface</TableHead>
              <TableHead>Decided</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Because</TableHead>
              <TableHead className="text-right">Took</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  Nothing reviewed yet.
                </TableCell>
              </TableRow>
            ) : (
              data.items.map((scan) => {
                const href = targetHref(scan)

                return (
                  <TableRow key={scan.id}>
                    <TableCell className="text-sm whitespace-nowrap">
                      {href ? (
                        <Link
                          href={href}
                          className="underline-offset-4 hover:underline"
                        >
                          {formatDate(scan.created_at)}
                        </Link>
                      ) : (
                        formatDate(scan.created_at)
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{scan.surface}</TableCell>
                    <TableCell>
                      <Badge variant={ACTION_VARIANT[scan.verdict]}>
                        {scan.verdict}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {scan.applied === scan.verdict ? (
                        <Badge variant={ACTION_VARIANT[scan.applied]}>
                          {scan.applied}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {scan.applied} (not enforced)
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {scan.error ? (
                        <span className="text-destructive">{scan.error}</span>
                      ) : scan.category ? (
                        `${scan.category} ${scan.score?.toFixed(3)}`
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-right text-sm tabular-nums">
                      {scan.latency_ms ? `${scan.latency_ms} ms` : "—"}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableFrame>
    </Section>
  )
}
