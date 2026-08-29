import {
  ScanEye,
  AtSign,
  Banknote,
  Bell,
  Coins,
  FileText,
  Flag,
  Ghost,
  Images,
  LayoutDashboard,
  Medal,
  Megaphone,
  MessageSquare,
  School,
  Scale,
  ScrollText,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tags,
  ToggleRight,
  UserX,
  Users,
  VenetianMask,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import { can, type AdminPermissions } from "./permissions"

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  permission: string
}

export interface NavSection {
  group: string
  items: NavItem[]
}

export const NAV: NavSection[] = [
  {
    group: "Overview",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        icon: LayoutDashboard,
        permission: "dashboard.read",
      },
    ],
  },
  {
    group: "Moderation",
    items: [
      {
        href: "/admin/reports",
        label: "Reports",
        icon: Flag,
        permission: "reports.read",
      },
      {
        href: "/admin/snaccs",
        label: "Snaccs",
        icon: MessageSquare,
        permission: "snaccs.read",
      },
      {
        href: "/admin/moments",
        label: "Moments",
        icon: Images,
        permission: "moments.read",
      },
      {
        href: "/admin/messages",
        label: "Ghost threads",
        icon: Ghost,
        permission: "messages.read",
      },
      {
        href: "/admin/moderation",
        label: "Automatic review",
        icon: ScanEye,
        permission: "moderation.read",
      },
      {
        href: "/admin/report-reasons",
        label: "Report reasons",
        icon: Tags,
        permission: "report_reasons.read",
      },
      {
        href: "/admin/suspension-reasons",
        label: "Suspension reasons",
        icon: UserX,
        permission: "suspension_reasons.read",
      },
    ],
  },
  {
    group: "People",
    items: [
      {
        href: "/admin/users",
        label: "Users",
        icon: Users,
        permission: "users.read",
      },
      {
        href: "/admin/suspensions",
        label: "Suspensions",
        icon: UserX,
        permission: "users.read",
      },
      {
        href: "/admin/roles",
        label: "Roles",
        icon: ShieldCheck,
        permission: "roles.read",
      },
      {
        href: "/admin/reserved-usernames",
        label: "Reserved usernames",
        icon: AtSign,
        permission: "reserved_usernames.read",
      },
    ],
  },
  {
    group: "Money",
    items: [
      {
        href: "/admin/wallet",
        label: "Wallets",
        icon: Wallet,
        permission: "wallet.read",
      },
      {
        href: "/admin/withdrawals",
        label: "Withdrawals",
        icon: Banknote,
        permission: "withdrawals.read",
      },
      {
        href: "/admin/earnings",
        label: "Earnings",
        icon: Coins,
        permission: "earnings.read",
      },
    ],
  },
  {
    group: "Platform",
    items: [
      {
        href: "/admin/config",
        label: "Config",
        icon: SlidersHorizontal,
        permission: "config.read",
      },
      {
        href: "/admin/flags",
        label: "Feature flags",
        icon: ToggleRight,
        permission: "flags.read",
      },
      {
        href: "/admin/engagement",
        label: "Engagement weights",
        icon: Scale,
        permission: "engagement.read",
      },
      {
        href: "/admin/score-tiers",
        label: "Score tiers",
        icon: Medal,
        permission: "score_tiers.read",
      },
      {
        href: "/admin/universities",
        label: "Universities",
        icon: School,
        permission: "universities.read",
      },
      {
        href: "/admin/notification-types",
        label: "Notifications",
        icon: Bell,
        permission: "notification_types.read",
      },
      {
        href: "/admin/prompts",
        label: "Onboarding prompts",
        icon: Sparkles,
        permission: "onboarding_prompts.read",
      },
      {
        href: "/admin/ghost-hour",
        label: "Ghost Hour",
        icon: VenetianMask,
        permission: "ghost.manage",
      },
    ],
  },
  {
    group: "Comms",
    items: [
      {
        href: "/admin/pages",
        label: "Pages",
        icon: FileText,
        permission: "pages.read",
      },
      {
        href: "/admin/announcements",
        label: "Announcements",
        icon: Megaphone,
        permission: "announcements.read",
      },
    ],
  },
  {
    group: "Ops",
    items: [
      {
        href: "/admin/ops",
        label: "Health & drift",
        icon: Wrench,
        permission: "ops.read",
      },
      {
        href: "/admin/audit",
        label: "Audit log",
        icon: ScrollText,
        permission: "audit.read",
      },
    ],
  },
]

export function visibleNav(
  permissions: AdminPermissions | undefined
): NavSection[] {
  return NAV.map((section) => ({
    ...section,
    items: section.items.filter((item) => can(permissions, item.permission)),
  })).filter((section) => section.items.length > 0)
}

export function firstAllowedHref(
  permissions: AdminPermissions | undefined
): string | null {
  return visibleNav(permissions)[0]?.items[0]?.href ?? null
}

export function permissionForPath(pathname: string): string | null {
  const items = NAV.flatMap((section) => section.items)
  const exact = items.find((item) => item.href === pathname)
  if (exact) return exact.permission

  const nested = items
    .filter(
      (item) => item.href !== "/admin" && pathname.startsWith(`${item.href}/`)
    )
    .sort((a, b) => b.href.length - a.href.length)[0]

  return nested?.permission ?? null
}
