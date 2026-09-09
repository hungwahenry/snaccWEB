import { onEarningsWallet } from "@/features/earnings/realtime"
import { onMatchSnacc } from "@/features/football/realtime"
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
  onMoneyRequest,
  onVirtualAccount,
  onWalletBalance,
  onWithdrawal,
} from "@/features/wallet/realtime"
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
  "match.snacc": onMatchSnacc,
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
  wallet: (payload: { balance: number }) => {
    onEarningsWallet(payload)
    onWalletBalance(payload)
  },
  withdrawal: onWithdrawal,
  money_request: onMoneyRequest,
  virtual_account: onVirtualAccount,
} satisfies Record<string, (payload: never) => void>
