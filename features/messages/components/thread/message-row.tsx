"use client"

import { EllipsisIcon, ReplyIcon } from "lucide-react"
import { memo } from "react"
import { IconButton } from "@/components/ui/icon-button"
import { ReactionPicker } from "@/features/reactions/components/reaction-picker"
import { useLongPress } from "@/hooks/use-long-press"
import { cn } from "@/lib/utils"
import type {
  DeliveryState,
  Message,
  MessageImage,
  VoiceSources,
} from "../../types"
import { canActOnMessage } from "../../utils/editing"
import { viewOnceOf } from "../../utils/images"
import { myReaction } from "../../utils/reactions"
import { voiceSourceOf } from "../../utils/voice"
import { DayBreak } from "./day-break"
import { MessageBubble } from "./message-bubble"
import { MessageMeta } from "./message-meta"

const TOOL =
  "size-8 text-muted-foreground hover:bg-accent hover:text-foreground"

/** What every row in a thread can do. One object for the whole thread, so rows stay memoised. */
export interface MessageRowHandlers {
  onReact: (message: Message, emoji: string) => void
  onOpenActions: (message: Message) => void
  onReply: (message: Message) => void
  onRetry: (message: Message) => void
  onDiscard: (message: Message) => void
  onOpenViewOnce: (message: Message, photo: MessageImage) => void
  onOpenImages: (message: Message, index: number) => void
  onOpenMoney?: (transactionId: string) => void
  onPayRequest?: (request: { id: string; amount: number }) => void
}

export type MessageRowProps = {
  message: Message
  dayBreak: string | null
  time: string | null
  delivery: DeliveryState | null
  firstInBurst: boolean
  lastInBurst: boolean
  handlers: MessageRowHandlers
  voiceSources: VoiceSources
  /** The view-once photo being fetched right now, if it is this row's. */
  openingPhotoId: string | null
  /** Requests being paid right now; two can be at once. */
  payingRequestIds: readonly string[]
  requestExpiryDays: number
  highlighted?: boolean
}

function MessageRowComponent({
  message,
  dayBreak,
  time,
  delivery,
  firstInBurst,
  lastInBurst,
  handlers,
  voiceSources,
  openingPhotoId,
  payingRequestIds,
  requestExpiryDays,
  highlighted = false,
}: MessageRowProps) {
  const settled = canActOnMessage(message)
  const mine = message.mine
  const longPress = useLongPress(
    settled ? () => handlers.onOpenActions(message) : undefined
  )
  const money = message.money
  const transactionId = money?.transaction_id ?? null
  const request = money?.request ?? null
  const viewOnce = viewOnceOf(message)

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

  const onOpenMoney = handlers.onOpenMoney
  const onPayRequest = handlers.onPayRequest

  return (
    <>
      {dayBreak ? <DayBreak label={dayBreak} /> : null}

      <div
        data-message-id={message.id}
        className={cn(
          "group relative isolate flex flex-col",
          firstInBurst ? "mt-2" : "mt-0.5"
        )}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-x-3 inset-y-0 -z-10 bg-primary/10 transition-opacity duration-700",
            highlighted ? "opacity-100" : "opacity-0"
          )}
        />
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
            <MessageBubble
              message={message}
              firstInBurst={firstInBurst}
              lastInBurst={lastInBurst}
              voiceSource={voiceSourceOf(message, voiceSources)}
              onPressImage={(index) => handlers.onOpenImages(message, index)}
              onOpenViewOnce={(photo) =>
                handlers.onOpenViewOnce(message, photo)
              }
              openingViewOnce={
                viewOnce !== undefined && openingPhotoId === viewOnce.id
              }
              onRetry={() => handlers.onRetry(message)}
              onDiscard={() => handlers.onDiscard(message)}
              onReact={
                settled
                  ? (emoji) => handlers.onReact(message, emoji)
                  : undefined
              }
              onOpenMoney={
                transactionId && onOpenMoney
                  ? () => onOpenMoney(transactionId)
                  : undefined
              }
              onPayRequest={
                money && request && onPayRequest
                  ? () => onPayRequest({ id: request.id, amount: money.amount })
                  : undefined
              }
              paying={request !== null && payingRequestIds.includes(request.id)}
              requestExpiryDays={requestExpiryDays}
            />
          </div>
          {mine ? null : tools}
        </div>

        <MessageMeta mine={mine} time={time} delivery={delivery} />
      </div>
    </>
  )
}

export const MessageRow = memo(MessageRowComponent)
