"use client"

import { CoinsIcon } from "lucide-react"
import { SnaccListScreen } from "@/features/snaccs/screens/snacc-list-screen"
import { CashtagHeader } from "../components/cashtag-header"
import { CashtagHeaderSkeleton } from "../components/cashtag-header-skeleton"
import { useCashtag } from "../hooks/use-cashtag"
import { useCashtagSnaccs } from "../hooks/use-cashtag-snaccs"
import { cashtagLabel } from "../utils/labels"

export function CashtagScreen({ symbol }: { symbol: string }) {
  const coin = useCashtag(symbol)
  const list = useCashtagSnaccs(symbol)
  const label = cashtagLabel(symbol)

  return (
    <SnaccListScreen
      title={label}
      subtitle={coin.data?.name}
      list={list}
      failedTitle="Could not load this coin"
      empty={{
        icon: CoinsIcon,
        title: "No snaccs yet",
        description: `Nothing tagged ${label} yet.`,
      }}
      header={
        coin.data ? (
          <CashtagHeader cashtag={coin.data} />
        ) : coin.isPending ? (
          <CashtagHeaderSkeleton />
        ) : null
      }
    />
  )
}
