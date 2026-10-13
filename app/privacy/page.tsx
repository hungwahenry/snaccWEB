import type { Metadata } from "next"
import { LegalDocumentPage } from "@/features/legal/screens/legal-document-page"
import { readerCountry } from "@/features/legal/utils/reader-country"

export const metadata: Metadata = { title: "Privacy Policy" }

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>
}) {
  const { country } = await searchParams

  return (
    <LegalDocumentPage kind="privacy" country={await readerCountry(country)} />
  )
}
