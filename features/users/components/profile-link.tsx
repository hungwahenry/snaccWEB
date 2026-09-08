import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"
import { profilePath } from "../routes"

type ProfileLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  username: string | null | undefined
  children: ReactNode
}

/// Wraps whatever names a person so a click lands on their profile. Without a username there is
/// nowhere to go, so it renders inert.
export function ProfileLink({
  username,
  children,
  className,
  ...props
}: ProfileLinkProps) {
  if (!username) return <span className={className}>{children}</span>

  return (
    <Link
      href={profilePath(username)}
      onClick={(event) => event.stopPropagation()}
      className={className}
      {...props}
    >
      {children}
    </Link>
  )
}
