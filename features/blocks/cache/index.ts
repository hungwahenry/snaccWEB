import { removePerson } from "@/features/follows/cache"
import { removeAuthorSnaccs } from "@/features/snaccs/cache"
import { snaccKeys } from "@/features/snaccs/utils/keys"
import { userKeys } from "@/features/users/utils/keys"
import { voicePlayer } from "@/features/voice/hooks/use-voice-player"
import { getQueryClient } from "@/lib/query/client"

export function separateFrom(userId: string): void {
  hideEachOther(userId)
  refreshSeparated()
}

export function hideEachOther(userId: string): void {
  removeAuthorSnaccs(userId)
  removePerson(userId)
  voicePlayer.stopIfFrom({ authorId: userId })
}

export function refreshSeparated(): void {
  void getQueryClient().invalidateQueries({ queryKey: snaccKeys.lists() })
  void getQueryClient().invalidateQueries({ queryKey: userKeys.profiles() })
}
