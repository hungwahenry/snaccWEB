"use client"

import { MessageCircleIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { useFlagWhenKnown } from "@/features/config/hooks/use-flag"
import { BackHeader } from "@/features/navigation/components/back-header"
import { SnaccSheets } from "@/features/snaccs/components/sheets/snacc-sheets"
import { SnaccList } from "@/features/snaccs/components/snacc-list"
import { useSnaccActions } from "@/features/snaccs/hooks/use-snacc-actions"
import { composePath } from "@/features/snaccs/routes"
import { Skeleton } from "@/components/ui/skeleton"
import { useRealtimeRoom } from "@/hooks/use-realtime-room"
import { realtimeRooms } from "@/providers/realtime-rooms"
import { useBack } from "@/hooks/use-back"
import { MatchAttachment } from "../components/match-attachment"
import { useMatchDetail } from "../hooks/use-match-detail"
import { useMatchRoom } from "../hooks/use-match-room"
import { liveMatchCard } from "../utils/card"

export function MatchRoomScreen({ matchId }: { matchId: string }) {
  const back = useBack()
  const enabled = useFlagWhenKnown("snacc_matches")
  const detail = useMatchDetail(matchId)
  const room = useMatchRoom(matchId)
  const { handlers, votingPollFor, sheets } = useSnaccActions()

  // Live: the room is told when somebody posts about this match, from any campus.
  useRealtimeRoom(enabled ? realtimeRooms.match(matchId) : null)

  const match = detail.data?.match ?? null

  if (enabled === false) {
    return (
      <>
        <BackHeader title="Match" onBack={back} />
        <EmptyState
          icon={MessageCircleIcon}
          title="Not available"
          description="Posting about matches is switched off right now."
          className="py-24"
        />
      </>
    )
  }

  return (
    <>
      <BackHeader title="Match" onBack={back} />

      <SnaccList
        snaccs={room.items}
        loading={enabled === null || room.loading || detail.isPending}
        failed={room.failed}
        loadingMore={room.loadingMore}
        onRetry={room.retry}
        onLoadMore={room.loadMore}
        handlers={handlers}
        votingPollFor={votingPollFor}
        failedTitle="Could not load the room"
        header={
          match ? (
            <div className="flex flex-col gap-3 p-4">
              <MatchAttachment
                match={liveMatchCard(match)}
                interactive={false}
              />
              <Button
                className="w-full"
                render={<Link href={composePath({ matchId })} />}
              >
                Snacc about this
              </Button>
            </div>
          ) : null
        }
        empty={{
          icon: MessageCircleIcon,
          title: "Nobody has said anything yet",
          description:
            "Be the first. Everyone watching this match sees it, whichever campus they're on.",
        }}
      />

      <SnaccSheets {...sheets} />
    </>
  )
}
