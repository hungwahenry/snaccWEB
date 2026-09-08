import {
  AtSignIcon,
  BanknoteArrowDownIcon,
  BanknoteIcon,
  BellIcon,
  BellRingIcon,
  CakeIcon,
  CameraIcon,
  CoinsIcon,
  FlameIcon,
  GemIcon,
  HandCoinsIcon,
  HandIcon,
  HeartIcon,
  LandmarkIcon,
  MegaphoneIcon,
  MessageCircleIcon,
  MessageSquareIcon,
  MessagesSquareIcon,
  QuoteIcon,
  RepeatIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserRoundPlusIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react"
import { snaccPath } from "@/features/snaccs/routes"
import { profilePath } from "@/features/users/routes"
import type {
  Notification,
  NotificationTarget,
} from "@/features/notifications/types"

const ICON_BY_NAME: Record<string, LucideIcon> = {
  "at-sign": AtSignIcon,
  banknote: BanknoteIcon,
  "banknote-arrow-down": BanknoteArrowDownIcon,
  "bell-ring": BellRingIcon,
  cake: CakeIcon,
  camera: CameraIcon,
  coins: CoinsIcon,
  flame: FlameIcon,
  gem: GemIcon,
  hand: HandIcon,
  "hand-coins": HandCoinsIcon,
  heart: HeartIcon,
  landmark: LandmarkIcon,
  megaphone: MegaphoneIcon,
  "message-circle": MessageCircleIcon,
  "message-square": MessageSquareIcon,
  "messages-square": MessagesSquareIcon,
  quote: QuoteIcon,
  repeat: RepeatIcon,
  "shield-check": ShieldCheckIcon,
  sparkles: SparklesIcon,
  "user-round-plus": UserRoundPlusIcon,
  wallet: WalletIcon,
}

export function notificationIcon(notification: Notification): LucideIcon {
  return ICON_BY_NAME[notification.icon_name] ?? BellIcon
}

function routeFromTarget(target: NotificationTarget | null): string | null {
  if (!target) return null
  switch (target.kind) {
    case "snacc":
      return target.ref ? snaccPath(target.ref) : null
    case "user":
    case "profile":
      return target.ref ? profilePath(target.ref) : null
    case "conversation":
      return target.ref ? `/messages/${target.ref}` : null
    case "wallet":
      return "/wallet"
    case "earnings":
      return "/earnings"
    case "score":
      return "/score"
    case "moment":
      return target.ref ? `/moment/${target.ref}` : null
    default:
      return null
  }
}

export function notificationRoute(notification: Notification): string | null {
  if (notification.target?.kind === "notifications") return null
  return routeFromTarget(notification.target)
}
