import type { ReactNode } from "react"
import { UserAvatar } from "@/components/ui/user-avatar"

export function FacePair({
  left,
  right,
  badge,
}: {
  left: string | null
  right: string | null
  badge: ReactNode
}) {
  return (
    <div className="relative flex h-20 w-full items-center justify-center">
      <UserAvatar
        alt=""
        avatarUrl={left}
        className="absolute size-18 -translate-x-11 border-4 border-background"
      />
      <UserAvatar
        alt=""
        avatarUrl={right}
        className="absolute size-18 translate-x-11 border-4 border-background"
      />
      <div className="relative flex size-12 items-center justify-center rounded-full bg-background">
        {badge}
      </div>
    </div>
  )
}
