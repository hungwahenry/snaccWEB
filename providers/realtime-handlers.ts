import {
  onChatMessage,
  onChatMessageRemoved,
  onChatMessageUpdated,
  onChatRoomUpdated,
} from "@/features/chats/realtime"
import { roomsChanged } from "@/features/chats/cache"
import { onEarningsWallet } from "@/features/earnings/realtime"
import { onMatchSnacc } from "@/features/football/realtime"
import {
  onHangoutEdited,
  onHangoutsDeleted,
  onHangoutState,
  onSnaccHangout,
} from "@/features/hangouts/realtime"
import type { JoinState } from "@/features/hangouts/types"
import { onMomentsChanged } from "@/features/moments/realtime"
import { onSessionRevoked } from "@/features/auth/realtime"
import { onBlocked } from "@/features/blocks/realtime"
import { onConfigChanged } from "@/features/config/realtime"
import {
  onFollowState,
  type FollowStatePayload,
} from "@/features/follows/realtime"
import { onProfileCounts } from "@/features/users/realtime"
import {
  onConversationRead,
  onConversationRevealed,
  onConversationSeen,
  onMessageNew,
  onMessageUpdated,
  onPhotoOpened,
} from "@/features/messages/realtime"
import {
  onNotification,
  onNotificationsChanged,
} from "@/features/notifications/realtime"
import { onPremiumChanged } from "@/features/premium/realtime"
import { onScoreChanged } from "@/features/score/realtime"
import {
  onMoneyRequest,
  onVirtualAccount,
  onWalletBalance,
  onWithdrawal,
} from "@/features/wallet/realtime"
import {
  onScheduledChanged,
  onSnaccComment,
  onSnaccDeleted,
  onSnaccEdited,
  onSnaccPoll,
  onSnaccProcessed,
  onSnaccReaction,
  onSnaccResnacc,
} from "@/features/snaccs/realtime"

export const REALTIME_HANDLERS = {
  notification: onNotification,
  "notification.removed": onNotification,
  "notifications.changed": onNotificationsChanged,
  "moments.changed": onMomentsChanged,
  "follow.state": (payload: FollowStatePayload) => {
    onFollowState(payload)
    onMomentsChanged({ author_id: payload.user_id })
  },
  "profile.counts": onProfileCounts,
  blocked: onBlocked,
  "session.revoked": onSessionRevoked,
  "config.changed": onConfigChanged,
  "match.snacc": onMatchSnacc,
  "score.changed": onScoreChanged,
  "premium.changed": onPremiumChanged,
  "snacc.reaction": onSnaccReaction,
  "snacc.comment": onSnaccComment,
  "snacc.poll": onSnaccPoll,
  "snacc.hangout": onSnaccHangout,
  "hangout.state": (payload: { snacc_id: string; state: JoinState }) => {
    onHangoutState(payload)
    roomsChanged()
  },
  "snacc.resnacc": onSnaccResnacc,
  "snacc.deleted": (payload: { snacc_ids: string[] }) => {
    onSnaccDeleted(payload)
    onHangoutsDeleted(payload)
  },
  "snacc.edited": (payload: { snacc_id: string }) => {
    onSnaccEdited(payload)
    onHangoutEdited(payload)
  },
  "snacc.processed": onSnaccProcessed,
  "scheduled.changed": onScheduledChanged,
  "chat.message": onChatMessage,
  "chat.message.removed": onChatMessageRemoved,
  "chat.message.updated": onChatMessageUpdated,
  "chat.room.updated": onChatRoomUpdated,
  "message.new": onMessageNew,
  "message.updated": onMessageUpdated,
  "conversation.revealed": onConversationRevealed,
  "conversation.read": onConversationRead,
  "conversation.seen": onConversationSeen,
  "message.photo.opened": onPhotoOpened,
  wallet: (payload: { balance: number }) => {
    onEarningsWallet()
    onWalletBalance(payload)
  },
  withdrawal: onWithdrawal,
  money_request: onMoneyRequest,
  virtual_account: onVirtualAccount,
} satisfies Record<string, (payload: never) => void>
