import { LandmarkIcon, type LucideIcon } from "lucide-react"
import { UserAvatar } from "@/components/ui/user-avatar"
import { nameOf } from "@/features/users/utils/names"
import { cn } from "@/lib/utils"
import type { Payee } from "../../types"

export function PartyAvatar({
  person,
  icon: Icon = LandmarkIcon,
  className,
  iconClassName,
  textClassName,
}: {
  person: Payee | null
  icon?: LucideIcon
  className: string
  iconClassName: string
  textClassName?: string
}) {
  if (person) {
    return (
      <UserAvatar
        alt={nameOf(person)}
        className={className}
        textClassName={textClassName}
        avatarUrl={person.avatar_url}
        name={person.username}
      />
    )
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-muted",
        className
      )}
    >
      <Icon className={cn("text-foreground", iconClassName)} />
    </span>
  )
}
