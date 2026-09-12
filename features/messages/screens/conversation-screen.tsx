"use client"

import { EllipsisIcon, MessageCircleDashedIcon } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"
import { ComposerScreen } from "@/components/ui/composer-screen"
import { EmptyState } from "@/components/ui/empty-state"
import { IconButton } from "@/components/ui/icon-button"
import { LoadFailed } from "@/components/ui/load-failed"
import { BackHeader } from "@/features/navigation/components/back-header"
import { ReportSheet } from "@/features/reports/components/report-sheet"
import { StickerCreator } from "@/features/stickers/components/sticker-creator"
import { StickerTraySheet } from "@/features/stickers/containers/sticker-tray-sheet"
import { PersonAvatar } from "@/features/users/components/person-avatar"
import { profilePath } from "@/features/users/routes"
import { handleOf } from "@/features/users/utils/names"
import { TransactionDetailSheet } from "@/features/wallet/components/home/transaction-detail-sheet"
import { useBack } from "@/hooks/use-back"
import { MessageComposer } from "../components/composer/message-composer"
import { StreakFlame } from "../components/conversations/streak-flame"
import { MessageActionsSheet } from "../components/sheets/message-actions-sheet"
import { ThreadMenuSheet } from "../components/sheets/thread-menu-sheet"
import { GhostBanner } from "../components/thread/ghost-banner"
import { MessageRow } from "../components/thread/message-row"
import { ThreadView } from "../components/thread/thread-view"
import { ViewOnceViewer } from "../components/thread/view-once-viewer"
import { useConversationScreen } from "../hooks/use-conversation-screen"
import { MESSAGES_PATH } from "../routes"

export function ConversationScreen({ id }: { id: string }) {
  const back = useBack(MESSAGES_PATH)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const screen = useConversationScreen(id, { scrollRef, inputRef })
  const { conversation, messages, other } = screen

  return (
    <ComposerScreen>
      <BackHeader
        title={screen.title}
        subtitle={other ? (handleOf(other) ?? undefined) : undefined}
        onBack={back}
        right={
          conversation ? (
            <>
              <StreakFlame days={conversation.streak} />
              {other?.username ? (
                <Link
                  href={profilePath(other.username)}
                  aria-label={`${screen.title}'s profile`}
                  className="ml-1"
                >
                  <PersonAvatar person={other} className="size-8" />
                </Link>
              ) : other ? (
                <PersonAvatar person={other} className="ml-1 size-8" />
              ) : null}
              <IconButton
                icon={EllipsisIcon}
                label="Conversation options"
                onClick={screen.menu.onOpenMenu}
              />
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
            <GhostBanner onReveal={screen.menu.confirmReveal} />
          ) : null}

          <ThreadView
            scrollRef={scrollRef}
            onScroll={screen.onScroll}
            list={messages}
            items={screen.thread}
            typing={screen.typing}
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
                openingPhotoId={screen.openingPhotoId}
                payingRequestIds={screen.payingRequestIds}
                requestExpiryDays={screen.requestExpiryDays}
              />
            )}
          />

          <MessageComposer {...screen.composer} />
        </>
      )}

      {conversation ? (
        <ThreadMenuSheet
          open={screen.menu.menuOpen}
          onOpenChange={screen.menu.setMenuOpen}
          conversation={conversation}
          onReveal={screen.menu.confirmReveal}
          onBlock={screen.menu.confirmBlock}
          onUnblock={screen.menu.onUnblock}
          onReport={screen.menu.onReportOther}
        />
      ) : null}
      <MessageActionsSheet {...screen.actions} />
      <ViewOnceViewer {...screen.viewOnce} />
      {screen.stickerTray ? <StickerTraySheet {...screen.stickerTray} /> : null}
      <StickerCreator {...screen.stickerCreator} />
      <ReportSheet {...screen.report} />
      <TransactionDetailSheet {...screen.moneyDetail} />
    </ComposerScreen>
  )
}
