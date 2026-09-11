"use client"

import { EllipsisIcon, ReplyIcon } from "lucide-react"
import { memo } from "react"
import { IconButton } from "@/components/ui/icon-button"
import { DayBreak } from "@/features/messages/components/thread/day-break"
import type { ThreadItem } from "@/features/messages/types"
import { myReaction } from "@/features/messages/utils/reactions"
import { ReactionPicker } from "@/features/reactions/components/reaction-picker"
import { useLongPress } from "@/hooks/use-long-press"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "../types"
import { canActOn } from "../utils/rooms"
import { ChatBubble } from "./chat-bubble"

const TOOL =
  "size-8 text-muted-foreground hover:bg-accent hover:text-foreground"

/** What every row in a room can do. One object for the whole room, so rows stay memoised. */
export interface ChatMessageRowHandlers {
  onReact: (message: ChatMessage, emoji: string) => void
  onOpenActions: (message: ChatMessage) => void
  onReply: (message: ChatMessage) => void
  onRetry: (message: ChatMessage) => void
  onDiscard: (message: ChatMessage) => void
  onOpenImages: (message: ChatMessage, index: number) => void
}

function ChatMessageRowComponent({
  message,
  dayBreak,
  time,
  firstInBurst,
  lastInBurst,
  handlers,
}: ThreadItem<ChatMessage> & { handlers: ChatMessageRowHandlers }) {
  const settled = canActOn(message)
  const mine = message.mine
  const longPress = useLongPress(
    settled ? () => handlers.onOpenActions(message) : undefined
  )

  const tools = settled ? (
    <span className="flex shrink-0 items-center gap-0.5 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 md:has-[[data-popup-open]]:opacity-100">
      <ReactionPicker
        mine={myReaction(message)}
        onSelect={(emoji) => handlers.onReact(message, emoji)}
        align={mine ? "end" : "start"}
      />
      <span className="hidden items-center gap-0.5 md:flex">
        <IconButton
          icon={ReplyIcon}
          label="Reply"
          onClick={() => handlers.onReply(message)}
          className={TOOL}
          iconClassName="size-4"
        />
        <IconButton
          icon={EllipsisIcon}
          label="Message options"
          onClick={() => handlers.onOpenActions(message)}
          className={TOOL}
          iconClassName="size-4"
        />
      </span>
    </span>
  ) : null

  return (
    <>
      {dayBreak ? <DayBreak label={dayBreak} /> : null}

      <div
        className={cn("group flex flex-col", firstInBurst ? "mt-2" : "mt-0.5")}
      >
        <div
          className={cn(
            "flex items-center gap-1",
            mine ? "justify-end" : "justify-start"
          )}
        >
          {mine ? tools : null}
          <div
            {...longPress}
            className="max-w-[80%] min-w-0 shrink [@media(pointer:coarse)]:select-none [@media(pointer:coarse)]:[-webkit-touch-callout:none]"
          >
            <ChatBubble
              message={message}
              firstInBurst={firstInBurst}
              lastInBurst={lastInBurst}
              onPressImage={(index) => handlers.onOpenImages(message, index)}
              onRetry={() => handlers.onRetry(message)}
              onDiscard={() => handlers.onDiscard(message)}
              onReact={
                settled
                  ? (emoji) => handlers.onReact(message, emoji)
                  : undefined
              }
            />
          </div>
          {mine ? null : tools}
        </div>

        {time ? (
          <div
            className={cn(
              "mt-0.5 flex items-center text-[11px] text-muted-foreground",
              mine ? "justify-end pr-1" : "justify-start pl-1"
            )}
          >
            <span>{time}</span>
          </div>
        ) : null}
      </div>
    </>
  )
}

export const ChatMessageRow = memo(ChatMessageRowComponent)
