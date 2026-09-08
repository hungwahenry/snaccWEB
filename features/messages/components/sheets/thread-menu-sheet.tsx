import { BanIcon, EyeIcon, FlagIcon, Undo2Icon } from "lucide-react"
import { ActionSheet, ActionSheetChoice } from "@/components/ui/action-sheet"
import type { Conversation } from "../../types"

export type ThreadMenuSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  conversation: Conversation
  onReveal: () => void
  onBlock: () => void
  onUnblock: () => void
  onReport: () => void
}

export function ThreadMenuSheet({
  open,
  onOpenChange,
  conversation,
  onReveal,
  onBlock,
  onUnblock,
  onReport,
}: ThreadMenuSheetProps) {
  return (
    <ActionSheet open={open} onOpenChange={onOpenChange} title="Conversation">
      {conversation.can_reveal ? (
        <ActionSheetChoice
          icon={EyeIcon}
          label="Reveal yourself"
          hint="Show them who you are, for good"
          onPress={onReveal}
        />
      ) : null}
      {conversation.other.id ? (
        <ActionSheetChoice
          icon={FlagIcon}
          label="Report"
          hint="Flag this person to our moderators"
          onPress={onReport}
        />
      ) : null}
      {conversation.you_are_ghost ? null : conversation.blocked ? (
        <ActionSheetChoice
          icon={Undo2Icon}
          label="Unblock"
          hint="Let them message you again"
          onPress={onUnblock}
        />
      ) : (
        <ActionSheetChoice
          icon={BanIcon}
          label="Block"
          hint="They can never message you again"
          destructive
          onPress={onBlock}
        />
      )}
    </ActionSheet>
  )
}
