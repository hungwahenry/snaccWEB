import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvatar } from "@/components/ui/user-avatar"
import { snaccPath } from "@/features/snaccs/routes"
import { profilePath } from "@/features/users/routes"
import { timeAgo } from "@/lib/format"
import type { MyReport } from "../types"

export function ReportRow({ report }: { report: MyReport }) {
  const user =
    report.target.type === "snacc"
      ? report.target.snacc.author
      : report.target.user
  const href =
    report.target.type === "snacc"
      ? snaccPath(report.target.snacc.id)
      : profilePath(user.username)
  const what =
    report.target.type === "snacc"
      ? (report.target.snacc.body ?? "A snacc")
      : `@${user.username ?? "someone"}`

  return (
    <Link
      href={href}
      className="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-accent/40"
    >
      <UserAvatar
        alt={user.display_name ?? "User"}
        avatarUrl={user.avatar_url}
        name={user.username}
      />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm font-bold text-foreground">
          {report.reason}
        </span>
        <span className="line-clamp-2 text-sm text-muted-foreground">
          {what}
        </span>
        {report.detail ? (
          <span className="line-clamp-2 text-xs text-muted-foreground">
            “{report.detail}”
          </span>
        ) : null}
        <span className="text-xs text-muted-foreground">
          {timeAgo(report.created_at)}
        </span>
      </span>
    </Link>
  )
}

export function ReportRowSkeleton() {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5">
      <Skeleton className="size-11 rounded-full" />
      <div className="flex flex-1 flex-col gap-2 pt-1">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}
