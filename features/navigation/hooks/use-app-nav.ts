"use client"

import {
  CakeSliceIcon,
  CompassIcon,
  HeartIcon,
  SendHorizontalIcon,
  UserRoundIcon,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useMe } from "@/features/auth/hooks/use-me"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useUnreadMessages } from "@/features/messages/hooks/use-unread-messages"
import { useUnreadCount } from "@/features/notifications/hooks/use-unread-count"
import type { NavItem } from "@/features/navigation/types"

export function profilePath(username: string | null | undefined): string {
  return username ? `/@${username}` : "/home"
}

function isActive(pathname: string, href: string, ownProfile: string): boolean {
  if (href === ownProfile)
    return pathname === `/profile/${ownProfile.slice(2)}` || pathname === href
  if (href === "/search")
    return pathname.startsWith("/search") || pathname.startsWith("/hashtag")
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function useAppNav() {
  const pathname = usePathname()
  const me = useMe()
  const profile = me.data?.profile
  const searchEnabled = useFlag("search")
  const messagesEnabled = useFlag("anon_messages")
  const unreadNotifications = useUnreadCount().data ?? 0
  const unreadMessages = useUnreadMessages().data ?? 0

  const own = profilePath(profile?.username)
  const fallback = (
    profile?.username?.[0] ??
    profile?.display_name?.[0] ??
    "?"
  ).toUpperCase()

  const items: NavItem[] = [
    { key: "home", href: "/home", label: "Home", icon: CakeSliceIcon },
    ...(searchEnabled
      ? [
          {
            key: "search",
            href: "/search",
            label: "Explore",
            icon: CompassIcon,
          },
        ]
      : []),
    {
      key: "notifications",
      href: "/notifications",
      label: "Notifications",
      icon: HeartIcon,
      badge: unreadNotifications,
    },
    ...(messagesEnabled
      ? [
          {
            key: "messages",
            href: "/messages",
            label: "Messages",
            icon: SendHorizontalIcon,
            badge: unreadMessages,
          },
        ]
      : []),
    {
      key: "profile",
      href: own,
      label: "Profile",
      icon: UserRoundIcon,
      avatarUrl: profile?.avatar_url ?? null,
      avatarFallback: fallback,
    },
  ]

  return {
    items,
    activeKey:
      items.find((item) => isActive(pathname, item.href, own))?.key ?? null,
    user: me.data ?? null,
  }
}
