import { handleOf, nameOf, type Named } from "@/features/users/utils/names"
import type { VoiceSource, VoiceSourceKind } from "../types"

export interface VoicePerson extends Named {
  id: string
  avatar_url: string | null
}

export function voiceSource(
  kind: VoiceSourceKind,
  id: string,
  person: VoicePerson | null
): VoiceSource {
  if (!person) {
    return { kind, id, label: "Ghost", avatarUrl: null, authorId: null }
  }
  return {
    kind,
    id,
    label: handleOf(person) ?? nameOf(person, "Ghost"),
    avatarUrl: person.avatar_url || null,
    authorId: person.id,
  }
}

export function isFromSource(
  source: VoiceSource | null,
  from: { snaccId?: string; authorId?: string }
): boolean {
  if (!source) return false
  if (source.kind === "snacc" && source.id === from.snaccId) return true
  return source.authorId !== null && source.authorId === from.authorId
}
