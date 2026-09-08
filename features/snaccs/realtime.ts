import { getQueryClient } from "@/lib/query-client"
import { getSnacc } from "./api"
import { patchSnacc, removeSnacc } from "./cache"
import type { SnaccReaction } from "./types"

export function onSnaccReaction(payload: {
  snacc_id: string
  reactions: SnaccReaction[]
  reactions_count: number
}): void {
  patchSnacc(payload.snacc_id, (snacc) => ({
    ...snacc,
    reactions: payload.reactions,
    reactions_count: payload.reactions_count,
  }))
}

export function onSnaccComment(payload: { snacc_id: string }): void {
  const queryClient = getQueryClient()
  void queryClient.invalidateQueries({
    queryKey: ["snaccs", payload.snacc_id],
    exact: true,
  })
  void queryClient.invalidateQueries({
    queryKey: ["snaccs", payload.snacc_id, "comments"],
    refetchType: "none",
  })
}

export function onSnaccEdited(payload: { snacc_id: string }): void {
  void getSnacc(payload.snacc_id)
    .then((fresh) => patchSnacc(fresh.id, () => fresh))
    .catch(() => undefined)
}

export function onSnaccResnacc(payload: {
  snacc_id: string
  resnaccs_count: number
}): void {
  patchSnacc(payload.snacc_id, (snacc) => ({
    ...snacc,
    resnaccs_count: payload.resnaccs_count,
  }))
  void getQueryClient().invalidateQueries({
    queryKey: ["snaccs", payload.snacc_id, "resnaccs"],
  })
}

export function onSnaccDeleted(payload: { snacc_ids: string[] }): void {
  payload.snacc_ids.forEach(removeSnacc)
}

export function onSnaccPoll(payload: {
  snacc_id: string
  total_votes: number
  options: { id: string; votes_count: number }[]
}): void {
  patchSnacc(payload.snacc_id, (snacc) => {
    if (!snacc.poll) return snacc
    if (!snacc.poll.closed && snacc.poll.my_option_id === null) return snacc

    const counts = new Map(
      payload.options.map((option) => [option.id, option.votes_count])
    )
    return {
      ...snacc,
      poll: {
        ...snacc.poll,
        total_votes: payload.total_votes,
        options: snacc.poll.options.map((option) => ({
          ...option,
          votes_count: counts.get(option.id) ?? option.votes_count,
        })),
      },
    }
  })
}
