import {
  BanknoteArrowDownIcon,
  EyeIcon,
  EyeOffIcon,
  HandCoinsIcon,
  LandmarkIcon,
  LockIcon,
  QrCodeIcon,
  SendIcon,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import type { AccountFooterView } from "../../hooks/home/use-wallet-home"
import { AccountFooter } from "./account-footer"

export function BalanceCard({
  balance,
  hidden,
  onToggleHidden,
  frozen,
  showAccount,
  footer,
  onSend,
  onRequest,
  onTopUp,
  onReceive,
  onPayLink,
}: {
  balance: string
  hidden: boolean
  onToggleHidden: () => void
  frozen: boolean
  showAccount: boolean
  footer: AccountFooterView | null
  onSend: () => void
  onRequest: () => void
  onTopUp: () => void
  onReceive: () => void
  onPayLink: () => void
}) {
  const actions: { icon: LucideIcon; label: string; onPress: () => void }[] = [
    { icon: BanknoteArrowDownIcon, label: "Add money", onPress: onTopUp },
    ...(showAccount
      ? [{ icon: LandmarkIcon, label: "Account", onPress: onReceive }]
      : []),
    { icon: QrCodeIcon, label: "Pay link", onPress: onPayLink },
  ]

  return (
    <div className="mx-6 flex flex-col gap-6 rounded-3xl bg-card px-5 py-7">
      <div className="flex flex-col items-center gap-1.5">
        <button
          type="button"
          onClick={onToggleHidden}
          aria-label={hidden ? "Show balance" : "Hide balance"}
          className="flex items-center gap-1.5 transition-opacity active:opacity-60"
        >
          <Eyebrow>Wallet balance</Eyebrow>
          {hidden ? (
            <EyeOffIcon className="size-4 text-muted-foreground" />
          ) : (
            <EyeIcon className="size-4 text-muted-foreground" />
          )}
        </button>
        <p className="truncate text-center text-5xl font-extrabold text-foreground tabular-nums">
          {balance}
        </p>
        {frozen ? (
          <span className="mt-1 flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
            <LockIcon className="size-4 text-muted-foreground" />
            <span className="text-sm font-bold text-muted-foreground">
              Locked — contact support
            </span>
          </span>
        ) : null}
      </div>

      <div className="flex gap-3">
        <Button
          size="lg"
          variant="outline"
          className="h-14 flex-1 text-base"
          onClick={onRequest}
        >
          <HandCoinsIcon /> Request
        </Button>
        <Button
          size="lg"
          className="h-14 flex-1 text-base"
          disabled={frozen}
          onClick={onSend}
        >
          <SendIcon /> Send
        </Button>
      </div>

      <div className="flex">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onPress}
            className="flex flex-1 flex-col items-center gap-2 transition-transform active:scale-95"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-muted">
              <action.icon className="size-6 text-foreground" />
            </span>
            <span className="truncate text-center text-sm font-medium text-foreground">
              {action.label}
            </span>
          </button>
        ))}
      </div>

      {footer ? <AccountFooter footer={footer} /> : null}
    </div>
  )
}
