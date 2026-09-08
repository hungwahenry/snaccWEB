import { FlagIcon, PencilIcon, ReplyIcon, Trash2Icon } from "lucide-react"
import { ActionSheet, ActionSheetChoice } from "@/components/ui/action-sheet"
import type { Message } from "../../types"

export type MessageActionsSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  message: Message | null
  canEdit: boolean
  canDelete: boolean
  onReply: () => void
  onEdit: () => void
  onDelete: () => void
  onReport: () => void
}

export function MessageActionsSheet({
  open,
  onOpenChange,
  message,
  canEdit,
  canDelete,
  onReply,
  onEdit,
  onDelete,
  onReport,
}: MessageActionsSheetProps) {
  return (
    <ActionSheet open={open} onOpenChange={onOpenChange} title="Message">
      <ActionSheetChoice
        icon={ReplyIcon}
        label="Reply"
        hint="Quote this message"
        onPress={onReply}
      />
      {canEdit ? (
        <ActionSheetChoice
          icon={PencilIcon}
          label="Edit"
          hint="Change what you said"
          onPress={onEdit}
        />
      ) : null}
      {canDelete ? (
        <ActionSheetChoice
          icon={Trash2Icon}
          label="Delete"
          hint="Remove this for both of you"
          destructive
          onPress={onDelete}
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
