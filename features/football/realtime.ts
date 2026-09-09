import { getQueryClient } from "@/lib/query-client"

/**
 * A new snacc in a match room.
 *
 * The room is refetched rather than having the snacc pushed into it: the event carries an id, not
 * the snacc, and the room is short and chronological so a refetch costs one page. Messages can
 * prepend because their event carries the whole message; this one deliberately does not.
 */
export function onMatchSnacc(payload: {
  match_id: string
  snacc_id: string
}): void {
  const queryClient = getQueryClient()
  void queryClient.invalidateQueries({
    queryKey: ["match-room", payload.match_id],
  })
  void queryClient.invalidateQueries({ queryKey: ["match-snacc-counts"] })
}
