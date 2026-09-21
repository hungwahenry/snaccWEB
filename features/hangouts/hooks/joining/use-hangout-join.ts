"use client"

import { useMutation } from "@tanstack/react-query"
import { confirm } from "@/components/ui/confirm"
import { showError } from "@/lib/feedback"
import { useHangoutGate } from "@/providers/hangout-gate-provider"
import { joinHangout, leaveHangout } from "../../api"
import { hangoutListsChanged, setJoinState } from "../../cache"
import type { JoinState, SnaccHangout } from "../../types"
import { hangoutTitle } from "../../utils/hangouts"
import { nextJoinState } from "../../utils/join"

interface JoinChange {
  snaccId: string
  from: JoinState
  next: JoinState
}

export function useHangoutJoin() {
  const ensureAgreed = useHangoutGate()

  const change = useMutation({
    mutationFn: ({ snaccId, next }: JoinChange) =>
      next === "none" ? leaveHangout(snaccId) : joinHangout(snaccId),
    onMutate: ({ snaccId, next }) => setJoinState(snaccId, next),
    onSuccess: (state, { snaccId }) => {
      setJoinState(snaccId, state)
      hangoutListsChanged()
    },
    onError: (error, { snaccId, from }) => {
      setJoinState(snaccId, from)
      showError(error)
    },
  })

  return (snaccId: string, hangout: SnaccHangout) => {
    const from = hangout.join_state
    const next = nextJoinState(hangout)

    if (next !== "none") {
      void ensureAgreed()
        .then((agreed) => {
          if (agreed) change.mutate({ snaccId, from, next })
        })
        .catch(showError)
      return
    }

    if (from === "requested") {
      change.mutate({ snaccId, from, next })
      return
    }

    confirm({
      title: `Leave ${hangoutTitle(hangout)}?`,
      message: hangout.private
        ? "You'll leave its chat, and you'd have to ask again to come back."
        : "You'll leave its chat too.",
      actions: [
        {
          label: "Leave",
          destructive: true,
          onPress: () => change.mutate({ snaccId, from, next }),
        },
      ],
    })
  }
}
