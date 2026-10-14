import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { legalPath } from "@/features/legal/routes"

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
    <div className="flex flex-col gap-3">
      {isLast ? (
        <p className="px-2 text-center text-xs leading-5 text-muted-foreground">
          By finishing, you agree to the{" "}
          <Link
            href={legalPath("terms")}
            target="_blank"
            className="font-medium text-foreground"
          >
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link
            href={legalPath("privacy")}
            target="_blank"
            className="font-medium text-foreground"
          >
            Privacy Policy
          </Link>
          .
        </p>
      ) : null}
      <Button
        size="lg"
        className="h-14 text-base font-semibold"
        disabled={disabled || submitting}
        onClick={onPress}
      >
        {submitting ? <Spinner /> : isLast ? "Finish" : "Continue"}
      </Button>
    </div>
  )
}
