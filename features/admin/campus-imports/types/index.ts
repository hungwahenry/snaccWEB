import type { CampusStatus } from "@/features/universities/types"

export type CampusImportSource = "file" | "existing"
export type CampusImportStatus = "checking" | "ready" | "applied" | "failed"
export type CampusImportMatch = "new" | "same" | "similar"
export type CampusImportDecision =
  "undecided" | "create" | "update" | "merge" | "skip"

export type CampusImportTallies = Record<
  CampusImportMatch | CampusImportDecision | "total",
  number
>

export interface CampusImport {
  id: string
  country: { code: string; name: string }
  source: CampusImportSource
  file_name: string | null
  status: CampusImportStatus
  problem: string | null
  created_by: { id: string; username: string | null } | null
  created_at: string
  checked_at: string | null
  applied_at: string | null
  rows: CampusImportTallies
}

export interface ImportCampus {
  id: string
  name: string
  acronym: string
  slug: string
  status: CampusStatus
}

export interface ImportPlace {
  id: string
  name: string | null
}

export interface CampusImportRow {
  id: string
  position: number
  name: string
  acronym: string | null
  website: string | null
  region_label: string | null
  type_label: string | null
  region: ImportPlace | null
  campus_type: ImportPlace | null
  time_zone: string | null
  ror_id: string | null
  domains: string[]
  match: CampusImportMatch
  campus: ImportCampus | null
  merge_into: ImportCampus | null
  decision: CampusImportDecision
  notes: string[]
}

export type CampusImportListQuery = {
  page: number
  perPage: number
  country?: string
}

export type CampusImportRowQuery = {
  page: number
  perPage: number
  match?: CampusImportMatch
  decision?: CampusImportDecision
  q?: string
}

export interface NewCampusImport {
  countryCode: string
  fileName: string
  csv: string
}

export interface CampusImportRowEdit {
  name?: string
  acronym?: string
  website?: string | null
  regionId?: string | null
  campusTypeId?: string | null
  timeZone?: string
  campusId?: string | null
  mergeIntoId?: string | null
  decision?: CampusImportDecision
}

export interface ImportRowDraft {
  name: string
  acronym: string
  website: string
  regionId: string
  campusTypeId: string
  timeZone: string
  campusId: string | null
  mergeIntoId: string | null
}

export interface AppliedImport {
  created: number
  updated: number
  merged: number
}
