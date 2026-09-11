import {
  BubbleQuote,
  BubbleText,
  BubbleVoice,
} from "@/features/messages/components/thread/bubble-content"
import { BubbleFrame } from "@/features/messages/components/thread/bubble-frame"
import { TAIL_REACH } from "@/features/messages/components/thread/bubble-tail"
import { MessageFailed } from "@/features/messages/components/thread/message-failed"
import { MessageGif } from "@/features/messages/components/thread/message-gif"
import { MessageImages } from "@/features/messages/components/thread/message-images"
import { MessageReactions } from "@/features/messages/components/thread/message-reactions"
import { StickerAttachmentView } from "@/features/stickers/components/sticker-attachment-view"
import { TierName } from "@/features/users/components/flair"
import { PersonAvatar } from "@/features/users/components/person-avatar"
import { ProfileLink } from "@/features/users/components/profile-link"
import type { Author } from "@/features/users/types"
import { nameOf } from "@/features/users/utils/names"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "../types"
import { chatBubbleParts } from "../utils/bubble"

const STICKER_SIZE = 140

/** The DM bubble minus what a room never carries (money, view-once, moments), plus the one thing
 * a DM never needs: who is speaking, on the message that starts a run. */
export function ChatBubble({
  message,
  firstInBurst,
  lastInBurst,
  onPressImage,
  onRetry,
  onDiscard,
  onReact,
}: {
  message: ChatMessage
  firstInBurst: boolean
  lastInBurst: boolean
  onPressImage: (index: number) => void
  onRetry: () => void
  onDiscard: () => void
  onReact?: (emoji: string) => void
}) {
  const mine = message.mine
  const parts = chatBubbleParts(message)
  const failed = message.status === "failed"

  return (
    <div className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
      {firstInBurst && !mine ? <SenderRow sender={message.sender} /> : null}

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
        {parts.reply ? (
          <BubbleQuote
            glimpse={parts.reply}
            author={parts.replyAuthor}
            mine={mine}
          />
        ) : null}

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
            spaced={parts.reply !== null || parts.voice !== null}
          />
        ) : null}
      </BubbleFrame>

      {message.held && mine ? (
        <p className="mt-1 pr-1 text-right text-[11px] text-muted-foreground italic">
          Held for review. Only you can see this.
        </p>
      ) : null}

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

function SenderRow({ sender }: { sender: Author }) {
  return (
    <ProfileLink
      username={sender.username}
      className="mb-1 flex max-w-full items-center gap-1.5 hover:opacity-80"
      style={{ paddingLeft: TAIL_REACH }}
    >
      <PersonAvatar person={sender} className="size-4" />
      <TierName
        score={sender.score}
        official={sender.official}
        birthday={sender.is_birthday}
        name={sender.username ?? nameOf(sender, "Someone")}
        className="text-xs font-bold text-muted-foreground"
        iconSize={12}
      />
    </ProfileLink>
  )
}
