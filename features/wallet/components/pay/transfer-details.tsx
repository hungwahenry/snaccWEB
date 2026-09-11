import { CheckIcon, CopyIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Spinner } from "@/components/ui/spinner"
import type { DepositAccount } from "../../types"

export function TransferDetails({
  transfer,
  amount,
  expired,
  timeLeft,
  copied,
  onCopy,
  starting,
  onRestart,
  checking,
  nothingYet,
  onCheck,
}: {
  transfer: DepositAccount
  amount: string
  expired: boolean
  timeLeft: string
  copied: boolean
  onCopy: () => void
  starting: boolean
  onRestart: () => void
  checking: boolean
  nothingYet: boolean
  onCheck: () => void
}) {
  if (expired) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 px-8 py-24">
        <p className="text-center text-2xl font-extrabold text-foreground">
          That account number expired
        </p>
        <p className="text-center text-base leading-6 text-muted-foreground">
          No harm done — nothing moved. Grab a fresh one and send {amount} to
          it.
        </p>
        <Button
          size="lg"
          className="h-14 w-full text-base"
          disabled={starting}
          onClick={onRestart}
        >
          {starting ? <Spinner /> : "Get a new account number"}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 px-6 pt-6 pb-8">
      <div className="flex flex-col items-center gap-2">
        <p className="text-5xl font-extrabold text-foreground tabular-nums">
          {amount}
        </p>
        <p className="text-center text-base leading-6 text-muted-foreground">
          Transfer exactly this amount from any bank app. It lands on its own
          the moment your bank sends it.
        </p>
      </div>

      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy account number"
        className="flex flex-col gap-1 rounded-3xl bg-muted px-5 py-4 text-left transition-opacity active:opacity-70"
      >
        <Eyebrow>{copied ? "Copied" : transfer.bank_name}</Eyebrow>
        <span className="flex items-center justify-between">
          <span className="text-3xl font-extrabold text-foreground tabular-nums">
            {transfer.account_number}
          </span>
          {copied ? (
            <CheckIcon className="size-6 text-success" />
          ) : (
            <CopyIcon className="size-6 text-muted-foreground" />
          )}
        </span>
        <span className="text-sm font-bold text-foreground">
          {transfer.account_name}
        </span>
      </button>

      <p className="text-center text-sm text-muted-foreground tabular-nums">
        This account number is yours for {timeLeft}
      </p>

      {nothingYet ? (
        <p className="text-center text-sm text-muted-foreground">
          Nothing yet — the moment your bank sends it, it lands.
        </p>
      ) : null}

      <Button
        size="lg"
        className="h-14 w-full text-base"
        disabled={checking}
        onClick={onCheck}
      >
        {checking ? <Spinner /> : "I have sent it"}
      </Button>
    </div>
  )
}
