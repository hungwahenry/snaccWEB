import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"
import { signal } from "@/features/signals/utils/queue"
import { profilePath } from "../routes"

type ProfileLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  username: string | null | undefined
  /** The snacc whose author was tapped, so the feed learns what drew the eye. */
  fromSnaccId?: string
  children: ReactNode
}

/// Wraps whatever names a person so a click lands on their profile. Without a username there is
/// nowhere to go, so it renders inert.
export function ProfileLink({
  username,
  fromSnaccId,
  children,
  className,
  ...props
}: ProfileLinkProps) {
  if (!username) return <span className={className}>{children}</span>

  return (
    <Link
      href={profilePath(username)}
      onClick={(event) => {
        event.stopPropagation()
        if (fromSnaccId) signal("author_tap", { subjectId: fromSnaccId })
      }}
      className={className}
      {...props}
    >
      {children}
    </Link>
  )
}
