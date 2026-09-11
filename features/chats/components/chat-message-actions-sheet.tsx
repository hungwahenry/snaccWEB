import {
  FlagIcon,
  HeartIcon,
  PencilIcon,
  ReplyIcon,
  Trash2Icon,
  UsersRoundIcon,
  WandSparklesIcon,
} from "lucide-react"
import { ActionSheet, ActionSheetChoice } from "@/components/ui/action-sheet"
import type { ChatMessage } from "../types"

export type ChatMessageActionsSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  message: ChatMessage | null
  canEdit: boolean
  onReply: () => void
  onEdit: () => void
  onWithdraw: () => void
  onReport: () => void
  onSeeReactions?: () => void
  onKeepSticker?: () => void
  onMakeSticker?: () => void
}

export function ChatMessageActionsSheet({
  open,
  onOpenChange,
  message,
  canEdit,
  onReply,
  onEdit,
  onWithdraw,
  onReport,
  onSeeReactions,
  onKeepSticker,
  onMakeSticker,
}: ChatMessageActionsSheetProps) {
  return (
    <ActionSheet open={open} onOpenChange={onOpenChange} title="Message">
      <ActionSheetChoice
        icon={ReplyIcon}
        label="Reply"
        hint="Quote this message"
        onPress={onReply}
      />
      {onSeeReactions ? (
        <ActionSheetChoice
          icon={UsersRoundIcon}
          label="Reactions"
          hint="See who reacted, and with what"
          onPress={onSeeReactions}
        />
      ) : null}
      {onKeepSticker ? (
        <ActionSheetChoice
          icon={HeartIcon}
          label="Save sticker"
          hint="Keep it in your tray"
          onPress={onKeepSticker}
        />
      ) : null}
      {onMakeSticker ? (
        <ActionSheetChoice
          icon={WandSparklesIcon}
          label="Make a sticker"
          hint="Cut one out of this photo"
          onPress={onMakeSticker}
        />
      ) : null}
      {canEdit ? (
        <ActionSheetChoice
          icon={PencilIcon}
          label="Edit"
          hint="Change what you said"
          onPress={onEdit}
        />
      ) : null}
      {message?.mine ? (
        <ActionSheetChoice
          icon={Trash2Icon}
          label="Withdraw"
          hint="Leaves a gap in the room where it was"
          destructive
          onPress={onWithdraw}
        />
      ) : null}
      {message && !message.mine ? (
        <ActionSheetChoice
          icon={FlagIcon}
          label="Report"
          hint="Flag this message for review"
          onPress={onReport}
        />
      ) : null}
    </ActionSheet>
  )
}
