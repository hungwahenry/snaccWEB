"use client"

import {
  BanknoteIcon,
  EllipsisIcon,
  HandCoinsIcon,
  ImageIcon,
  MessageCircleDashedIcon,
  StickerIcon,
} from "lucide-react"
import Link from "next/link"
import { useRef } from "react"
import { EmptyState } from "@/components/ui/empty-state"
import { IconButton } from "@/components/ui/icon-button"
import { ListFooter } from "@/components/ui/list-footer"
import { LoadFailed } from "@/components/ui/load-failed"
import { LoadMore } from "@/components/ui/load-more"
import { GifPickerSheet } from "@/features/giphy/components/gif-picker-sheet"
import { BackHeader } from "@/features/navigation/components/back-header"
import { ReportSheet } from "@/features/reports/components/report-sheet"
import { profilePath } from "@/features/users/routes"
import { TransactionDetailSheet } from "@/features/wallet/components/home/transaction-detail-sheet"
import { useBack } from "@/hooks/use-back"
import { MessageComposer } from "../components/composer/message-composer"
import type { ComposerAction } from "../components/composer/composer-actions-menu"
import { MessageAvatar } from "../components/conversations/message-avatar"
import { StreakFlame } from "../components/conversations/streak-flame"
import { MessageActionsSheet } from "../components/sheets/message-actions-sheet"
import { ThreadMenuSheet } from "../components/sheets/thread-menu-sheet"
import { GhostBanner } from "../components/thread/ghost-banner"
import { MessageRow } from "../components/thread/message-row"
import { MessageThreadSkeleton } from "../components/thread/message-thread-skeleton"
import { TypingIndicator } from "../components/thread/typing-indicator"
import { ViewOnceViewer } from "../components/thread/view-once-viewer"
import { useConversationScreen } from "../hooks/use-conversation-screen"
import { useMessageComposer } from "../hooks/use-message-composer"
import { messagesPath } from "../routes"

export function ConversationScreen({ id }: { id: string }) {
  const back = useBack(messagesPath)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const screen = useConversationScreen(id, { scrollRef, inputRef })
  const { conversation, messages } = screen

  const composer = useMessageComposer({
    onSend: screen.onSubmit,
    sending: screen.sending,
    replyingTo: screen.replyingTo,
    onCancelReply: screen.onCancelReply,
    editing: screen.editing,
    onCancelEdit: screen.onCancelEdit,
    onType: screen.notifyTyping,
    images: screen.draft,
    maxImages: screen.maxImages,
  })

  const actions: ComposerAction[] = [
    ...(composer.canAttach
      ? [
          {
            key: "photo",
            icon: ImageIcon,
            label: "Photo",
            hint: "From your device",
            onPress: screen.onAddImages,
          },
        ]
      : []),
    ...(screen.gifPicker && !composer.editing
      ? [
          {
            key: "gif",
            icon: StickerIcon,
            label: "GIF",
            hint: "Search GIPHY",
            onPress: screen.gifPicker.show,
          },
        ]
      : []),
    ...(screen.moneyActions && !composer.editing
      ? [
          {
            key: "send",
            icon: BanknoteIcon,
            label: "Send money",
            hint: "From your wallet",
            onPress: screen.moneyActions.onSendMoney,
          },
          {
            key: "request",
            icon: HandCoinsIcon,
            label: "Request money",
            hint: "Ask for an amount",
            onPress: screen.moneyActions.onRequestMoney,
          },
        ]
      : []),
  ]

  return (
    <div className="flex h-dvh flex-col">
      <BackHeader
        title={screen.title}
        subtitle={screen.otherUsername ? `@${screen.otherUsername}` : undefined}
        onBack={back}
        right={
          conversation ? (
            <>
              <StreakFlame days={conversation.streak} />
              {screen.other ? (
                <Link
                  href={
                    screen.otherUsername
                      ? profilePath(screen.otherUsername)
                      : "#"
                  }
                  aria-label="Profile"
                  className="ml-1"
                >
                  <MessageAvatar party={screen.other} className="size-8" />
                </Link>
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
      ) : !conversation ? (
        <MessageThreadSkeleton />
      ) : (
        <>
          {conversation.you_are_ghost && !conversation.revealed ? (
            <GhostBanner onReveal={screen.menu.confirmReveal} />
          ) : null}

          <div
            ref={scrollRef}
            onScroll={screen.onScroll}
            className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-4"
          >
            {messages.loading ? (
              <MessageThreadSkeleton />
            ) : screen.thread.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <EmptyState
                  icon={MessageCircleDashedIcon}
                  title="No messages yet"
                  description="Say hi. It's just you two in here."
                />
              </div>
            ) : (
              <>
                <LoadMore
                  onReach={messages.loadMore}
                  disabled={messages.loadingMore || !messages.hasMore}
                />
                <ListFooter loading={messages.loadingMore} />
                <div className="flex-1" />
                {screen.thread.map((item) => (
                  <MessageRow
                    key={item.message.id}
                    message={item.message}
                    dayBreak={item.dayBreak}
                    time={item.time}
                    delivery={
                      item.message.id === screen.newest?.id && item.message.mine
                        ? screen.seen
                          ? "seen"
                          : "sent"
                        : null
                    }
                    firstInBurst={item.firstInBurst}
                    lastInBurst={item.lastInBurst}
                    onReact={screen.onReact}
                    onReply={screen.onStartReply}
                    onOpenActions={screen.onOpenActions}
                    onRetry={screen.onRetryMessage}
                    onDiscard={screen.onDiscardMessage}
                    onOpenViewOnce={screen.onOpenViewOnce}
                    onOpenImages={screen.onOpenImages}
                    openingViewOnce={screen.openingViewOnce}
                    onOpenMoney={screen.onOpenMoney}
                    onPayRequest={screen.onPayRequest}
                    payingRequestId={screen.payingRequestId}
                  />
                ))}
                {screen.typing ? <TypingIndicator /> : null}
              </>
            )}
          </div>

          <MessageComposer
            inputRef={inputRef}
            body={composer.body}
            onChange={composer.change}
            onSend={composer.send}
            canSend={composer.canSend}
            sending={composer.sending}
            editing={composer.editing}
            context={composer.context}
            maxLength={composer.maxLength}
            remaining={composer.remaining}
            showCounter={composer.showCounter}
            images={screen.draft}
            onRemoveImage={screen.onRemoveImage}
            viewOnce={screen.viewOnce}
            onToggleViewOnce={screen.onToggleViewOnce}
            actions={actions}
          />
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
      <ViewOnceViewer
        url={screen.viewOnceUrl}
        onClose={screen.onCloseViewOnce}
      />
      {screen.gifPicker ? <GifPickerSheet {...screen.gifPicker.sheet} /> : null}
      <ReportSheet {...screen.report} />
      <TransactionDetailSheet {...screen.moneyDetail} />
    </div>
  )
}
