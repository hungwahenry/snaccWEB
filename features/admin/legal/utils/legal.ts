import type { Option, StatusMeta } from "@/features/admin/shell/types"
import type { LegalKind } from "@/features/legal/types"
import type {
  AdminLegalDocument,
  AdminLegalSummary,
  LegalDraft,
  LegalStanding,
} from "../types"

export const KIND_OPTIONS: Option<LegalKind>[] = [
  { value: "terms", label: "Terms of Use" },
  { value: "privacy", label: "Privacy Policy" },
]

export const STANDING: Record<LegalStanding, StatusMeta> = {
  draft: { label: "draft", variant: "outline" },
  in_force: { label: "in force", variant: "secondary" },
  replaced: { label: "replaced", variant: "outline" },
}

export function standingOf(
  doc: Pick<AdminLegalSummary, "id" | "kind" | "country_code" | "published_at">,
  all: AdminLegalSummary[]
): LegalStanding {
  if (!doc.published_at) return "draft"

  const newest = all
    .filter(
      (other) =>
        other.kind === doc.kind &&
        other.country_code === doc.country_code &&
        other.published_at
    )
    .reduce<AdminLegalSummary | null>(
      (best, other) => (!best || other.version > best.version ? other : best),
      null
    )
  return newest?.id === doc.id ? "in_force" : "replaced"
}

export function draftFrom(doc: AdminLegalDocument): LegalDraft {
  return { title: doc.title, content: doc.content, html: doc.html }
}

export function isDraftReady(draft: LegalDraft): boolean {
  return draft.title.trim().length > 0
}
