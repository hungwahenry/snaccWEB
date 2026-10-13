import type { CampusStatus } from "@/features/universities/types"

export interface Availability {
  open: boolean
  campus: {
    id: string
    name: string
    acronym: string
    status: CampusStatus
  } | null
  country: { code: string; name: string } | null
  email: string
}
