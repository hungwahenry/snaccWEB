import Link from "next/link"
import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { ContentMedia } from "@/features/admin/shell/components/content-media"
import { EmptyNote, Section } from "@/features/admin/shell/components/detail"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import { snaccPath, threadPath, userPath } from "@/features/admin/shell/routes"
import { SnaccView } from "@/features/admin/snaccs/components/snacc-view"
import type { UserRef } from "@/lib/api/types"
import { formatDate, handleOf } from "@/lib/format"
import type { AdminReportDetail, ReportTarget } from "../types"

type TargetOf<K extends NonNullable<ReportTarget>["type"]> = Extract<
  NonNullable<ReportTarget>,
  { type: K }
>

function Gone({ what }: { what: string }) {
  return <EmptyNote>This {what} is no longer available to show.</EmptyNote>
}

function OpenLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium underline underline-offset-4"
    >
      {label} →
    </Link>
  )
}

function Framed({
  author,
  note,
  badges,
  link,
  children,
}: {
  author: UserRef
  note: string
  badges?: ReactNode
  link?: { href: string; label: string }
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <UserCell user={author} note={note} />
        <div className="flex flex-wrap gap-2 empty:hidden">{badges}</div>
      </div>
      {children}
      {link ? <OpenLink href={link.href} label={link.label} /> : null}
    </div>
  )
}

function ReportedMessage({
  message,
}: {
  message: TargetOf<"message">["message"]
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
        href: threadPath(message.conversation.id),
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

function ReportedChatMessage({
  message,
}: {
  message: TargetOf<"chat_message">["chat_message"]
}) {
  return (
    <Framed
      author={message.sender}
      note={`In ${message.room.name} · ${formatDate(message.created_at)}`}
      badges={
        message.deleted_at ? <Badge variant="destructive">Removed</Badge> : null
      }
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
        {message.room.campus
          ? `Posted in the ${message.room.campus.name} room.`
          : "Posted in the room everyone shares."}
      </p>
    </Framed>
  )
}

function ReportedMoment({ moment }: { moment: TargetOf<"moment">["moment"] }) {
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
          <OpenLink href={snaccPath(report.snacc.id)} label="Open the snacc" />
        </div>
      ) : target === null ? (
        <Gone what="target" />
      ) : target.type === "snacc" ? (
        <Gone what="snacc" />
      ) : target.type === "message" ? (
        <ReportedMessage message={target.message} />
      ) : target.type === "moment" ? (
        <ReportedMoment moment={target.moment} />
      ) : target.type === "chat_message" ? (
        <ReportedChatMessage message={target.chat_message} />
      ) : (
        <Framed
          author={target.user}
          note={
            target.user.university?.name ?? "The account itself was reported"
          }
          link={{ href: userPath(target.user.id), label: "Open the profile" }}
        >
          <p className="text-sm text-muted-foreground">
            Nothing specific was flagged — the report is about the account.
          </p>
        </Framed>
      )}
    </Section>
  )
}
