import type { University } from "@/features/universities/types"
import { countLabel } from "@/lib/format"
import type { UniversityDetail } from "../types"

/** The letters shown in place of a campus logo. */
export function campusInitials(campus: Pick<University, "acronym">): string {
  return campus.acronym.slice(0, 2).toUpperCase()
}

/** "1.2k students · 40 snaccs". */
export function campusStats(campus: UniversityDetail): string {
  return `${countLabel(campus.members_count, "student")} · ${countLabel(campus.snaccs_count, "snacc")}`
}
