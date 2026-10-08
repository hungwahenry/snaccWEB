import { FlagIcon, LinkIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { ActionSheet, ActionSheetChoice } from "@/components/ui/action-sheet"
import type { PackMenu } from "../types"

export type PackMenuSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  menu: PackMenu
  onShare: () => void
  onRename: () => void
  onReport: () => void
  onDelete: () => void
}

export function PackMenuSheet({
  open,
  onOpenChange,
  menu,
  onShare,
  onRename,
  onReport,
  onDelete,
}: PackMenuSheetProps) {
  return (
    <ActionSheet open={open} onOpenChange={onOpenChange} title="Pack">
      {menu.share ? (
        <ActionSheetChoice
          icon={LinkIcon}
          label="Copy link"
          hint="Share this pack with anyone"
          onPress={onShare}
        />
      ) : null}
      {menu.rename ? (
        <ActionSheetChoice
          icon={PencilIcon}
          label="Rename"
          hint="Give your pack a new name"
          onPress={onRename}
        />
      ) : null}
      {menu.report ? (
        <ActionSheetChoice
          icon={FlagIcon}
          label="Report"
          hint="Flag this pack for review"
          onPress={onReport}
        />
      ) : null}
      {menu.remove ? (
        <ActionSheetChoice
          icon={Trash2Icon}
          label="Delete pack"
          hint="Take it out of everyone's tray"
          destructive
          onPress={onDelete}
        />
      ) : null}
    </ActionSheet>
  )
}
