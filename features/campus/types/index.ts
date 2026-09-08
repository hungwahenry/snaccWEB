import type { University } from "@/features/universities/types"

export interface UniversityDetail extends University {
  members_count: number
  snaccs_count: number
}
