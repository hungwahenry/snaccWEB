import { WalletIcon } from "lucide-react"
import Link from "next/link"
import { WALLET_PATH } from "../routes"

export function MoneyFab() {
  return (
    <Link
      href={WALLET_PATH}
      aria-label="Open your wallet"
      className="fixed bottom-[calc(var(--tab-bar-height)+12px)] left-4 z-30 flex h-12 items-center gap-2 rounded-full bg-primary px-5 text-base font-extrabold text-primary-foreground shadow-lg transition-transform active:scale-95 md:hidden"
    >
      <WalletIcon className="size-5" /> Money
    </Link>
  )
}
