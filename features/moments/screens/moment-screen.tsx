"use client"

import { ReportSheet } from "@/features/reports/components/report-sheet"
import { MomentPlayer } from "../components/moment-player"
import { MomentViewersSheet } from "../components/moment-viewers-sheet"
import { useMomentReactions } from "../hooks/use-moment-reactions"
import { useMomentScreen } from "../hooks/use-moment-screen"

export function MomentScreen({ authorId }: { authorId: string }) {
  const screen = useMomentScreen(authorId)
  const { player } = screen
  const reactions = useMomentReactions(player.current?.my_reaction ?? null)

  return (
    <div
      className="fixed inset-0 z-50 bg-black"
      onClick={(event) => {
        if (event.target === event.currentTarget) screen.close()
      }}
    >
      <div className="mx-auto h-full w-full md:max-w-[520px]">
        <MomentPlayer
          moments={player.moments}
          current={player.current}
          index={player.index}
          clock={player.clock}
          held={player.held}
          pageRef={screen.pageRef}
          loading={player.loading}
          failed={player.failed}
          ready={player.ready}
          removing={player.removing}
          replying={player.replying}
          reactions={reactions}
          onRetry={player.retry}
          onMediaReady={player.markReady}
          onPause={player.pause}
          onResume={player.resume}
          onHold={player.hold}
          onRelease={player.release}
          onForward={player.tapForward}
          onBack={player.tapBack}
          onClose={screen.close}
          onNextAuthor={screen.nextAuthor}
          onPreviousAuthor={screen.previousAuthor}
          onViewers={player.openViewers}
          onDelete={player.deleteCurrent}
          onReport={screen.reportCurrent}
          onReact={player.toggleReaction}
          onReply={player.reply}
          onOpenAuthor={screen.openProfile}
        />
      </div>

      <MomentViewersSheet
        open={player.viewers.open}
        onOpenChange={player.viewers.onOpenChange}
        viewers={screen.viewers.items}
        loading={screen.viewers.loading}
      />
      <ReportSheet {...screen.reportSheet} />
    </div>
  )
}
