"use client"

import { useQuery } from "@tanstack/react-query"
import { QuoteIcon, RepeatIcon } from "lucide-react"
import { useState } from "react"
import type { PillTab } from "@/components/ui/pill-tabs"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { compactCount } from "@/lib/format"
import { getResnaccSummary, listResnaccQuotes, listResnaccers } from "../../api"

export type ResnaccTab = "quotes" | "people"

function label(name: string, count: number | undefined): string {
  return count === undefined ? name : `${name} ${compactCount(count)}`
}

export function useResnaccLists(snaccId: string) {
  const [tab, setTab] = useState<ResnaccTab>("quotes")

  const summary = useQuery({
    queryKey: ["snaccs", snaccId, "resnaccs", "summary"],
    queryFn: () => getResnaccSummary(snaccId),
  })
  const quotes = useInfiniteList(
    ["snaccs", snaccId, "resnaccs", "quotes"],
    (page) => listResnaccQuotes(snaccId, page),
    {
      enabled: tab === "quotes",
    }
  )
  const people = useInfiniteList(
    ["snaccs", snaccId, "resnaccs", "people"],
    (page) => listResnaccers(snaccId, page),
    {
      enabled: tab === "people",
    }
  )

  const tabs: PillTab<ResnaccTab>[] = [
    {
      value: "quotes",
      label: label("Quotes", summary.data?.quotes),
      icon: QuoteIcon,
    },
    {
      value: "people",
      label: label("Resnaccs", summary.data?.plain),
      icon: RepeatIcon,
    },
  ]

  return { tab, tabs, onTabChange: setTab, quotes, people }
}
