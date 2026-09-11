import {
  AtSign,
  Banknote,
  Bell,
  Coins,
  Egg,
  FileText,
  Flag,
  Ghost,
  Images,
  LayoutDashboard,
  Medal,
  Megaphone,
  MessageSquare,
  Scale,
  ScanEye,
  School,
  ScrollText,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tags,
  ToggleRight,
  type LucideIcon,
  UserCog,
  Users,
  UserX,
  VenetianMask,
  Wallet,
  Wrench,
} from "lucide-react"
import { can, type AdminPermissions } from "@/lib/permissions"
import {
  ADMIN_PATH,
  ADMINS_PATH,
  ANNOUNCEMENTS_PATH,
  AUDIT_PATH,
  CONFIG_PATH,
  EARNINGS_PATH,
  EGGS_PATH,
  ENGAGEMENT_PATH,
  FLAGS_PATH,
  GHOST_HOUR_PATH,
  MESSAGES_PATH,
  MODERATION_PATH,
  MOMENTS_PATH,
  NOTIFICATION_TYPES_PATH,
  OPS_PATH,
  PAGES_PATH,
  PROMPTS_PATH,
  REPORT_REASONS_PATH,
  REPORTS_PATH,
  RESERVED_USERNAMES_PATH,
  ROLES_PATH,
  SCORE_TIERS_PATH,
  SNACCS_PATH,
  SUSPENSION_REASONS_PATH,
  SUSPENSIONS_PATH,
  UNIVERSITIES_PATH,
  USERS_PATH,
  WALLETS_PATH,
  WITHDRAWALS_PATH,
} from "../routes"

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
        href: ADMIN_PATH,
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
        href: REPORTS_PATH,
        label: "Reports",
        icon: Flag,
        permission: "reports.read",
      },
      {
        href: SNACCS_PATH,
        label: "Snaccs",
        icon: MessageSquare,
        permission: "snaccs.read",
      },
      {
        href: MOMENTS_PATH,
        label: "Moments",
        icon: Images,
        permission: "moments.read",
      },
      {
        href: MESSAGES_PATH,
        label: "Ghost threads",
        icon: Ghost,
        permission: "messages.read",
      },
      {
        href: MODERATION_PATH,
        label: "Automatic review",
        icon: ScanEye,
        permission: "moderation.read",
      },
      {
        href: REPORT_REASONS_PATH,
        label: "Report reasons",
        icon: Tags,
        permission: "report_reasons.read",
      },
      {
        href: SUSPENSION_REASONS_PATH,
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
        href: USERS_PATH,
        label: "Users",
        icon: Users,
        permission: "users.read",
      },
      {
        href: SUSPENSIONS_PATH,
        label: "Suspensions",
        icon: UserX,
        permission: "users.read",
      },
      {
        href: ADMINS_PATH,
        label: "Admins",
        icon: UserCog,
        permission: "roles.read",
      },
      {
        href: ROLES_PATH,
        label: "Roles",
        icon: ShieldCheck,
        permission: "roles.read",
      },
      {
        href: RESERVED_USERNAMES_PATH,
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
        href: WALLETS_PATH,
        label: "Wallets",
        icon: Wallet,
        permission: "wallet.read",
      },
      {
        href: WITHDRAWALS_PATH,
        label: "Withdrawals",
        icon: Banknote,
        permission: "withdrawals.read",
      },
      {
        href: EARNINGS_PATH,
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
        href: CONFIG_PATH,
        label: "Config",
        icon: SlidersHorizontal,
        permission: "config.read",
      },
      {
        href: FLAGS_PATH,
        label: "Feature flags",
        icon: ToggleRight,
        permission: "flags.read",
      },
      {
        href: ENGAGEMENT_PATH,
        label: "Engagement weights",
        icon: Scale,
        permission: "engagement.read",
      },
      {
        href: SCORE_TIERS_PATH,
        label: "Score tiers",
        icon: Medal,
        permission: "score_tiers.read",
      },
      {
        href: EGGS_PATH,
        label: "Easter eggs",
        icon: Egg,
        permission: "easter_eggs.read",
      },
      {
        href: UNIVERSITIES_PATH,
        label: "Universities",
        icon: School,
        permission: "universities.read",
      },
      {
        href: NOTIFICATION_TYPES_PATH,
        label: "Notifications",
        icon: Bell,
        permission: "notification_types.read",
      },
      {
        href: PROMPTS_PATH,
        label: "Onboarding prompts",
        icon: Sparkles,
        permission: "onboarding_prompts.read",
      },
      {
        href: GHOST_HOUR_PATH,
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
        href: PAGES_PATH,
        label: "Pages",
        icon: FileText,
        permission: "pages.read",
      },
      {
        href: ANNOUNCEMENTS_PATH,
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
        href: OPS_PATH,
        label: "Health & drift",
        icon: Wrench,
        permission: "ops.read",
      },
      {
        href: AUDIT_PATH,
        label: "Audit log",
        icon: ScrollText,
        permission: "audit.read",
      },
    ],
  },
]

export function visibleNav(
  permissions: AdminPermissions | undefined,
  nav: NavSection[] = NAV
): NavSection[] {
  return nav
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => can(permissions, item.permission)),
    }))
    .filter((section) => section.items.length > 0)
}

export function firstAllowedHref(
  permissions: AdminPermissions | undefined
): string | null {
  return visibleNav(permissions)[0]?.items[0]?.href ?? null
}

export function isNavActive(href: string, pathname: string): boolean {
  if (href === ADMIN_PATH) return pathname === ADMIN_PATH

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function permissionForPath(
  pathname: string,
  nav: NavSection[] = NAV
): string | null {
  const match = nav
    .flatMap((section) => section.items)
    .filter((item) => isNavActive(item.href, pathname))
    .sort((a, b) => b.href.length - a.href.length)[0]

  return match?.permission ?? null
}
