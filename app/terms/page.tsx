import type { Metadata } from "next"
import { LegalDocumentPage } from "@/features/legal/screens/legal-document-page"
import { readerCountry } from "@/features/legal/utils/reader-country"

export const metadata: Metadata = { title: "Terms of Use" }

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>
}) {
  const { country } = await searchParams

  return (
    <LegalDocumentPage kind="terms" country={await readerCountry(country)} />
  )
}
