import type { ReactNode } from "react"
import { UserAvatar } from "@/components/ui/user-avatar"
import { QuoteRail } from "../card/quote/quote-connector"

type ComposerFrameProps = {
  avatarUrl: string | null
  username: string | null
  connectDown?: boolean
  children: ReactNode
}

export function ComposerFrame({
  avatarUrl,
  username,
  connectDown,
  children,
}: ComposerFrameProps) {
  return (
    <div className="flex gap-3">
      <div className="flex w-12 shrink-0 flex-col">
        <UserAvatar
          alt={username ? `${username}'s photo` : "Your photo"}
          avatarUrl={avatarUrl}
          name={username}
          className="size-12"
          textClassName="text-base"
        />
        {connectDown ? <QuoteRail /> : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {username ? (
          <span className="truncate text-base font-bold text-foreground">
            {username}
          </span>
        ) : null}
        {children}
      </div>
    </div>
  )
}
