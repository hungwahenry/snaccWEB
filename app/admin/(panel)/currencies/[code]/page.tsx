import type { Metadata } from "next"
import { CurrencyScreen } from "@/features/admin/currencies/screens/currency-screen"

export const metadata: Metadata = { title: "Currency" }

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  return <CurrencyScreen code={code.toUpperCase()} />
}
