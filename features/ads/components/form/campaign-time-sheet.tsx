import { ActionSheet } from "@/components/ui/action-sheet"
import {
  DateTimePicker,
  type DateTimePickerProps,
} from "@/components/ui/date-time-picker"

export function CampaignTimeSheet({
  open,
  onOpenChange,
  title,
  picker,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  picker: DateTimePickerProps
}) {
  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      className="px-4"
    >
      <DateTimePicker {...picker} />
    </ActionSheet>
  )
}
