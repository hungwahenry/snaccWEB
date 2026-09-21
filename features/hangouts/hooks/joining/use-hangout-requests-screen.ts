"use client"

import { useMutation } from "@tanstack/react-query"
import { useSnacc } from "@/features/snaccs/hooks/use-snacc"
import { snaccPath } from "@/features/snaccs/routes"
import type { Author } from "@/features/users/types"
import { useBack } from "@/hooks/use-back"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { showError } from "@/lib/feedback"
import {
  acceptHangoutRequest,
  declineHangoutRequest,
  listHangoutRequests,
} from "../../api"
import { dropPerson, patchHangout, peopleChanged } from "../../cache"
import { hangoutTitle } from "../../utils/hangouts"
import { afterAnswer } from "../../utils/host"
import { hangoutKeys } from "../../utils/keys"

interface Answer {
  user: Author
  accept: boolean
}

export function useHangoutRequestsScreen(snaccId: string) {
  const back = useBack(snaccPath(snaccId))
  const hangout = useSnacc(snaccId).data?.hangout ?? null
  const { items, ...list } = useInfiniteList(
    hangoutKeys.requests(snaccId),
    (page) => listHangoutRequests(snaccId, page)
  )

  const answer = useMutation({
    mutationFn: ({ user, accept }: Answer) =>
      accept
        ? acceptHangoutRequest(snaccId, user.id)
        : declineHangoutRequest(snaccId, user.id),
    onMutate: ({ user, accept }) => {
      dropPerson(hangoutKeys.requests(snaccId), user.id)
      patchHangout(snaccId, (current) => afterAnswer(current, accept))
    },
    onSuccess: () => peopleChanged(snaccId),
    onError: (error) => {
      peopleChanged(snaccId)
      showError(error)
    },
  })

  return {
    onBack: back,
    title: hangout ? hangoutTitle(hangout) : "Requests",
    list: { people: items, ...list },
    onAccept: (user: Author) => answer.mutate({ user, accept: true }),
    onDecline: (user: Author) => answer.mutate({ user, accept: false }),
  }
}
