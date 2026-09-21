"use client"

import { MessageCircleIcon, PlusIcon } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"
import { BackHeader } from "@/features/navigation/components/back-header"
import { SnaccSheets } from "@/features/snaccs/components/sheets/snacc-sheets"
import { SnaccList } from "@/features/snaccs/components/snacc-list"
import { useSnaccActions } from "@/features/snaccs/hooks/use-snacc-actions"
import { HangoutBlockSkeleton } from "../components/block/hangout-block-skeleton"
import { HangoutUnavailable } from "../components/info/hangout-unavailable"
import { SnaccHangoutBlock } from "../containers/snacc-hangout-block"
import { useHangoutSnaccsScreen } from "../hooks/tagging/use-hangout-snaccs-screen"

export function HangoutSnaccsScreen({ snaccId }: { snaccId: string }) {
  const screen = useHangoutSnaccsScreen(snaccId)
  const { handlers, votingPollFor, sheets } = useSnaccActions()
  const { snacc, list } = screen

  if (screen.state !== "ready") {
    return (
      <>
        <BackHeader title={screen.title} onBack={screen.onBack} />
        <HangoutUnavailable state={screen.state} onRetry={screen.retry} />
      </>
    )
  }

  return (
    <>
      <BackHeader
        title={screen.title}
        subtitle="Snaccs from it"
        onBack={screen.onBack}
        right={
          screen.onPost ? (
            <IconButton
              icon={PlusIcon}
              label="Post from this hangout"
              onClick={screen.onPost}
            />
          ) : undefined
        }
      />

      <SnaccList
        snaccs={list.items}
        loading={screen.loading || list.loading}
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
