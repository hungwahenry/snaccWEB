"use client"

import { MessageCircleDashedIcon } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"
import { ComposerScreen } from "@/components/ui/composer-screen"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadFailed } from "@/components/ui/load-failed"
import { BackHeader } from "@/features/navigation/components/back-header"
import { ReportSheet } from "@/features/reports/components/report-sheet"
import { StickerPickerSheet } from "@/features/stickers/containers/sticker-picker-sheet"
import { PersonAvatar } from "@/features/users/components/person-avatar"
import { handleOf } from "@/features/users/utils/names"
import { TransactionDetailSheet } from "@/features/wallet/components/home/transaction-detail-sheet"
import { useBack } from "@/hooks/use-back"
import { MessageComposer } from "../components/composer/message-composer"
import { StreakFlame } from "../components/conversations/streak-flame"
import { MessageActionsSheet } from "../components/sheets/message-actions-sheet"
import { GhostBanner } from "../components/thread/ghost-banner"
import { MessageRow } from "../components/thread/message-row"
import { ThreadView } from "../components/thread/thread-view"
import { ViewOnceViewer } from "../components/thread/view-once-viewer"
import { useConversationScreen } from "../hooks/use-conversation-screen"
import { MESSAGES_PATH } from "../routes"

export function ConversationScreen({
  id,
  focusId,
}: {
  id: string
  focusId: string | null
}) {
  const back = useBack(MESSAGES_PATH)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const screen = useConversationScreen(id, focusId, { scrollRef, inputRef })
  const { conversation, messages, other } = screen

  return (
    <ComposerScreen>
      <BackHeader
        title={screen.title}
        subtitle={other ? (handleOf(other) ?? undefined) : undefined}
        onBack={back}
        titleHref={screen.detailsHref}
        right={
          conversation && other && screen.detailsHref ? (
            <>
              <StreakFlame days={conversation.streak} />
              <Link
                href={screen.detailsHref}
                aria-label="Chat details"
                className="ml-1"
              >
                <PersonAvatar person={other} className="size-8" />
              </Link>
            </>
          ) : undefined
        }
      />

      {screen.notAvailable ? (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState
            icon={MessageCircleDashedIcon}
            title="This conversation isn't available"
            description="It may have been deleted."
          />
        </div>
      ) : screen.failed ? (
        <div className="flex flex-1 items-center justify-center">
          <LoadFailed
            title="Could not load this conversation"
            onRetry={screen.retry}
          />
        </div>
      ) : (
        <>
          {conversation?.you_are_ghost && !conversation.revealed ? (
            <GhostBanner onReveal={screen.confirmReveal} />
          ) : null}

          <ThreadView
            scrollRef={scrollRef}
            onScroll={screen.onScroll}
            list={messages}
            items={screen.thread}
            typing={screen.typing}
            paint={screen.paint}
            photoUrl={screen.photoUrl}
            seeking={screen.seeking}
            failedTitle="Could not load these messages"
            empty={
              <EmptyState
                icon={MessageCircleDashedIcon}
                title="No messages yet"
                description="Say hi. It's just you two in here."
              />
            }
            renderRow={(item) => (
              <MessageRow
                key={item.message.id}
                {...item}
                handlers={screen.handlers}
                voiceSources={screen.voiceSources}
                openingPhotoId={screen.openingPhotoId}
                payingRequestIds={screen.payingRequestIds}
                requestExpiryDays={screen.requestExpiryDays}
                highlighted={item.message.id === screen.highlightId}
              />
            )}
          />

          <MessageComposer {...screen.composer} />
        </>
      )}

      <MessageActionsSheet {...screen.actions} />
      <ViewOnceViewer {...screen.viewOnce} />
      {screen.stickerTray ? (
        <StickerPickerSheet {...screen.stickerTray} />
      ) : null}
      <ReportSheet {...screen.report} />
      <TransactionDetailSheet {...screen.moneyDetail} />
    </ComposerScreen>
  )
}
