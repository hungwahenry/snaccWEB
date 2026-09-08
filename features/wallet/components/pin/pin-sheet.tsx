import { ActionSheet } from "@/components/ui/action-sheet"
import { PinPad } from "./pin-pad"

export function PinSheet({
  open,
  onOpenChange,
  value,
  onKey,
  title,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: string
  onKey: (key: string) => void
  title: string
}) {
  return (
    <ActionSheet open={open} onOpenChange={onOpenChange} className="pt-4 pb-4">
      <PinPad
        value={value}
        onKey={onKey}
        title={title}
        hint="Enter your 6-digit wallet PIN"
      />
    </ActionSheet>
  )
}
