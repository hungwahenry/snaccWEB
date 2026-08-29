"use client"

import { ConfirmAction } from "@/components/admin/confirm-action"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TableFrame } from "@/components/data-table/table-frame"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/format"
import type { usePageMutations } from "./use-pages"
import type { AdminPage } from "./types"

export function PagesTable({
  pages,
  mutations,
}: {
  pages: AdminPage[]
  mutations: ReturnType<typeof usePageMutations>
}) {
  return (
    <TableFrame
      toolbar={
        <div className="flex justify-end">
          <Button size="sm" render={<Link href="/admin/pages/new" />}>
            New page
          </Button>
        </div>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                No pages yet.
              </TableCell>
            </TableRow>
          ) : (
            pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell>
                  <div className="font-medium">{page.title}</div>
                  <div className="font-mono text-xs text-muted-foreground">
                    /{page.slug}
                  </div>
                </TableCell>
                <TableCell>
                  {page.status === "published" ? (
                    <Badge variant="secondary">published</Badge>
                  ) : (
                    <Badge variant="outline">draft</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(page.updated_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      render={<Link href={`/admin/pages/${page.id}`} />}
                    >
                      Edit
                    </Button>
                    <ConfirmAction
                      label="Delete"
                      variant="ghost"
                      title="Delete this page?"
                      description="Anyone following its link gets a 404 from the moment you confirm."
                      confirmLabel="Delete page"
                      pending={mutations.remove.isPending}
                      onConfirm={(close) =>
                        mutations.remove.mutate(page.id, { onSuccess: close })
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableFrame>
  )
}
