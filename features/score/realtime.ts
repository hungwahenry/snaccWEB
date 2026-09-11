import { setAuthorTier } from "@/features/snaccs/cache"
import type { User } from "@/features/users/types"
import { getQueryClient } from "@/lib/query/client"
import { authKeys } from "@/features/auth/utils/keys"
import { userKeys } from "@/features/users/utils/keys"
import { MY_SCORE_KEY } from "./hooks/use-my-score"

export function onScoreChanged(payload: { tier: string | null }): void {
  const queryClient = getQueryClient()
  const me = queryClient.getQueryData<User>(authKeys.me())
  if (me) setAuthorTier(me.id, payload.tier)
  void queryClient.invalidateQueries({ queryKey: MY_SCORE_KEY })
  void queryClient.invalidateQueries({ queryKey: userKeys.profiles() })
}
