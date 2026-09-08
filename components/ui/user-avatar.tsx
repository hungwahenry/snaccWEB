"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type UserAvatarProps = {
  avatarUrl?: string | null
  name?: string | null
  alt: string
  className?: string
  textClassName?: string
  /** Overrides the round shape on every layer, e.g. a squircle for the moments tray. */
  shapeClassName?: string
}

export function UserAvatar({
  avatarUrl,
  name,
  alt,
  className,
  textClassName,
  shapeClassName,
}: UserAvatarProps) {
  return (
    <Avatar className={cn("size-11 after:hidden", shapeClassName, className)}>
      <AvatarImage
        src={avatarUrl ?? undefined}
        alt={alt}
        className={shapeClassName}
      />
      <AvatarFallback
        className={cn("font-bold", shapeClassName, textClassName)}
      >
        {name?.[0]?.toUpperCase() ?? "?"}
      </AvatarFallback>
    </Avatar>
  )
}
