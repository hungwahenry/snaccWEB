"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { getResnaccSummary, listResnaccQuotes, listResnaccers } from "../../api"
import type { ResnaccTab } from "../../types"
import { snaccKeys } from "../../utils/keys"
import { resnaccTabs } from "../../utils/resnacc-tabs"

export function useResnaccLists(snaccId: string) {
  const [tab, setTab] = useState<ResnaccTab>("quotes")

  const summary = useQuery({
    queryKey: snaccKeys.resnaccSummary(snaccId),
    queryFn: () => getResnaccSummary(snaccId),
  })
  const quotes = useInfiniteList(
    snaccKeys.quotes(snaccId),
    (page) => listResnaccQuotes(snaccId, page),
    {
      enabled: tab === "quotes",
    }
  )
  const people = useInfiniteList(
    snaccKeys.resnaccers(snaccId),
    (page) => listResnaccers(snaccId, page),
    {
      enabled: tab === "people",
    }
  )

  return {
    tab,
    tabs: resnaccTabs(summary.data),
    onTabChange: setTab,
    quotes,
    people,
  }
}
