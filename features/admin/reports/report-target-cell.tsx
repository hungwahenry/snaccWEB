"use client"

import { MessageSquare, Sparkles, UserRound } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { handleOf } from "@/lib/format"
import type { AdminReport, ReportTarget } from "./types"

/** The first thing attached to a target, if anything is. */
function thumbOf(target: NonNullable<ReportTarget>): string | null {
  if (target.type === "user") return null
  const content =
    target.type === "snacc"
      ? target.snacc
      : target.type === "moment"
        ? target.moment
        : target.message

  return (
    content.images[0]?.url ?? content.gif?.url ?? content.sticker?.url ?? null
  )
}

const FALLBACK_ICON: Record<string, ReactNode> = {
  snacc: <Sparkles className="size-4" />,
  moment: <Sparkles className="size-4" />,
  message: <MessageSquare className="size-4" />,
  user: <UserRound className="size-4" />,
}

function describe(target: ReportTarget): { title: string; who: string } {
  if (!target) return { title: "Target is gone", who: "—" }
  if (target.type === "snacc") {
    return {
      title: target.snacc.body?.slice(0, 60) || "Media snacc",
      who: handleOf(target.snacc.author),
    }
  }
  if (target.type === "user") {
    return { title: "The account itself", who: handleOf(target.user) }
  }
  if (target.type === "moment") {
    return {
      title: target.moment.body?.slice(0, 60) || "Photo moment",
      who: handleOf(target.moment.author),
    }
  }

  return {
    title: target.message.body?.slice(0, 60) || "Ghost message",
    who: handleOf(target.message.sender),
  }
}

/** What was reported, at a glance — the image itself when there is one. */
export function ReportTargetCell({ report }: { report: AdminReport }) {
  const { title, who } = describe(report.target)
  const thumb = report.target ? thumbOf(report.target) : null

  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/40 text-muted-foreground">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element -- user media on arbitrary hosts
          <img src={thumb} alt="" className="size-full object-cover" />
        ) : (
          (FALLBACK_ICON[report.target?.type ?? "user"] ?? null)
        )}
      </div>
      <div className="min-w-0">
        <Link
          href={`/admin/reports/${report.id}`}
          className="block truncate text-sm font-medium underline-offset-4 hover:underline"
        >
          {title}
        </Link>
        <p className="truncate text-xs text-muted-foreground">
          {who}
          {report.detail ? ` · “${report.detail}”` : ""}
        </p>
      </div>
    </div>
  )
}
