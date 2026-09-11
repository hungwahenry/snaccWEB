import {
  MessageSquare,
  MessagesSquare,
  Sparkles,
  UserRound,
} from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"
import { reportPath } from "@/features/admin/shell/routes"
import type { AdminReport, ReportTargetType } from "../types"
import { describeTarget, targetThumb } from "../utils/reports"

const FALLBACK_ICON: Record<ReportTargetType, ReactNode> = {
  snacc: <Sparkles className="size-4" />,
  moment: <Sparkles className="size-4" />,
  message: <MessageSquare className="size-4" />,
  chat_message: <MessagesSquare className="size-4" />,
  user: <UserRound className="size-4" />,
}

export function ReportTargetCell({ report }: { report: AdminReport }) {
  const { title, who } = describeTarget(report.target)
  const thumb = targetThumb(report.target)

  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/40 text-muted-foreground">
        {thumb ? (
          <img src={thumb} alt="" className="size-full object-cover" />
        ) : (
          FALLBACK_ICON[report.target?.type ?? "user"]
        )}
      </div>
      <div className="min-w-0">
        <Link
          href={reportPath(report.id)}
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
