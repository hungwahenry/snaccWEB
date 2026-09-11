import { ChevronRightIcon, CopyIcon, LandmarkIcon } from "lucide-react"
import Link from "next/link"
import type { AccountFooterView } from "../../hooks/home/use-wallet-home"
import { RECEIVE_PATH } from "../../routes"

/** The balance card's footer: your account number where you can already see it. */
export function AccountFooter({ footer }: { footer: AccountFooterView }) {
  if (footer.kind === "number") {
    return (
      <div>
        <div className="-mx-5 h-px bg-border" />
        <div className="flex items-center gap-3 pt-4">
          <LandmarkIcon className="size-5 shrink-0 text-muted-foreground" />
          <Link
            href={RECEIVE_PATH}
            className="flex min-w-0 flex-1 flex-col"
            aria-label="Open account details"
          >
            <span className="font-extrabold text-foreground tabular-nums">
              {footer.number}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {footer.bankName}
            </span>
          </Link>
          <button
            type="button"
            onClick={footer.onCopy}
            aria-label="Copy account number"
            className="flex size-9 items-center justify-center rounded-full bg-muted transition-opacity active:opacity-70"
          >
            <CopyIcon className="size-4 text-foreground" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="-mx-5 h-px bg-border" />
      <Link
        href={RECEIVE_PATH}
        className="flex items-center gap-3 pt-4 transition-opacity active:opacity-70"
      >
        <LandmarkIcon className="size-5 shrink-0 text-muted-foreground" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-sm font-bold text-foreground">
            {footer.pending
              ? "Your account number is on the way"
              : "Get your account number"}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {footer.pending
              ? "Usually takes a minute — tap to check."
              : "Receive money from any bank, straight into Snacc."}
          </span>
        </span>
        <ChevronRightIcon className="size-5 text-muted-foreground" />
      </Link>
    </div>
  )
}
