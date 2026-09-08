import { Button } from "@/components/ui/button"
import { Keypad } from "@/components/ui/keypad"
import { Spinner } from "@/components/ui/spinner"
import { formatNaira } from "@/lib/format"
import type { PayFlow } from "../../hooks/pay/use-pay-flow"
import { AmountDisplay } from "./amount-display"
import { PAY_TITLES } from "./pay-titles"
import { TargetLine } from "./target-line"

export function AmountStep({ flow }: { flow: PayFlow }) {
  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col md:min-h-0">
      <div className="flex flex-1 flex-col justify-center gap-2 py-10">
        <AmountDisplay raw={flow.amount} />
        {flow.pinned && flow.target ? (
          <TargetLine target={flow.target} />
        ) : null}
        {flow.insufficient ? (
          <button
            type="button"
            onClick={flow.addMoney}
            className="self-center rounded-full bg-muted px-4 py-2 text-sm font-bold text-foreground transition-opacity active:opacity-70"
          >
            Add {formatNaira(flow.shortfall)} to cover it
          </button>
        ) : null}
        <p className="text-center text-sm text-muted-foreground">
          {flow.insufficient
            ? "That is more than your wallet holds."
            : flow.mode === "topup"
              ? `From ${formatNaira(flow.min)}.`
              : `You have ${formatNaira(flow.balance)}.`}
        </p>
      </div>

      <div className="flex flex-col gap-4 pb-6">
        <Keypad onKey={flow.press} />
        <div className="px-6">
          <Button
            size="lg"
            className="h-14 w-full text-base"
            disabled={!flow.amountOk || flow.starting}
            onClick={flow.toRecipient}
          >
            {flow.starting ? <Spinner /> : PAY_TITLES[flow.mode]}
          </Button>
        </div>
      </div>
    </div>
  )
}
