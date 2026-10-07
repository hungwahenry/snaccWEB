"use client"

import {
  DateTimePicker,
  type DateTimePickerProps,
} from "@/components/ui/date-time-picker"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function TimePickerDialog({
  title,
  open,
  onOpenChange,
  picker,
}: {
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
  picker: DateTimePickerProps
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DateTimePicker {...picker} />
      </DialogContent>
    </Dialog>
  )
}
