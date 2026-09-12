import { ActionSheet } from "@/components/ui/action-sheet"
import {
  DateTimePicker,
  type DateTimePickerProps,
} from "@/components/ui/date-time-picker"
import { PremiumGate } from "@/features/premium/components/premium-gate"

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
      <PremiumGate
        title="Schedule your snaccs"
        body="Write it now and pick when it goes out."
      >
        <DateTimePicker {...picker} />
      </PremiumGate>
    </ActionSheet>
  )
}
