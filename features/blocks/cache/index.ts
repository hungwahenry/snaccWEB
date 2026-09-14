import { removePerson } from "@/features/follows/cache"
import { removeAuthorSnaccs } from "@/features/snaccs/cache"
import { snaccKeys } from "@/features/snaccs/utils/keys"
import { userKeys } from "@/features/users/utils/keys"
import { voicePlayer } from "@/features/voice/hooks/use-voice-player"
import { getQueryClient } from "@/lib/query/client"

/** A block works both ways: each drops out of the other's feeds, lists and profiles. */
export function separateFrom(userId: string): void {
  removeAuthorSnaccs(userId)
  removePerson(userId)
  voicePlayer.stopIfFrom({ authorId: userId })
  void getQueryClient().invalidateQueries({ queryKey: snaccKeys.lists() })
  void getQueryClient().invalidateQueries({ queryKey: userKeys.profiles() })
}
