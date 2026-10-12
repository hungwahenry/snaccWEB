import type { Metadata } from "next"
import { CountriesScreen } from "@/features/admin/countries/screens/countries-screen"

export const metadata: Metadata = { title: "Countries" }

export default function Page() {
  return <CountriesScreen />
}
