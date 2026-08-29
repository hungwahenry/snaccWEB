"use client"

import { Section } from "@/components/admin/detail"
import { TableFrame } from "@/components/data-table/table-frame"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatNumber } from "@/lib/format"
import type { CategoryUsage } from "../types"

export function CategoriesTable({
  categories,
}: {
  categories: CategoryUsage[]
}) {
  return (
    <Section
      title="Categories"
      description="What the classifier can score, and which of them you have rules for. A category with no rule is scored and recorded but never acted on."
    >
      <TableFrame>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Scores from</TableHead>
              <TableHead>Rules</TableHead>
              <TableHead className="text-right">Seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((entry) => (
              <TableRow key={entry.category}>
                <TableCell>
                  <p className="font-medium">{entry.label}</p>
                  <p className="max-w-lg text-xs text-pretty text-muted-foreground">
                    {entry.description}
                  </p>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {entry.category}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.scores_text ? (
                      <Badge variant="outline">text</Badge>
                    ) : null}
                    {entry.scores_image ? (
                      <Badge variant="outline">images</Badge>
                    ) : (
                      <Badge variant="secondary">text only</Badge>
                    )}
                    {entry.unknown ? <Badge>new</Badge> : null}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {entry.ruled.length === 0 ? (
                    <span className="text-destructive">none</span>
                  ) : (
                    entry.ruled.join(", ")
                  )}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatNumber(entry.scans)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableFrame>
    </Section>
  )
}
