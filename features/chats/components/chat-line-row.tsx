import { memo } from "react"
import { DayBreak } from "@/features/messages/components/thread/day-break"
import type { ThreadItem } from "@/features/messages/types"
import { clockTime } from "@/lib/format"
import type { ChatEvent, ChatMessage } from "../types"
import { lineText } from "../utils/rooms"

function ChatLineRowComponent({
  message,
  dayBreak,
  event,
}: Pick<ThreadItem<ChatMessage>, "message" | "dayBreak"> & {
  event: ChatEvent
}) {
  return (
    <>
      {dayBreak ? <DayBreak label={dayBreak} /> : null}

      <p className="px-6 py-2 text-center text-xs text-muted-foreground">
        {lineText(event, message.sender, message.subject)} ·{" "}
        {clockTime(message.created_at)}
      </p>
    </>
  )
}

export const ChatLineRow = memo(ChatLineRowComponent)
