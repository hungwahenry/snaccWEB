"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { ContentMedia } from "@/components/admin/content-media"
import { Section } from "@/components/admin/detail"
import { UserInline, type InlineUser } from "@/components/admin/user-inline"
import { Badge } from "@/components/ui/badge"
import { SnaccView } from "@/features/admin/snaccs/components/snacc-view"
import { formatDate, handleOf } from "@/lib/format"
import type { AdminReportDetail, ReportTarget } from "../types"

function Gone({ what }: { what: string }) {
  return (
    <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
      This {what} is no longer available to show.
    </p>
  )
}

function Framed({
  author,
  note,
  badges,
  link,
  children,
}: {
  author: InlineUser
  note: string
  badges?: ReactNode
  link?: { href: string; label: string }
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <UserInline user={author} note={note} />
        <div className="flex flex-wrap gap-2 empty:hidden">{badges}</div>
      </div>
      {children}
      {link ? (
        <Link
          href={link.href}
          className="text-sm font-medium underline underline-offset-4"
        >
          {link.label} →
        </Link>
      ) : null}
    </div>
  )
}

function ReportedMessage({
  message,
}: {
  message: Extract<NonNullable<ReportTarget>, { type: "message" }>["message"]
}) {
  return (
    <Framed
      author={message.sender}
      note={`Sent as “${message.conversation.pseudonym}” · ${formatDate(message.created_at)}`}
      badges={
        <>
          {message.conversation.revealed ? (
            <Badge variant="outline">Revealed</Badge>
          ) : (
            <Badge variant="secondary">Still anonymous</Badge>
          )}
          {message.deleted_at ? (
            <Badge variant="destructive">Removed</Badge>
          ) : null}
        </>
      }
      link={{
        href: `/admin/messages/${message.conversation.id}`,
        label: "Read the whole thread",
      }}
    >
      {message.body ? (
        <p className="text-sm whitespace-pre-wrap">{message.body}</p>
      ) : null}
      <ContentMedia
        images={message.images}
        gif={message.gif}
        sticker={message.sticker}
      />
      <p className="text-xs text-muted-foreground">
        Sent to {handleOf(message.conversation.target)}.
      </p>
    </Framed>
  )
}

function ReportedMoment({
  moment,
}: {
  moment: Extract<NonNullable<ReportTarget>, { type: "moment" }>["moment"]
}) {
  return (
    <Framed
      author={moment.author}
      note={`Moment · ran out ${formatDate(moment.expires_at)}`}
      badges={
        <>
          {moment.held ? (
            <Badge variant="secondary">Held for review</Badge>
          ) : null}
          {moment.deleted_at ? (
            <Badge variant="destructive">Removed</Badge>
          ) : null}
        </>
      }
    >
      {moment.body && moment.images.length === 0 ? (
        <div
          className="flex min-h-32 items-center justify-center rounded-lg px-6 py-8"
          style={{ backgroundColor: moment.background ?? "#000000" }}
        >
          <p className="text-center text-lg font-semibold text-white">
            {moment.body}
          </p>
        </div>
      ) : moment.body ? (
        <p className="text-sm whitespace-pre-wrap">{moment.body}</p>
      ) : null}
      <ContentMedia images={moment.images} />
      <p className="text-xs text-muted-foreground">
        A moment is gone for good once released, so decide from what is shown
        here.
      </p>
    </Framed>
  )
}

export function ReportedContent({ report }: { report: AdminReportDetail }) {
  const target = report.target

  return (
    <Section title="Reported content">
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
      ) : target === null ? (
        <Gone what="target" />
      ) : target.type === "snacc" ? (
        <Gone what="snacc" />
      ) : target.type === "message" ? (
        <ReportedMessage message={target.message} />
      ) : target.type === "moment" ? (
        <ReportedMoment moment={target.moment} />
      ) : (
        <Framed
          author={target.user}
          note={
            target.user.university?.name ?? "The account itself was reported"
          }
          link={{
            href: `/admin/users/${target.user.id}`,
            label: "Open the profile",
          }}
        >
          <p className="text-sm text-muted-foreground">
            Nothing specific was flagged — the report is about the account.
          </p>
        </Framed>
      )}
    </Section>
  )
}
