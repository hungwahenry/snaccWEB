"use client"

import {
  CakeSliceIcon,
  CompassIcon,
  HeartIcon,
  SendHorizontalIcon,
  UserRoundIcon,
  WalletIcon,
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
  if (href === "/wallet")
    return (
      pathname.startsWith("/wallet") ||
      pathname.startsWith("/pay") ||
      pathname === "/earnings"
    )
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function useAppNav() {
  const pathname = usePathname()
  const me = useMe()
  const profile = me.data?.profile
  const searchEnabled = useFlag("search")
  const messagesEnabled = useFlag("anon_messages")
  const walletEnabled = useFlag("wallet")
  const unreadNotifications = useUnreadCount().data ?? 0
  const unreadMessages = useUnreadMessages().data ?? 0

  const own = profilePath(profile?.username)
  const fallback = (
    profile?.username?.[0] ??
    profile?.display_name?.[0] ??
    "?"
  ).toUpperCase()

  const home: NavItem = {
    key: "home",
    href: "/home",
    label: "Home",
    icon: CakeSliceIcon,
  }
  const search: NavItem = {
    key: "search",
    href: "/search",
    label: "Explore",
    icon: CompassIcon,
  }
  const notifications: NavItem = {
    key: "notifications",
    href: "/notifications",
    label: "Notifications",
    icon: HeartIcon,
    badge: unreadNotifications,
  }
  const messages: NavItem = {
    key: "messages",
    href: "/messages",
    label: "Messages",
    icon: SendHorizontalIcon,
    badge: unreadMessages,
  }
  const money: NavItem = {
    key: "money",
    href: "/wallet",
    label: "Money",
    icon: WalletIcon,
  }
  const account: NavItem = {
    key: "profile",
    href: own,
    label: "Profile",
    icon: UserRoundIcon,
    avatarUrl: profile?.avatar_url ?? null,
    avatarFallback: fallback,
  }

  const items: NavItem[] = [
    home,
    ...(searchEnabled ? [search] : []),
    notifications,
    ...(messagesEnabled ? [messages] : []),
    ...(walletEnabled ? [money] : []),
    account,
  ]
  const tabItems: NavItem[] = [
    home,
    notifications,
    ...(messagesEnabled ? [messages] : searchEnabled ? [search] : []),
    account,
  ]

  return {
    items,
    tabItems,
    activeKey:
      items.find((item) => isActive(pathname, item.href, own))?.key ?? null,
    user: me.data ?? null,
  }
}
