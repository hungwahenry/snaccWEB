import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Spinner } from "@/components/ui/spinner"

type OnboardingHeaderProps = {
  step: number
  totalSteps: number
  onBack: () => void
  onLogout: () => void
  loggingOut: boolean
}

export function OnboardingHeader({
  step,
  totalSteps,
  onBack,
  onLogout,
  loggingOut,
}: OnboardingHeaderProps) {
  return (
    <div className="flex h-12 items-center gap-1">
      {step > 0 ? (
        <IconButton icon={ArrowLeftIcon} label="Back" onClick={onBack} />
      ) : null}
      <span className="text-sm font-semibold text-muted-foreground">
        Step {step + 1} of {totalSteps}
      </span>
      <div className="flex-1" />
      <Button
        variant="ghost"
        size="sm"
        disabled={loggingOut}
        onClick={onLogout}
        className="text-muted-foreground"
      >
        {loggingOut ? <Spinner /> : "Log out"}
      </Button>
    </div>
  )
}
