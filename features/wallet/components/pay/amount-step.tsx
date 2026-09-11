import { Button } from "@/components/ui/button"
import { Keypad } from "@/components/ui/keypad"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import type { PayFlow } from "../../hooks/pay/use-pay-flow"
import { AmountDisplay } from "./amount-display"
import { FixPill } from "./fix-pill"
import { TargetLine } from "./target-line"

export function AmountStep({
  raw,
  target,
  hint,
  warning,
  fix,
  action,
  ready,
  busy,
  onKey,
  onNext,
}: PayFlow["amount"]) {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col md:min-h-0">
      <div className="flex flex-1 flex-col justify-center gap-2 py-10">
        <AmountDisplay raw={raw} />
        {target ? (
          <TargetLine target={target.target} label={target.label} />
        ) : null}
        {fix ? <FixPill label={fix.label} onPress={fix.onPress} /> : null}
        <p
          className={cn(
            "px-8 text-center text-sm",
            warning ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {hint}
        </p>
      </div>

      <div className="flex flex-col gap-4 pb-6">
        <Keypad onKey={onKey} />
        <div className="px-6">
          <Button
            size="lg"
            className="h-14 w-full text-base"
            disabled={!ready || busy}
            onClick={onNext}
          >
            {busy ? <Spinner /> : action}
          </Button>
        </div>
      </div>
    </div>
  )
}
