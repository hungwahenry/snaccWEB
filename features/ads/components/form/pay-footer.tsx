import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function PayFooter({
  label,
  balance,
  problem,
  ready,
  paying,
  onPay,
}: {
  label: string
  balance: string | null
  problem?: string | null
  ready: boolean
  paying: boolean
  onPay: () => void
}) {
  return (
    <div className="flex flex-col gap-2">
      {problem ? (
        <p role="alert" className="text-center text-sm text-destructive">
          {problem}
        </p>
      ) : null}
      <Button
        size="lg"
        className="h-14 w-full text-base"
        disabled={!ready || paying}
        onClick={onPay}
      >
        {paying ? <Spinner /> : label}
      </Button>
      <p className="text-center text-xs leading-5 text-pretty text-muted-foreground">
        {balance ? `${balance} ` : ""}
        The whole budget leaves your wallet now and waits while Snacc reviews
        it.
      </p>
    </div>
  )
}
