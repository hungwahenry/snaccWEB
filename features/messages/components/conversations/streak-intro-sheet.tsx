import { ActionSheet } from "@/components/ui/action-sheet"
import { Button } from "@/components/ui/button"

export function StreakIntroSheet({
  open,
  onOpenChange,
  onDismiss,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDismiss: () => void
}) {
  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      className="flex flex-col items-center gap-6 px-6 pt-4 pb-4"
    >
      <div className="flex size-20 items-center justify-center rounded-full bg-muted text-4xl">
        🔥
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
          Keep a streak going
        </h2>
        <p className="text-base leading-6 text-muted-foreground">
          Message someone back and forth on the same day and a 🔥 appears beside
          their name. Keep it up daily and the number climbs.
        </p>
      </div>
      <Button className="w-full" onClick={onDismiss}>
        Got it
      </Button>
    </ActionSheet>
  )
}
