import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

type OnboardingFooterProps = {
  isLast: boolean
  disabled: boolean
  submitting: boolean
  onPress: () => void
}

export function OnboardingFooter({
  isLast,
  disabled,
  submitting,
  onPress,
}: OnboardingFooterProps) {
  return (
    <Button
      size="lg"
      className="h-14 text-base font-semibold"
      disabled={disabled || submitting}
      onClick={onPress}
    >
      {submitting ? <Spinner /> : isLast ? "Finish" : "Continue"}
    </Button>
  )
}
