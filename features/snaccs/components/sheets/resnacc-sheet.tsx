import { QuoteIcon, RepeatIcon, Undo2Icon } from "lucide-react"
import { ActionSheet, ActionSheetChoice } from "@/components/ui/action-sheet"

export type ResnaccSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mine: boolean
  own: boolean
  onResnacc: () => void
  onQuote: () => void
}

export function ResnaccSheet({
  open,
  onOpenChange,
  mine,
  own,
  onResnacc,
  onQuote,
}: ResnaccSheetProps) {
  return (
    <ActionSheet open={open} onOpenChange={onOpenChange}>
      {!own || mine ? (
        <ActionSheetChoice
          icon={mine ? Undo2Icon : RepeatIcon}
          label={mine ? "Undo resnacc" : "Resnacc"}
          hint={mine ? "Take it off your profile" : "Pass it on as it is"}
          onPress={onResnacc}
        />
      ) : null}
      <ActionSheetChoice
        icon={QuoteIcon}
        label="Quote"
        hint="Add something of your own"
        onPress={onQuote}
      />
    </ActionSheet>
  )
}
