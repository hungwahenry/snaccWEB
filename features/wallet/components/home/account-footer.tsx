import { ChevronRightIcon, CopyIcon, LandmarkIcon } from "lucide-react"
import Link from "next/link"
import { copyLink } from "@/lib/share-links"
import { RECEIVE_PATH } from "../../routes"
import type { VirtualAccount } from "../../types"
import { groupAccountNumber } from "../../utils/format"

/** The balance card's footer: your account number where you can already see it. */
export function AccountFooter({ account }: { account: VirtualAccount | null }) {
  if (account?.status === "active" && account.account_number) {
    const accountNumber = account.account_number
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
              {groupAccountNumber(accountNumber)}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {account.bank_name}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => void copyLink(accountNumber, "Account number")}
            aria-label="Copy account number"
            className="flex size-9 items-center justify-center rounded-full bg-muted transition-opacity active:opacity-70"
          >
            <CopyIcon className="size-4 text-foreground" />
          </button>
        </div>
      </div>
    )
  }

  const pending = account?.status === "pending"

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
            {pending
              ? "Your account number is on the way"
              : "Get your account number"}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {pending
              ? "Usually takes a minute — tap to check."
              : "Receive money from any bank, straight into Snacc."}
          </span>
        </span>
        <ChevronRightIcon className="size-5 text-muted-foreground" />
      </Link>
    </div>
  )
}
