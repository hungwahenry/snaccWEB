import type { Metadata } from "next"
import { cashtagPath } from "@/features/cashtags/routes"
import { CashtagScreen } from "@/features/cashtags/screens/cashtag-screen"
import { cashtagLabel, symbolFromParam } from "@/features/cashtags/utils/labels"
import { requireSession } from "@/lib/auth-server"

type Props = { params: Promise<{ symbol: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol } = await params
  return { title: cashtagLabel(symbolFromParam(symbol)) }
}

export default async function CashtagPage({ params }: Props) {
  const symbol = symbolFromParam((await params).symbol)
  await requireSession(cashtagPath(symbol))
  return <CashtagScreen symbol={symbol} />
}
