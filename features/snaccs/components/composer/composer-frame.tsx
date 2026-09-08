import type { ReactNode } from "react"
import { GhostAvatar } from "@/components/ui/ghost-avatar"
import { UserAvatar } from "@/components/ui/user-avatar"
import { GhostTimeLeft } from "@/features/ghost/components/ghost-time-left"
import { QuoteRail } from "../card/quote/quote-connector"

type ComposerFrameProps = {
  avatarUrl: string | null
  username: string | null
  ghost?: boolean
  ghostTimeLeft?: string | null
  connectDown?: boolean
  children: ReactNode
}

export function ComposerFrame({
  avatarUrl,
  username,
  ghost,
  ghostTimeLeft,
  connectDown,
  children,
}: ComposerFrameProps) {
  return (
    <div className="flex gap-3">
      <div className="flex w-12 shrink-0 flex-col">
        {ghost ? (
          <GhostAvatar className="size-12" iconClassName="size-6" />
        ) : (
          <UserAvatar
            alt={username ? `${username}'s photo` : "Your photo"}
            avatarUrl={avatarUrl}
            name={username}
            className="size-12"
            textClassName="text-base"
          />
        )}
        {connectDown ? <QuoteRail /> : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {ghost ? (
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-foreground">Ghost</span>
            <GhostTimeLeft label={ghostTimeLeft ?? null} />
          </div>
        ) : username ? (
          <span className="truncate text-base font-bold text-foreground">
            {username}
          </span>
        ) : null}
        {children}
      </div>
    </div>
  )
}
