"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AuthorInline,
  SnaccMedia,
  SnaccView,
} from "@/features/admin/snaccs/snacc-view"
import { formatDate } from "@/lib/format"
import type { AdminReportDetail } from "./types"

export function ReportedContent({ report }: { report: AdminReportDetail }) {
  const target = report.target

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Reported content</CardTitle>
      </CardHeader>
      <CardContent>
        {report.snacc ? (
          <div className="flex flex-col gap-3">
            <SnaccView snacc={report.snacc} />
            <Link
              href={`/admin/snaccs/${report.snacc.id}`}
              className="text-sm font-medium underline underline-offset-4"
            >
              Open the snacc →
            </Link>
          </div>
        ) : target?.type === "snacc" ? (
          <p className="text-muted-foreground text-sm">This snacc is no longer available.</p>
        ) : target?.type === "message" ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <AuthorInline
                author={target.message.sender}
                note={`Sent as “${target.message.conversation.pseudonym}” · ${formatDate(target.message.created_at)}`}
              />
              {target.message.deleted_at ? (
                <Badge variant="destructive">Already removed</Badge>
              ) : null}
            </div>
            {target.message.body ? (
              <p className="whitespace-pre-wrap text-sm">{target.message.body}</p>
            ) : null}
            <SnaccMedia images={target.message.images} gif={null} />
            <Link
              href={`/admin/messages/${target.message.conversation.id}`}
              className="text-sm font-medium underline underline-offset-4"
            >
              View the full thread →
            </Link>
          </div>
        ) : target?.type === "user" ? (
          <AuthorInline author={target.user} note="The account itself was reported." />
        ) : (
          <p className="text-muted-foreground text-sm">The reported target no longer exists.</p>
        )}
      </CardContent>
    </Card>
  )
}
