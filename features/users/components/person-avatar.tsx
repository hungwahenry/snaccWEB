import { UserAvatar } from "@/components/ui/user-avatar"
import type { Named } from "../utils/names"
import { nameOf } from "../utils/names"

export interface AvatarPerson extends Named {
  avatar_url: string | null
}

/** Someone's picture, with their name as the alt text and the fallback letter. */
export function PersonAvatar({
  person,
  className,
  textClassName,
  shapeClassName,
}: {
  person: AvatarPerson
  className?: string
  textClassName?: string
  shapeClassName?: string
}) {
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
