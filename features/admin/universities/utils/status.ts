import type { Option, StatusMeta } from "@/features/admin/shell/types"
import type { AdminUniversity, CampusStatus } from "../types"

export const CAMPUS_STATUS: Record<CampusStatus, StatusMeta> = {
  verified: { label: "Verified", variant: "secondary" },
  pending: { label: "Being added", variant: "default" },
  rejected: { label: "Turned down", variant: "destructive" },
}

export const CAMPUS_STATUSES = [
  "verified",
  "pending",
  "rejected",
] as const satisfies readonly CampusStatus[]

export const STATUS_OPTIONS: Option<CampusStatus>[] = CAMPUS_STATUSES.map(
  (status) => ({ value: status, label: CAMPUS_STATUS[status].label })
)

export function verifiedCampuses(
  campuses: AdminUniversity[]
): AdminUniversity[] {
  return campuses.filter((campus) => campus.status === "verified")
}

export function mergeTargets(
  campuses: AdminUniversity[],
  copy: AdminUniversity
): Option[] {
  return campuses
    .filter((campus) => campus.id !== copy.id && campus.status !== "rejected")
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((campus) => ({
      value: campus.id,
      label: `${campus.name} (${campus.acronym}) · ${campus.country.name}`,
    }))
}

export function addedBy(campus: AdminUniversity): string | null {
  if (campus.status === "verified") return null
  const who = campus.added_by?.username
  return who ? `Added by @${who}` : "Added by someone who has left"
}
