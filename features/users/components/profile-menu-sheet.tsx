import {
  BanIcon,
  CopyIcon,
  FlagIcon,
  SettingsIcon,
  ShareIcon,
} from "lucide-react"
import { ActionSheet, ActionSheetChoice } from "@/components/ui/action-sheet"

export type ProfileMenuSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  isMe: boolean
  reportLabel: string
  blockLabel: string
  onSettings: () => void
  onShare: () => void
  onCopyLink: () => void
  onReport: () => void
  onBlock: () => void
}

export function ProfileMenuSheet({
  open,
  onOpenChange,
  isMe,
  reportLabel,
  blockLabel,
  onSettings,
  onShare,
  onCopyLink,
  onReport,
  onBlock,
}: ProfileMenuSheetProps) {
  return (
    <ActionSheet open={open} onOpenChange={onOpenChange}>
      {isMe ? (
        <ActionSheetChoice
          icon={SettingsIcon}
          label="Settings"
          hint="Manage your account"
          onPress={onSettings}
        />
      ) : null}
      <ActionSheetChoice
        icon={ShareIcon}
        label="Share profile"
        hint="Send the link along"
        onPress={onShare}
      />
      <ActionSheetChoice
        icon={CopyIcon}
        label="Copy link"
        hint="Paste it anywhere"
        onPress={onCopyLink}
      />
      {isMe ? null : (
        <>
          <ActionSheetChoice
            icon={FlagIcon}
            label={reportLabel}
            hint="Something wrong with the person"
            destructive
            onPress={onReport}
          />
          <ActionSheetChoice
            icon={BanIcon}
            label={blockLabel}
            hint="Hide each other everywhere"
            destructive
            onPress={onBlock}
          />
        </>
      )}
    </ActionSheet>
  )
}
