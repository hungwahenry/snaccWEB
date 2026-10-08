import { ChatBackdrop } from "@/features/chat-themes/components/chat-backdrop"
import type { ChatPaint } from "@/features/chat-themes/types"
import { threadColors } from "@/features/chat-themes/utils/paint"
import { cn } from "@/lib/utils"
import { BubbleText } from "../thread/bubble-content"
import { BubbleFrame } from "../thread/bubble-frame"
import { DayBreak } from "../thread/day-break"
import { MessageMeta } from "../thread/message-meta"

function SampleMessage({
  mine,
  first,
  last,
  text,
}: {
  mine: boolean
  first: boolean
  last: boolean
  text: string
}) {
  return (
    <div
      className={cn(
        "flex",
        mine ? "justify-end" : "justify-start",
        first ? "mt-2" : "mt-0.5"
      )}
    >
      <div className="max-w-[80%] min-w-0 shrink">
        <BubbleFrame
          mine={mine}
          firstInBurst={first}
          lastInBurst={last}
          sending={false}
          failed={false}
          bubbled
        >
          <BubbleText
            mine={mine}
            body={text}
            shownBody={text}
            edited={false}
            removed={null}
            spaced={false}
          />
        </BubbleFrame>
      </div>
    </div>
  )
}

export function ChatThemePreview({
  paint,
  photoUrl,
  className,
}: {
  paint: ChatPaint | null
  photoUrl: string | null
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden bg-background", className)}
      style={paint ? threadColors(paint) : undefined}
    >
      {paint ? <ChatBackdrop paint={paint} photoUrl={photoUrl} /> : null}
      <div className="relative flex size-full flex-col justify-end px-3 pb-4">
        <DayBreak label="Today" />
        <SampleMessage
          mine={false}
          first
          last={false}
          text="Did you see the game last night?"
        />
        <SampleMessage mine={false} first={false} last text="That ending 😮" />
        <SampleMessage mine first last text="Still not over it 😭" />
        <MessageMeta mine time="9:41 PM" delivery="seen" />
      </div>
    </div>
  )
}
