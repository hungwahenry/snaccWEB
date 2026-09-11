import { GhostAvatar } from "@/components/ui/ghost-avatar"
import { UserAvatar } from "@/components/ui/user-avatar"
import type { Named } from "../utils/names"
import { nameOf } from "../utils/names"

export interface AvatarPerson extends Named {
  avatar_url: string | null
}

/** Someone's picture, with their name as the alt text and the fallback letter; a ghost when anonymous. */
export function PersonAvatar({
  person,
  anonymous = false,
  className,
  textClassName,
  shapeClassName,
}: {
  person: AvatarPerson
  anonymous?: boolean
  className?: string
  textClassName?: string
  shapeClassName?: string
}) {
  if (anonymous) return <GhostAvatar className={className} />

  const name = nameOf(person)
  return (
    <UserAvatar
      avatarUrl={person.avatar_url}
      name={name}
      alt={name}
      className={className}
      textClassName={textClassName}
      shapeClassName={shapeClassName}
    />
  )
}
