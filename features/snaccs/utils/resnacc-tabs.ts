import { QuoteIcon, RepeatIcon } from "lucide-react"
import type { PillTab } from "@/components/ui/pill-tabs"
import { compactCount } from "@/lib/format"
import type { ResnaccTab } from "../types"

function label(name: string, count: number | undefined): string {
  return count === undefined ? name : `${name} ${compactCount(count)}`
}

/** The two lists under a snacc's resnaccs, each with its count once the count is known. */
export function resnaccTabs(counts?: {
  quotes: number
  plain: number
}): PillTab<ResnaccTab>[] {
  return [
    {
      value: "quotes",
      label: label("Quotes", counts?.quotes),
      icon: QuoteIcon,
    },
    {
      value: "people",
      label: label("Resnaccs", counts?.plain),
      icon: RepeatIcon,
    },
  ]
}
