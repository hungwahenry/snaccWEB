import type { Metadata } from "next"
import { CountryScreen } from "@/features/admin/countries/screens/country-screen"

export const metadata: Metadata = { title: "Country" }

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  return <CountryScreen code={code.toUpperCase()} />
}
