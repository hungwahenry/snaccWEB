import { UserAvatar } from "@/components/ui/user-avatar"
import { cn } from "@/lib/utils"

export function NavAvatar({
  avatarUrl,
  fallback,
  active,
  className,
}: {
  avatarUrl: string | null
  fallback: string
  active: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border-2",
        active ? "border-foreground" : "border-transparent",
        className
      )}
    >
      <UserAvatar
        alt="Profile"
        avatarUrl={avatarUrl}
        name={fallback}
        className={cn("size-7", !active && "opacity-70")}
        textClassName="text-xs"
      />
    </span>
  )
}
