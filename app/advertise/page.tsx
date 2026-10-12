import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SiteFooter } from "@/components/marketing/site-footer"
import { SiteHeader } from "@/components/marketing/site-header"
import { getAdsInfo } from "@/features/ads/api/public"
import { AdvertiseOverview } from "@/features/ads/components/advertise/advertise-overview"
import { ADVERTISE_PATH } from "@/features/ads/routes"

export const metadata: Metadata = {
  title: "Advertise on Snacc",
  description:
    "Promote a snacc to students across Nigerian campuses. Choose who sees it, set a budget, and pay only for views.",
  alternates: { canonical: ADVERTISE_PATH },
}

export default async function AdvertisePage() {
  const info = await getAdsInfo()
  if (!info) notFound()

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <AdvertiseOverview info={info} />
      </main>

      <SiteFooter />
    </div>
  )
}
