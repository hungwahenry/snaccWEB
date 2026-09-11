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
import { useRoomsEnabled } from "@/features/chats/hooks/use-rooms-enabled"
import { useUnreadRooms } from "@/features/chats/hooks/use-unread-rooms"
import { useFlag } from "@/features/config/hooks/use-flag"
import { useUnreadMessages } from "@/features/messages/hooks/use-unread-messages"
import { useUnreadCount } from "@/features/notifications/hooks/use-unread-count"
import { HOME_PATH } from "@/features/feed/routes"
import { MESSAGES_PATH } from "@/features/messages/routes"
import type { NavItem } from "@/features/navigation/types"
import { NOTIFICATIONS_PATH } from "@/features/notifications/routes"
import { SEARCH_PATH } from "@/features/search/routes"
import { profilePath } from "@/features/users/routes"
import { EARNINGS_PATH, payPath, WALLET_PATH } from "@/features/wallet/routes"

function isActive(pathname: string, href: string, ownProfile: string): boolean {
  if (href === ownProfile)
    return pathname === `/profile/${ownProfile.slice(2)}` || pathname === href
  if (href === SEARCH_PATH)
    return pathname.startsWith(SEARCH_PATH) || pathname.startsWith("/hashtag")
  if (href === WALLET_PATH)
    return (
      pathname.startsWith(WALLET_PATH) ||
      pathname.startsWith(payPath()) ||
      pathname === EARNINGS_PATH
    )
  // A room is reached from Messages, so it lights Messages up.
  if (href === MESSAGES_PATH)
    return pathname.startsWith(MESSAGES_PATH) || pathname.startsWith("/chat/")
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function useAppNav() {
  const pathname = usePathname()
  const me = useMe()
  const profile = me.data?.profile
  const searchEnabled = useFlag("search")
  const dmsEnabled = useFlag("anon_messages")
  const roomsEnabled = useRoomsEnabled()
  const messagesEnabled = dmsEnabled || roomsEnabled
  const walletEnabled = useFlag("wallet")
  const unreadNotifications = useUnreadCount().data ?? 0
  const unreadMessages = useUnreadMessages().data ?? 0
  const unreadRooms = useUnreadRooms()

  const own = profilePath(profile?.username)
  const fallback = (
    profile?.username?.[0] ??
    profile?.display_name?.[0] ??
    "?"
  ).toUpperCase()

  const home: NavItem = {
    key: "home",
    href: HOME_PATH,
    label: "Home",
    icon: CakeSliceIcon,
  }
  const search: NavItem = {
    key: "search",
    href: SEARCH_PATH,
    label: "Explore",
    icon: CompassIcon,
  }
  const notifications: NavItem = {
    key: "notifications",
    href: NOTIFICATIONS_PATH,
    label: "Notifications",
    icon: HeartIcon,
    badge: unreadNotifications,
  }
  const messages: NavItem = {
    key: "messages",
    href: MESSAGES_PATH,
    label: "Messages",
    icon: SendHorizontalIcon,
    badge: unreadMessages + unreadRooms,
  }
  const money: NavItem = {
    key: "money",
    href: WALLET_PATH,
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
