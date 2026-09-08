"use client"

import {
  CheckCheckIcon,
  CheckIcon,
  EllipsisIcon,
  ReplyIcon,
} from "lucide-react"
import { memo } from "react"
import { ReactionPicker } from "@/features/reactions/components/reaction-picker"
import { useLongPress } from "@/hooks/use-long-press"
import { cn } from "@/lib/utils"
import type { Message, MessageImage } from "../../types"
import { canActOnMessage } from "../../utils/editing"
import { myReaction } from "../../utils/reactions"
import { DayBreak } from "./day-break"
import { MessageBubble } from "./message-bubble"

const DELIVERY = {
  sent: { label: "Sent", icon: CheckIcon, tint: "text-muted-foreground" },
  seen: { label: "Seen", icon: CheckCheckIcon, tint: "text-foreground" },
} as const

export type DeliveryState = keyof typeof DELIVERY

export type MessageRowProps = {
  message: Message
  dayBreak: string | null
  time: string | null
  delivery: DeliveryState | null
  firstInBurst: boolean
  lastInBurst: boolean
  onReact: (message: Message, emoji: string) => void
  onOpenActions: (message: Message) => void
  onReply: (message: Message) => void
  onRetry: (message: Message) => void
  onDiscard: (message: Message) => void
  onOpenViewOnce: (message: Message, photo: MessageImage) => void
  onOpenImages: (message: Message, index: number) => void
  openingViewOnce: boolean
  onOpenMoney?: (transactionId: string) => void
  onPayRequest?: (request: { id: string; amount: number }) => void
  payingRequestId?: string | null
}

function MessageRowComponent({
  message,
  dayBreak,
  time,
  delivery,
  firstInBurst,
  lastInBurst,
  onReact,
  onOpenActions,
  onReply,
  onRetry,
  onDiscard,
  onOpenViewOnce,
  onOpenImages,
  openingViewOnce,
  onOpenMoney,
  onPayRequest,
  payingRequestId,
}: MessageRowProps) {
  const settled = canActOnMessage(message)
  const mine = message.mine
  const longPress = useLongPress(
    settled ? () => onOpenActions(message) : undefined
  )

  const tools = settled ? (
    <span className="flex shrink-0 items-center gap-0.5 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100 md:has-[[data-popup-open]]:opacity-100">
      <ReactionPicker
        mine={myReaction(message)}
        onSelect={(emoji) => onReact(message, emoji)}
        align={mine ? "end" : "start"}
      />
      <span className="hidden items-center gap-0.5 md:flex">
        <button
          type="button"
          onClick={() => onReply(message)}
          aria-label="Reply"
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <ReplyIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onOpenActions(message)}
          aria-label="Message options"
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <EllipsisIcon className="size-4" />
        </button>
      </span>
    </span>
  ) : null

  const Delivery = delivery ? DELIVERY[delivery] : null

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
              onPressImage={(index) => onOpenImages(message, index)}
              onOpenViewOnce={(photo) => onOpenViewOnce(message, photo)}
              openingViewOnce={openingViewOnce}
              onRetry={() => onRetry(message)}
              onDiscard={() => onDiscard(message)}
              onOpenMoney={onOpenMoney}
              onPayRequest={onPayRequest}
              payingRequestId={payingRequestId}
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
