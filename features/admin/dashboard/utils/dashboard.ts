import type { Country } from "@/features/places/types"
import type { Option } from "@/features/admin/shell/types"
import { campusesFor, type AdminPermissions } from "@/lib/permissions"
import type {
  AudiencePlatform,
  CampusRow,
  Cohort,
  DashboardPeriod,
  DashboardTab,
  FunnelStep,
  GrowthMetrics,
  PlatformMix,
  PlatformRow,
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

function knownVersions(platform: PlatformMix): PlatformVersion[] {
  return platform.versions.every((row) => row.version === "unknown")
    ? []
    : platform.versions
}

function versionLabel(version: string): string {
  return version === "unknown" ? "Unknown" : `v${version}`
}

export function platformRows(platforms: PlatformMix[]): PlatformRow[] {
  const total = platforms.reduce((sum, row) => sum + row.users, 0)

  return platforms.map((platform) => ({
    platform: platform.platform,
    label: platformLabel(platform.platform),
    users: platform.users,
    fraction: share(platform.users, total),
    versions: knownVersions(platform).map((row) => ({
      version: row.version,
      label: versionLabel(row.version),
      users: row.users,
      fraction: share(row.users, platform.users),
    })),
  }))
}

export function withBarFractions<T>(
  rows: T[],
  value: (row: T) => number
): (T & { fraction: number })[] {
  const most = Math.max(0, ...rows.map(value))
  return rows.map((row) => ({ ...row, fraction: share(value(row), most) }))
}

const FUNNEL: { key: keyof GrowthMetrics; label: string }[] = [
  { key: "signed_up", label: "Signed up" },
  { key: "onboarded", label: "Finished their profile" },
  { key: "posted", label: "Posted" },
  { key: "liked", label: "Liked a post" },
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

export function scopeNote(
  platform: boolean,
  campusLabel: string | undefined,
  countryLabel?: string
): string | null {
  if (campusLabel) return `These numbers cover ${campusLabel} only.`
  if (countryLabel)
    return `These numbers cover campuses in ${countryLabel} only.`
  if (!platform) return "These numbers cover your campuses only."
  return null
}

export function dashboardCountries(countries: Country[]): Option[] {
  return countries
    .filter((country) => country.open)
    .map((country) => ({ value: country.code, label: country.name }))
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
  return !!permissions && campusesFor(permissions, "dashboard.read") === null
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

export function mostActiveCampuses(
  campuses: CampusRow[]
): (CampusRow & { fraction: number })[] {
  return withBarFractions(
    campuses
      .filter((campus) => campus.weekly_active > 0)
      .sort((a, b) => b.weekly_active - a.weekly_active)
      .slice(0, MOST_ACTIVE),
    (campus) => campus.weekly_active
  )
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
