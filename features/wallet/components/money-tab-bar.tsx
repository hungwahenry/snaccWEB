import {
  ArrowLeftRightIcon,
  HandCoinsIcon,
  SparklesIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react"
import { CountBadge } from "@/components/ui/count-badge"
import { cn } from "@/lib/utils"

export type MoneySection = "home" | "transactions" | "requests" | "earnings"

const TABS: { key: MoneySection; label: string; icon: LucideIcon }[] = [
  { key: "home", label: "Home", icon: WalletIcon },
  { key: "requests", label: "Requests", icon: HandCoinsIcon },
  { key: "transactions", label: "Transactions", icon: ArrowLeftRightIcon },
  { key: "earnings", label: "Earnings", icon: SparklesIcon },
]

export function MoneyTabBar({
  section,
  onChange,
  earningsEnabled,
  badges,
}: {
  section: MoneySection
  onChange: (next: MoneySection) => void
  earningsEnabled: boolean
  badges?: Partial<Record<MoneySection, number>>
}) {
  const tabs = earningsEnabled
    ? TABS
    : TABS.filter((tab) => tab.key !== "earnings")

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center border-t border-border bg-background/95 px-2 pt-2 pb-[max(env(safe-area-inset-bottom),8px)] backdrop-blur md:sticky md:top-14 md:z-20 md:border-t-0 md:border-b md:py-0">
      {tabs.map((tab) => {
        const active = section === tab.key
        const badge = badges?.[tab.key] ?? 0
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.key)}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-bold transition-colors md:h-12 md:flex-row md:gap-2 md:text-sm",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="relative">
              <tab.icon
                className={cn("size-6 md:size-5", active && "stroke-[2.5]")}
              />
              {badge > 0 ? <CountBadge count={badge} /> : null}
            </span>
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
