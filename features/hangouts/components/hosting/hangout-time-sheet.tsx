import { ActionSheet } from "@/components/ui/action-sheet"
import {
  DateTimePicker,
  type DateTimePickerProps,
} from "@/components/ui/date-time-picker"

export function HangoutTimeSheet({
  open,
  onOpenChange,
  picker,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  picker: DateTimePickerProps
}) {
  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title="When"
      className="px-4"
    >
      <DateTimePicker {...picker} />
    </ActionSheet>
  )
}
