import type { Metadata } from "next"
import { CurrenciesScreen } from "@/features/admin/currencies/screens/currencies-screen"

export const metadata: Metadata = { title: "Currencies" }

export default function Page() {
  return <CurrenciesScreen />
}
