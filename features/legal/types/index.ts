export type LegalKind = "terms" | "privacy"

export interface LegalDocument {
  id: string
  kind: LegalKind
  country_code: string | null
  version: number
  title: string
  html: string
  published_at: string | null
}

export interface PendingDocument {
  id: string
  kind: LegalKind
  version: number
  title: string
  published_at: string | null
}

export interface PendingDocuments {
  country_code: string | null
  documents: PendingDocument[]
}
