import {
  ArrowLeftRightIcon,
  HandCoinsIcon,
  SparklesIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react"
import type { MoneySection } from "../types"

export interface MoneyTab {
  key: MoneySection
  label: string
  title: string
  icon: LucideIcon
}

const TABS: MoneyTab[] = [
  { key: "home", label: "Home", title: "Money", icon: WalletIcon },
  {
    key: "requests",
    label: "Requests",
    title: "Requests",
    icon: HandCoinsIcon,
  },
  {
    key: "transactions",
    label: "Transactions",
    title: "Transactions",
    icon: ArrowLeftRightIcon,
  },
  {
    key: "earnings",
    label: "Earnings",
    title: "Monetisation",
    icon: SparklesIcon,
  },
]

const WITHOUT_EARNINGS = TABS.filter((tab) => tab.key !== "earnings")

export function moneyTabs(earningsEnabled: boolean): MoneyTab[] {
  return earningsEnabled ? TABS : WITHOUT_EARNINGS
}

/** The section to show: the earnings tab falls back to home once earnings is switched off. */
export function visibleSection(
  section: MoneySection,
  earningsEnabled: boolean
): MoneySection {
  return section === "earnings" && !earningsEnabled ? "home" : section
}

export function sectionTitle(section: MoneySection): string {
  return TABS.find((tab) => tab.key === section)?.title ?? "Money"
}
