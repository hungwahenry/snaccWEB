import { ActionSheet } from "@/components/ui/action-sheet"
import {
  DateTimePicker,
  type DateTimePickerProps,
} from "@/components/ui/date-time-picker"

export type ScheduleSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  picker: DateTimePickerProps
}

export function ScheduleSheet({
  open,
  onOpenChange,
  picker,
}: ScheduleSheetProps) {
  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Schedule"
      className="px-4"
    >
      <DateTimePicker {...picker} />
    </ActionSheet>
  )
}
