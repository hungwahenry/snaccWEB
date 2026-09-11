import { StickerAttachmentView } from "@/features/stickers/components/sticker-attachment-view"
import { cn } from "@/lib/utils"
import type { Message, MessageImage } from "../../types"
import { bubbleParts } from "../../utils/bubble"
import { BubbleQuote, BubbleText, BubbleVoice } from "./bubble-content"
import { BubbleFrame } from "./bubble-frame"
import { MessageFailed } from "./message-failed"
import { MessageGif } from "./message-gif"
import { MessageImages } from "./message-images"
import { MessageMoney } from "./message-money"
import { MessageReactions } from "./message-reactions"
import { QuotedMomentCard } from "./quoted-moment"
import { ViewOnceCard } from "./view-once-card"

const STICKER_SIZE = 140

export type MessageBubbleProps = {
  message: Message
  firstInBurst: boolean
  lastInBurst: boolean
  onPressImage: (index: number) => void
  onOpenViewOnce: (photo: MessageImage) => void
  openingViewOnce: boolean
  onRetry: () => void
  onDiscard: () => void
  /** A tap on a chip: the same as picking that emoji. Absent while it is still going out. */
  onReact?: (emoji: string) => void
  onOpenMoney?: () => void
  onPayRequest?: () => void
  paying: boolean
  requestExpiryDays: number
}

export function MessageBubble({
  message,
  firstInBurst,
  lastInBurst,
  onPressImage,
  onOpenViewOnce,
  openingViewOnce,
  onRetry,
  onDiscard,
  onReact,
  onOpenMoney,
  onPayRequest,
  paying,
  requestExpiryDays,
}: MessageBubbleProps) {
  const mine = message.mine
  const parts = bubbleParts(message)
  const failed = message.status === "failed"

  return (
    <div className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
      <BubbleFrame
        mine={mine}
        firstInBurst={firstInBurst}
        lastInBurst={lastInBurst}
        sending={message.status === "sending"}
        failed={failed}
        bubbled={parts.bubbled}
        media={
          <>
            {parts.images.length > 0 ? (
              <MessageImages
                images={parts.images}
                onPressImage={onPressImage}
              />
            ) : null}
            {parts.sticker ? (
              <StickerAttachmentView
                sticker={parts.sticker}
                size={STICKER_SIZE}
              />
            ) : null}
            {parts.gif ? <MessageGif gif={parts.gif} /> : null}
          </>
        }
      >
        {parts.viewOnce ? (
          <ViewOnceCard
            photo={parts.viewOnce}
            mine={mine}
            opening={openingViewOnce}
            onPress={() => parts.viewOnce && onOpenViewOnce(parts.viewOnce)}
          />
        ) : null}

        {parts.money ? (
          <MessageMoney
            money={parts.money}
            note={parts.note}
            mine={mine}
            onOpen={onOpenMoney}
            onPay={onPayRequest}
            paying={paying}
            requestExpiryDays={requestExpiryDays}
          />
        ) : null}

        {parts.moment ? (
          <QuotedMomentCard moment={parts.moment} mine={mine} />
        ) : null}

        {parts.reply ? <BubbleQuote glimpse={parts.reply} mine={mine} /> : null}

        {parts.voice ? (
          <BubbleVoice
            note={parts.voice}
            mine={mine}
            afterQuote={parts.reply !== null}
            beforeText={parts.hasText}
          />
        ) : null}

        {parts.hasText ? (
          <BubbleText
            mine={mine}
            body={message.body}
            shownBody={parts.body}
            edited={message.edited}
            removed={parts.removedText}
            spaced={
              parts.reply !== null ||
              parts.moment !== null ||
              parts.voice !== null
            }
          />
        ) : null}
      </BubbleFrame>

      {failed ? (
        <MessageFailed onRetry={onRetry} onDiscard={onDiscard} />
      ) : null}

      <MessageReactions
        reactions={message.reactions}
        mine={mine}
        onPress={onReact}
      />
    </div>
  )
}
