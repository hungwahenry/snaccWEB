import { onGhostWindow } from "@/features/ghost/realtime"
import {
  onConversationRead,
  onConversationRevealed,
  onMessageNew,
  onMessageUpdated,
} from "@/features/messages/realtime"
import { onNotification } from "@/features/notifications/realtime"
import { onScoreChanged } from "@/features/score/realtime"
import {
  onSnaccComment,
  onSnaccDeleted,
  onSnaccEdited,
  onSnaccPoll,
  onSnaccReaction,
  onSnaccResnacc,
} from "@/features/snaccs/realtime"

export const REALTIME_HANDLERS = {
  notification: onNotification,
  "notification.removed": onNotification,
  "ghost.window": onGhostWindow,
  "score.changed": onScoreChanged,
  "snacc.reaction": onSnaccReaction,
  "snacc.comment": onSnaccComment,
  "snacc.poll": onSnaccPoll,
  "snacc.resnacc": onSnaccResnacc,
  "snacc.deleted": onSnaccDeleted,
  "snacc.edited": onSnaccEdited,
  "message.new": onMessageNew,
  "message.updated": onMessageUpdated,
  "conversation.revealed": onConversationRevealed,
  "conversation.read": onConversationRead,
} satisfies Record<string, (payload: never) => void>
