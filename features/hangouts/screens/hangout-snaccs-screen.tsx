"use client"

import {
  CalendarXIcon,
  MessageCircleIcon,
  MessageSquareDashedIcon,
} from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import { useFlagWhenKnown } from "@/features/config/hooks/use-flag"
import { BackHeader } from "@/features/navigation/components/back-header"
import { SnaccSheets } from "@/features/snaccs/components/sheets/snacc-sheets"
import { SnaccList } from "@/features/snaccs/components/snacc-list"
import { useSnacc } from "@/features/snaccs/hooks/use-snacc"
import { useSnaccActions } from "@/features/snaccs/hooks/use-snacc-actions"
import { snaccPath } from "@/features/snaccs/routes"
import { useBack } from "@/hooks/use-back"
import { useRealtimeRoom } from "@/hooks/use-realtime-room"
import { isNotFound } from "@/lib/api/errors"
import { realtimeRooms } from "@/providers/realtime-rooms"
import { HangoutBlockSkeleton } from "../components/block/hangout-block-skeleton"
import { SnaccHangoutBlock } from "../containers/snacc-hangout-block"
import { useHangoutSnaccs } from "../hooks/tagging/use-hangout-snaccs"
import { hangoutTitle } from "../utils/hangouts"

export function HangoutSnaccsScreen({ snaccId }: { snaccId: string }) {
  const back = useBack(snaccPath(snaccId))
  const enabled = useFlagWhenKnown("hangouts")
  const query = useSnacc(snaccId)
  const snacc = query.data ?? null
  const list = useHangoutSnaccs(snaccId)
  const { handlers, votingPollFor, sheets } = useSnaccActions()
  useRealtimeRoom(enabled ? realtimeRooms.snacc(snaccId) : null)

  const title = snacc?.hangout ? hangoutTitle(snacc.hangout) : "Hangout"
  const missing = query.isError
    ? isNotFound(query.error)
    : snacc !== null && !snacc.hangout

  if (enabled === false) {
    return (
      <>
        <BackHeader title={title} onBack={back} />
        <EmptyState
          icon={CalendarXIcon}
          title="Not available"
          description="Hangouts are switched off right now."
          className="py-24"
        />
      </>
    )
  }

  if (missing || query.isError) {
    return (
      <>
        <BackHeader title={title} onBack={back} />
        <div className="py-24">
          {missing ? (
            <EmptyState
              icon={MessageSquareDashedIcon}
              title="This hangout isn't available"
              description="It may have been deleted, or hidden."
            />
          ) : (
            <LoadFailed
              title="Could not load this hangout"
              onRetry={() => void query.refetch()}
            />
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <BackHeader title={title} subtitle="Snaccs from it" onBack={back} />

      <SnaccList
        snaccs={list.items}
        loading={enabled === null || list.loading}
        failed={list.failed}
        loadingMore={list.loadingMore}
        onRetry={list.retry}
        onLoadMore={list.loadMore}
        handlers={handlers}
        votingPollFor={votingPollFor}
        failedTitle="Could not load this hangout's snaccs"
        header={
          <div className="p-4">
            {snacc?.hangout ? (
              <SnaccHangoutBlock
                snaccId={snacc.id}
                hangout={snacc.hangout}
                mine={snacc.mine}
                linkToSnaccs={false}
              />
            ) : (
              <HangoutBlockSkeleton />
            )}
          </div>
        }
        empty={{
          icon: MessageCircleIcon,
          title: "Nothing from it yet",
          description:
            "Snaccs people going post from this hangout show up here.",
        }}
      />

      <SnaccSheets {...sheets} />
    </>
  )
}
