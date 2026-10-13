import type { LegalKind } from "@/features/legal/types"

export interface AdminLegalSummary {
  id: string
  kind: LegalKind
  country_code: string | null
  version: number
  title: string
  published_at: string | null
  updated_at: string
  accepted_count: number
}

export interface AdminLegalDocument {
  id: string
  kind: LegalKind
  country_code: string | null
  version: number
  title: string
  content: unknown
  html: string
  published_at: string | null
  created_at: string
  updated_at: string
}

export type LegalStanding = "draft" | "in_force" | "replaced"

export interface NewVersionInput {
  kind: LegalKind
  countryCode?: string
}

export interface LegalDraft {
  title: string
  content: unknown
  html: string
}
