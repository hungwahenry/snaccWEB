import type { User } from "@/features/users/types"
import type { VoiceSource } from "@/features/voice/types"
import { voiceSource } from "@/features/voice/utils/source"
import type { MessageParty, VoiceSources } from "../types"

export function conversationVoiceSources(
  conversationId: string,
  me: User | null,
  other: MessageParty | null
): VoiceSources {
  const self = me?.profile
    ? {
        id: me.id,
        username: me.profile.username,
        display_name: me.profile.display_name,
        avatar_url: me.profile.avatar_url,
      }
    : null

  return {
    mine: voiceSource("conversation", conversationId, self),
    theirs: voiceSource("conversation", conversationId, other),
  }
}

export function voiceSourceOf(
  message: { mine: boolean },
  sources: VoiceSources
): VoiceSource {
  return message.mine ? sources.mine : sources.theirs
}
