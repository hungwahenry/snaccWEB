import { WalletIcon } from "lucide-react"
import Link from "next/link"
import { squircleRadius } from "@/lib/squircle"
import { cn } from "@/lib/utils"
import { WALLET_PATH } from "../routes"

const SIZE = 96

export function MoneyFab({ hidden }: { hidden: boolean }) {
  return (
    <Link
      href={WALLET_PATH}
      aria-label="Open Money"
      className={cn(
        "fixed right-0 bottom-[calc(var(--fab-bottom)+8px)] z-30 -rotate-8 bg-primary text-primary-foreground transition duration-220 active:opacity-80 md:hidden",
        hidden ? "translate-x-28" : "translate-x-[46px]"
      )}
      style={{ width: SIZE, height: SIZE, borderRadius: squircleRadius(SIZE) }}
    >
      <WalletIcon className="absolute top-[18px] left-3.5 size-6 rotate-8" />
    </Link>
  )
}
