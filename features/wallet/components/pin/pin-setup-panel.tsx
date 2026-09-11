import { KeyRoundIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import type { PinSetupProps } from "../../hooks/pin/use-pin-setup"
import { PinPad } from "./pin-pad"

export function PinSetupPanel({
  stage,
  copy,
  pin,
  title,
  hint,
  error,
  saving,
  onBegin,
  onKey,
}: PinSetupProps) {
  if (stage === "intro") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 px-8 py-24">
        <span className="flex size-20 items-center justify-center rounded-full bg-muted">
          <KeyRoundIcon className="size-9 text-foreground" />
        </span>
        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-2xl font-extrabold text-foreground">
            {copy.title}
          </p>
          <p className="text-center text-base leading-6 text-muted-foreground">
            Six digits that confirm every send. We will email you a code first
            to be sure it is you.
          </p>
        </div>
        <Button
          size="lg"
          className="h-14 w-full max-w-sm text-base"
          onClick={onBegin}
        >
          {copy.action}
        </Button>
      </div>
    )
  }

  if (saving) {
    return (
      <div className="flex justify-center py-24">
        <Spinner className="text-muted-foreground" />
      </div>
    )
  }

  return (
    <PinPad
      className="py-12"
      value={pin}
      onKey={onKey}
      title={title}
      hint={hint}
      error={error}
    />
  )
}
