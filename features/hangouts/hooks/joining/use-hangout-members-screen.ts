"use client"

import { useMutation } from "@tanstack/react-query"
import { confirm } from "@/components/ui/confirm"
import { useMe } from "@/features/auth/hooks/use-me"
import { usePeopleList } from "@/features/follows/hooks/use-people-list"
import type { FollowUser } from "@/features/follows/types"
import { useSnacc } from "@/features/snaccs/hooks/use-snacc"
import { hangoutInfoPath } from "../../routes"
import { nameOf } from "@/features/users/utils/names"
import { useBack } from "@/hooks/use-back"
import { showError } from "@/lib/feedback"
import { listHangoutMembers, removeHangoutMember } from "../../api"
import { dropPerson, patchHangout, peopleChanged } from "../../cache"
import { hangoutTitle } from "../../utils/hangouts"
import { afterRemoval } from "../../utils/host"
import { hangoutKeys } from "../../utils/keys"

export function useHangoutMembersScreen(snaccId: string) {
  const back = useBack(hangoutInfoPath(snaccId))
  const me = useMe()
  const snacc = useSnacc(snaccId).data
  const hangout = snacc?.hangout ?? null
  const list = usePeopleList(hangoutKeys.members(snaccId), (page) =>
    listHangoutMembers(snaccId, page)
  )

  const remove = useMutation({
    mutationFn: (user: FollowUser) => removeHangoutMember(snaccId, user.id),
    onMutate: (user) => {
      dropPerson(hangoutKeys.members(snaccId), user.id)
      patchHangout(snaccId, afterRemoval)
    },
    onError: (error) => {
      peopleChanged(snaccId)
      showError(error)
    },
  })

  return {
    onBack: back,
    title: hangout ? hangoutTitle(hangout) : "Going",
    meId: me.data?.id ?? null,
    list,
    onRemove:
      snacc?.mine && hangout
        ? (user: FollowUser) =>
            confirm({
              title: `Remove ${nameOf(user)}?`,
              message: `They'll leave ${hangoutTitle(hangout)} and its chat, and can't join it again.`,
              actions: [
                {
                  label: "Remove",
                  destructive: true,
                  onPress: () => remove.mutate(user),
                },
              ],
            })
        : undefined,
  }
}
