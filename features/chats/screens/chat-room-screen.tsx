"use client"

import {
  BellIcon,
  BellOffIcon,
  LockIcon,
  MessagesSquareIcon,
} from "lucide-react"
import Link from "next/link"
import { useRef } from "react"
import { ComposerScreen } from "@/components/ui/composer-screen"
import { EmptyState } from "@/components/ui/empty-state"
import { IconButton } from "@/components/ui/icon-button"
import { MessageComposer } from "@/features/messages/components/composer/message-composer"
import { ThreadView } from "@/features/messages/components/thread/thread-view"
import { MESSAGES_PATH } from "@/features/messages/routes"
import { BackHeader } from "@/features/navigation/components/back-header"
import { ReportSheet } from "@/features/reports/components/report-sheet"
import { ReactionBreakdownSheet } from "@/features/snaccs/components/card/reactions/reaction-breakdown-sheet"
import { StickerCreator } from "@/features/stickers/components/sticker-creator"
import { StickerTraySheet } from "@/features/stickers/containers/sticker-tray-sheet"
import { useBack } from "@/hooks/use-back"
import { ChatLineRow } from "../components/chat-line-row"
import { ChatMessageActionsSheet } from "../components/chat-message-actions-sheet"
import { ChatMessageRow } from "../components/chat-message-row"
import { RoomIcon } from "../components/room-icon"
import { useChatRoomScreen } from "../hooks/use-chat-room-screen"

export function ChatRoomScreen({ roomId }: { roomId: string }) {
  const back = useBack(MESSAGES_PATH)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const screen = useChatRoomScreen(roomId, { scrollRef, inputRef })
  const { room } = screen

  return (
    <ComposerScreen>
      <BackHeader
        title={screen.title}
        subtitle={screen.subtitle}
        onBack={back}
        right={
          room ? (
            <>
              {screen.hangoutHref ? (
                <Link href={screen.hangoutHref} aria-label="Open the hangout">
                  <RoomIcon room={room} small />
                </Link>
              ) : (
                <RoomIcon room={room} small />
              )}
              <IconButton
                icon={screen.muted ? BellOffIcon : BellIcon}
                label={screen.muted ? "Unmute room" : "Mute room"}
                onClick={screen.onToggleMuted}
              />
            </>
          ) : undefined
        }
      />

      <ThreadView
        scrollRef={scrollRef}
        onScroll={screen.onScroll}
        list={screen.messages}
        items={screen.thread}
        typing={screen.typingLabel}
        failedTitle="Could not load this room"
        empty={
          <EmptyState
            icon={MessagesSquareIcon}
            title="Nothing here yet"
            description="Be the first to say something."
          />
        }
        renderRow={(item) =>
          item.message.event ? (
            <ChatLineRow
              key={item.message.id}
              message={item.message}
              dayBreak={item.dayBreak}
              event={item.message.event}
            />
          ) : (
            <ChatMessageRow
              key={item.message.id}
              {...item}
              handlers={screen.handlers}
            />
          )
        }
      />

      {screen.closure ? (
        <div className="flex items-center justify-center gap-2 border-t border-border px-4 py-4 text-sm text-muted-foreground">
          <LockIcon className="size-4 shrink-0" />
          {screen.closure}
        </div>
      ) : (
        <MessageComposer {...screen.composer} placeholder="Message the room…" />
      )}

      <ChatMessageActionsSheet {...screen.actions} />
      <ReactionBreakdownSheet {...screen.reactions} />
      {screen.stickerTray ? <StickerTraySheet {...screen.stickerTray} /> : null}
      <StickerCreator {...screen.stickerCreator} />
      <ReportSheet {...screen.report} />
    </ComposerScreen>
  )
}
