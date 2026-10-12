import { Button } from "@/components/ui/button"

export function StepButton({
  label,
  ready,
  onNext,
}: {
  label: string
  ready: boolean
  onNext: () => void
}) {
  return (
    <Button
      size="lg"
      className="h-14 w-full text-base"
      disabled={!ready}
      onClick={onNext}
    >
      {label}
    </Button>
  )
}
