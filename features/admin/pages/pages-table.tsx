"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button size="sm" render={<Link href="/admin/pages/new" />}>
          New page
        </Button>
      </div>
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
              <TableCell colSpan={4} className="text-muted-foreground py-10 text-center text-sm">
                No pages yet.
              </TableCell>
            </TableRow>
          ) : (
            pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell>
                  <div className="font-medium">{page.title}</div>
                  <div className="text-muted-foreground font-mono text-xs">/{page.slug}</div>
                </TableCell>
                <TableCell>
                  {page.status === "published" ? (
                    <Badge variant="secondary">published</Badge>
                  ) : (
                    <Badge variant="outline">draft</Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(page.updated_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" render={<Link href={`/admin/pages/${page.id}`} />}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={mutations.remove.isPending}
                      onClick={() => mutations.remove.mutate(page.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
