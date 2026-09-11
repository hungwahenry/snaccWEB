"use client"

import {
  CheckCheckIcon,
  CheckIcon,
  EllipsisIcon,
  ReplyIcon,
} from "lucide-react"
import { memo } from "react"
import { IconButton } from "@/components/ui/icon-button"
import { ReactionPicker } from "@/features/reactions/components/reaction-picker"
import { useLongPress } from "@/hooks/use-long-press"
import { cn } from "@/lib/utils"
import type { DeliveryState, Message, MessageImage } from "../../types"
import { canActOnMessage } from "../../utils/editing"
import { viewOnceOf } from "../../utils/images"
import { myReaction } from "../../utils/reactions"
import { DayBreak } from "./day-break"
import { MessageBubble } from "./message-bubble"

const DELIVERY = {
  sent: { label: "Sent", icon: CheckIcon, tint: "text-muted-foreground" },
  seen: { label: "Seen", icon: CheckCheckIcon, tint: "text-foreground" },
} as const

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
  /** The view-once photo being fetched right now, if it is this row's. */
  openingPhotoId: string | null
  /** Requests being paid right now; two can be at once. */
  payingRequestIds: readonly string[]
  requestExpiryDays: number
}

function MessageRowComponent({
  message,
  dayBreak,
  time,
  delivery,
  firstInBurst,
  lastInBurst,
  handlers,
  openingPhotoId,
  payingRequestIds,
  requestExpiryDays,
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

  const Delivery = delivery ? DELIVERY[delivery] : null
  const onOpenMoney = handlers.onOpenMoney
  const onPayRequest = handlers.onPayRequest

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
            <MessageBubble
              message={message}
              firstInBurst={firstInBurst}
              lastInBurst={lastInBurst}
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

        {time || Delivery ? (
          <div
            className={cn(
              "mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground",
              mine ? "justify-end pr-1" : "justify-start pl-1"
            )}
          >
            {Delivery ? (
              <Delivery.icon className={cn("size-3.5", Delivery.tint)} />
            ) : null}
            <span>
              {[Delivery?.label ?? null, time].filter(Boolean).join(" · ")}
            </span>
          </div>
        ) : null}
      </div>
    </>
  )
}

export const MessageRow = memo(MessageRowComponent)
