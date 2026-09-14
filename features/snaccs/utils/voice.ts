import type { VoiceSource } from "@/features/voice/types"
import { voiceSource } from "@/features/voice/utils/source"
import type { EmbeddedSnacc } from "../types"

export function snaccVoiceSource(
  snacc: Pick<EmbeddedSnacc, "id" | "anonymous" | "author">
): VoiceSource {
  return voiceSource("snacc", snacc.id, snacc.anonymous ? null : snacc.author)
}
