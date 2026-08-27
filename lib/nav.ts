import {
  Award,
  Banknote,
  Coins,
  Flag,
  FileText,
  Ghost,
  LayoutDashboard,
  Medal,
  Megaphone,
  MessageSquare,
  School,
  ScrollText,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  Tags,
  ToggleRight,
  Users,
  UserX,
  VenetianMask,
  Wrench,
  Scale,
  AtSign,
  type LucideIcon,
} from "lucide-react"
import { can, type AdminPermissions } from "./permissions"

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  permission: string
}

export const NAV: { group: string; items: NavItem[] }[] = [
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
    group: "People",
    items: [
      {
        href: "/admin/users",
        label: "Users",
        icon: Users,
        permission: "users.read",
      },
    ],
  },
  {
    group: "Content",
    items: [
      {
        href: "/admin/snaccs",
        label: "Snaccs",
        icon: MessageSquare,
        permission: "snaccs.read",
      },
      {
        href: "/admin/reports",
        label: "Reports",
        icon: Flag,
        permission: "reports.read",
      },
      {
        href: "/admin/messages",
        label: "Messages",
        icon: Ghost,
        permission: "messages.read",
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
        permission: "users.read",
      },
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
    group: "Money",
    items: [
      {
        href: "/admin/earnings",
        label: "Earnings",
        icon: Coins,
        permission: "earnings.read",
      },
      {
        href: "/admin/withdrawals",
        label: "Withdrawals",
        icon: Banknote,
        permission: "withdrawals.read",
      },
    ],
  },
  {
    group: "Platform",
    items: [
      {
        href: "/admin/roles",
        label: "Roles",
        icon: ShieldCheck,
        permission: "roles.read",
      },
      {
        href: "/admin/universities",
        label: "Universities",
        icon: School,
        permission: "universities.read",
      },
      {
        href: "/admin/tiers",
        label: "Leaderboard tiers",
        icon: Medal,
        permission: "tiers.read",
      },
      {
        href: "/admin/engagement",
        label: "Engagement weights",
        icon: Scale,
        permission: "engagement.read",
      },
      {
        href: "/admin/badges",
        label: "Badges",
        icon: Award,
        permission: "badges.read",
      },
      {
        href: "/admin/prompts",
        label: "Onboarding prompts",
        icon: Sparkles,
        permission: "prompts.read",
      },
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
        href: "/admin/reserved-usernames",
        label: "Reserved usernames",
        icon: AtSign,
        permission: "reserved_usernames.read",
      },
      {
        href: "/admin/ghost-hour",
        label: "Ghost Hour",
        icon: VenetianMask,
        permission: "ghost.manage",
      },
      {
        href: "/admin/audit",
        label: "Audit log",
        icon: ScrollText,
        permission: "audit.read",
      },
      {
        href: "/admin/ops",
        label: "Ops & maintenance",
        icon: Wrench,
        permission: "ops.read",
      },
    ],
  },
]

export function firstAllowedHref(
  permissions: AdminPermissions | undefined
): string | null {
  for (const group of NAV) {
    for (const item of group.items) {
      if (can(permissions, item.permission)) return item.href
    }
  }
  return null
}
