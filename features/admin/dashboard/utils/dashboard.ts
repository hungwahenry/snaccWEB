import type { Option } from "@/features/admin/shell/types"
import type { AdminPermissions } from "@/lib/permissions"
import type {
  AudiencePlatform,
  CampusRow,
  Cohort,
  DashboardPeriod,
  DashboardTab,
  FunnelStep,
  GrowthMetrics,
  PlatformMix,
  PlatformVersion,
  RetentionRow,
} from "../types"

export const DASHBOARD_PERIODS = [
  "7",
  "30",
  "90",
] as const satisfies readonly DashboardPeriod[]

export function periodLabel(days: number): string {
  return `Last ${days} days`
}

export const PERIOD_OPTIONS: Option<DashboardPeriod>[] = DASHBOARD_PERIODS.map(
  (period) => ({ value: period, label: periodLabel(Number(period)) })
)

const PLATFORM_LABELS: Record<AudiencePlatform, string> = {
  android: "Android",
  ios: "iOS",
  web: "Web",
  unknown: "Unknown",
}

export function platformLabel(platform: AudiencePlatform): string {
  return PLATFORM_LABELS[platform]
}

export function share(part: number, whole: number): number {
  return whole > 0 ? part / whole : 0
}

export function knownVersions(platform: PlatformMix): PlatformVersion[] {
  return platform.versions.every((row) => row.version === "unknown")
    ? []
    : platform.versions
}

export function versionLabel(version: string): string {
  return version === "unknown" ? "Unknown" : `v${version}`
}

const FUNNEL: { key: keyof GrowthMetrics; label: string }[] = [
  { key: "signed_up", label: "Signed up" },
  { key: "onboarded", label: "Finished their profile" },
  { key: "posted", label: "Posted" },
  { key: "reacted", label: "Reacted to a post" },
  { key: "followed", label: "Followed someone" },
  { key: "returned", label: "Came back another day" },
]

export function funnelSteps(growth: GrowthMetrics): FunnelStep[] {
  return FUNNEL.map((step) => ({
    ...step,
    count: growth[step.key],
    fraction: share(growth[step.key], growth.signed_up),
  }))
}

export function reachableCampuses(
  options: Option[],
  permissions: AdminPermissions | undefined
): Option[] {
  if (!permissions) return []
  if (permissions.campuses.length === 0) return options

  return options.filter((option) => permissions.campuses.includes(option.value))
}

export function scopeNote(
  platform: boolean,
  campusLabel: string | undefined
): string | null {
  if (campusLabel) return `These numbers cover ${campusLabel} only.`
  if (!platform) return "These numbers cover your campuses only."
  return null
}

export const DASHBOARD_TABS = [
  "overview",
  "audience",
  "content",
  "money",
  "notifications",
  "safety",
  "campuses",
] as const satisfies readonly DashboardTab[]

const TAB_LABELS: Record<DashboardTab, string> = {
  overview: "Overview",
  audience: "Audience",
  content: "Content",
  money: "Money",
  notifications: "Notifications",
  safety: "Safety",
  campuses: "Campuses",
}

export function seesMoney(permissions: AdminPermissions | undefined): boolean {
  return !!permissions && permissions.campuses.length === 0
}

export function dashboardTabs(canSeeMoney: boolean): Option<DashboardTab>[] {
  return DASHBOARD_TABS.filter((tab) => tab !== "money" || canSeeMoney).map(
    (tab) => ({ value: tab, label: TAB_LABELS[tab] })
  )
}

export function shownTab(
  tab: DashboardTab,
  canSeeMoney: boolean
): DashboardTab {
  return tab === "money" && !canSeeMoney ? "overview" : tab
}

const MOST_ACTIVE = 10

export function mostActiveCampuses(campuses: CampusRow[]): CampusRow[] {
  return campuses
    .filter((campus) => campus.weekly_active > 0)
    .sort((a, b) => b.weekly_active - a.weekly_active)
    .slice(0, MOST_ACTIVE)
}

export const RETENTION_WEEKS = 9

export function retentionRows(cohorts: Cohort[]): RetentionRow[] {
  return cohorts.map((cohort) => ({
    week: cohort.week,
    size: cohort.size,
    cells: Array.from({ length: RETENTION_WEEKS }, (_, index) => {
      const users = cohort.active[index]
      return users === undefined
        ? null
        : { users, fraction: share(users, cohort.size) }
    }),
  }))
}

export function hoursLabel(hours: number | null): string {
  if (hours === null) return "—"
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))}m`
  if (hours < 48) return `${Math.round(hours)}h`
  return `${Math.round(hours / 24)}d`
}
