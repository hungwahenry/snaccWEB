import {
  BanknoteArrowDownIcon,
  CheckIcon,
  CopyIcon,
  LandmarkIcon,
  ShareIcon,
  UserRoundCheckIcon,
  ZapIcon,
} from "lucide-react"
import type { VirtualAccount } from "../../types"
import { groupAccountNumber } from "../../utils/format"
import { PerkRow } from "../shared/perk-row"

export function AccountCard({
  account,
  copied,
  onCopy,
  onShare,
}: {
  account: VirtualAccount
  copied: boolean
  onCopy: () => void
  onShare: () => void
}) {
  return (
    <div className="flex flex-col gap-7 px-6 py-6">
      <div className="flex flex-col gap-6 rounded-3xl bg-primary p-6">
        <div className="flex items-center gap-2">
          <LandmarkIcon className="size-4 text-primary-foreground/70" />
          <span className="text-[11px] font-bold tracking-wider text-primary-foreground/70 uppercase">
            {account.bank_name}
          </span>
        </div>

        <button
          type="button"
          onClick={onCopy}
          aria-label="Copy account number"
          className="text-left transition-opacity active:opacity-80"
        >
          <p className="text-4xl font-extrabold text-primary-foreground tabular-nums">
            {groupAccountNumber(account.account_number ?? "")}
          </p>
          <p className="mt-1.5 text-sm font-bold text-primary-foreground/70">
            {account.account_name}
          </p>
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCopy}
            aria-label="Copy account number"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary-foreground text-sm font-extrabold text-primary transition-opacity active:opacity-80"
          >
            {copied ? (
              <CheckIcon className="size-[18px] text-success" />
            ) : (
              <CopyIcon className="size-[18px]" />
            )}
            {copied ? "Copied" : "Copy number"}
          </button>
          <button
            type="button"
            onClick={onShare}
            aria-label="Share account details"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-primary-foreground/30 text-sm font-extrabold text-primary-foreground transition-opacity active:opacity-70"
          >
            <ShareIcon className="size-[18px]" /> Share
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-1">
        <PerkRow
          icon={BanknoteArrowDownIcon}
          title="From any bank or app"
          text="Transfers from every Nigerian bank land in this account."
        />
        <PerkRow
          icon={ZapIcon}
          title="Straight into your wallet"
          text="Money shows up in your Snacc balance, usually within a minute."
        />
        <PerkRow
          icon={UserRoundCheckIcon}
          title="Yours alone"
          text="This number is tied to your Snacc account and nobody else's."
        />
      </div>
    </div>
  )
}
