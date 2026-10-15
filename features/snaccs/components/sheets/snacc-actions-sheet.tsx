import {
  BanIcon,
  CopyIcon,
  EyeOffIcon,
  FlagIcon,
  MegaphoneIcon,
  PencilIcon,
  PinIcon,
  ShareIcon,
  Trash2Icon,
  UserRoundXIcon,
} from "lucide-react"
import { ActionSheet, ActionSheetChoice } from "@/components/ui/action-sheet"

export type SnaccActionsSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mine: boolean
  editable: boolean
  onEdit: () => void
  onShare: () => void
  onCopyLink: () => void
  onPin?: () => void
  pinned: boolean
  onPromote?: () => void
  onDelete: () => void
  onHide?: () => void
  promoted: boolean
  onReportSnacc: () => void
  onReportAuthor: () => void
  onBlockAuthor: () => void
  authorUsername: string | null
}

export function SnaccActionsSheet({
  open,
  onOpenChange,
  mine,
  editable,
  onEdit,
  onShare,
  onCopyLink,
  onPin,
  pinned,
  onPromote,
  onDelete,
  onHide,
  promoted,
  onReportSnacc,
  onReportAuthor,
  onBlockAuthor,
  authorUsername,
}: SnaccActionsSheetProps) {
  return (
    <ActionSheet open={open} onOpenChange={onOpenChange}>
      {editable ? (
        <ActionSheetChoice
          icon={PencilIcon}
          label="Edit"
          hint="Only for a short while after posting"
          onPress={onEdit}
        />
      ) : null}
      <ActionSheetChoice
        icon={ShareIcon}
        label="Share"
        hint="Send the link along"
        onPress={onShare}
      />
      <ActionSheetChoice
        icon={CopyIcon}
        label="Copy link"
        hint="Paste it anywhere"
        onPress={onCopyLink}
      />

      {mine ? (
        <>
          {!onPin ? null : (
            <ActionSheetChoice
              icon={PinIcon}
              label={pinned ? "Unpin from profile" : "Pin to profile"}
              hint={
                pinned
                  ? "Remove it from the top"
                  : "Put it at the top of your page"
              }
              onPress={onPin}
            />
          )}
          {onPromote ? (
            <ActionSheetChoice
              icon={MegaphoneIcon}
              label="Promote"
              hint="Pay to show it to more people"
              onPress={onPromote}
            />
          ) : null}
          <ActionSheetChoice
            icon={Trash2Icon}
            label="Delete"
            hint="Takes any replies with it"
            destructive
            onPress={onDelete}
          />
        </>
      ) : (
        <>
          {onHide ? (
            <ActionSheetChoice
              icon={EyeOffIcon}
              label="Not interested"
              hint={
                promoted
                  ? "Don't show this promotion again"
                  : "Don't show this snacc again"
              }
              onPress={onHide}
            />
          ) : null}
          <ActionSheetChoice
            icon={FlagIcon}
            label="Report snacc"
            hint="Something wrong with this post"
            destructive
            onPress={onReportSnacc}
          />
          <ActionSheetChoice
            icon={UserRoundXIcon}
            label={
              authorUsername
                ? `Report @${authorUsername}`
                : "Report this person"
            }
            hint="Something wrong with the person"
            destructive
            onPress={onReportAuthor}
          />
          <ActionSheetChoice
            icon={BanIcon}
            label={
              authorUsername ? `Block @${authorUsername}` : "Block this person"
            }
            hint="Hide each other everywhere"
            destructive
            onPress={onBlockAuthor}
          />
        </>
      )}
    </ActionSheet>
  )
}
