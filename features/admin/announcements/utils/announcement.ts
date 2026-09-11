import type { AnnouncementDraft, CreateAnnouncementInput } from "../types"

export const TITLE_MAX = 200
export const MESSAGE_MAX = 1000

export const EMPTY_DRAFT: AnnouncementDraft = {
  title: "",
  message: "",
  audience: "all",
  universityId: null,
}

export function isDraftReady(draft: AnnouncementDraft): boolean {
  return (
    draft.title.trim() !== "" &&
    draft.message.trim() !== "" &&
    (draft.audience === "all" || draft.universityId !== null)
  )
}

export function toCreateInput(
  draft: AnnouncementDraft
): CreateAnnouncementInput {
  return {
    title: draft.title.trim(),
    message: draft.message.trim(),
    audience: draft.audience,
    universityId:
      draft.audience === "campus" && draft.universityId
        ? draft.universityId
        : undefined,
  }
}

/** Who an announcement went to, named by campus acronym where the campus is known. */
export function audienceLabel(
  universityId: string | null,
  acronyms: ReadonlyMap<string, string>
): string {
  if (universityId === null) return "Everyone"

  return acronyms.get(universityId) ?? "One campus"
}
