"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type UserAvatarProps = {
  avatarUrl?: string | null
  name?: string | null
  alt: string
  className?: string
  textClassName?: string
}

export function UserAvatar({
  avatarUrl,
  name,
  alt,
  className,
  textClassName,
}: UserAvatarProps) {
  return (
    <Avatar className={cn("size-11 after:hidden", className)}>
      <AvatarImage src={avatarUrl ?? undefined} alt={alt} />
      <AvatarFallback className={cn("font-bold", textClassName)}>
        {name?.[0]?.toUpperCase() ?? "?"}
      </AvatarFallback>
    </Avatar>
  )
}
