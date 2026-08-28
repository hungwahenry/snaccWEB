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
          <p className="text-sm text-muted-foreground">
            This snacc is no longer available.
          </p>
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
              <p className="text-sm whitespace-pre-wrap">
                {target.message.body}
              </p>
            ) : null}
            <SnaccMedia images={target.message.images} gif={null} />
            <Link
              href={`/admin/messages/${target.message.conversation.id}`}
              className="text-sm font-medium underline underline-offset-4"
            >
              View the full thread →
            </Link>
          </div>
        ) : target?.type === "moment" ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <AuthorInline
                author={target.moment.author}
                note={`Moment · ran out ${formatDate(target.moment.expires_at)}`}
              />
              <div className="flex gap-2">
                {target.moment.held ? (
                  <Badge variant="secondary">Held for review</Badge>
                ) : null}
                {target.moment.deleted_at ? (
                  <Badge variant="destructive">Already removed</Badge>
                ) : null}
              </div>
            </div>
            {target.moment.body ? (
              target.moment.images.length === 0 ? (
                <div
                  className="flex min-h-32 items-center justify-center rounded-lg px-6 py-8"
                  style={{
                    backgroundColor: target.moment.background ?? "#000000",
                  }}
                >
                  <p className="text-center text-lg font-semibold text-white">
                    {target.moment.body}
                  </p>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">
                  {target.moment.body}
                </p>
              )
            ) : null}
            <SnaccMedia images={target.moment.images} gif={null} />
            <p className="text-xs text-muted-foreground">
              A moment is deleted for good once released, so decide from what is
              shown here.
            </p>
          </div>
        ) : target?.type === "user" ? (
          <AuthorInline
            author={target.user}
            note="The account itself was reported."
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            The reported target no longer exists.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
