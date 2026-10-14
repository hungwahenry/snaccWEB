import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Faq } from "@/components/marketing/faq"
import { SiteFooter } from "@/components/marketing/site-footer"
import { SiteHeader } from "@/components/marketing/site-header"
import { getAdsInfo } from "@/features/ads/api/public"
import { AdvertiseCta } from "@/features/ads/components/advertise/advertise-cta"
import { AdvertiseHero } from "@/features/ads/components/advertise/advertise-hero"
import { AdvertiseSteps } from "@/features/ads/components/advertise/advertise-steps"
import { AdvertiserGrid } from "@/features/ads/components/advertise/advertiser-grid"
import { PricingBand } from "@/features/ads/components/advertise/pricing-band"
import { TargetingSpotlight } from "@/features/ads/components/advertise/targeting-spotlight"
import { ADVERTISE_PATH } from "@/features/ads/routes"
import {
  advertisePricing,
  advertiseQuestions,
  isAdvertisable,
} from "@/features/ads/utils/advertise"

export const metadata: Metadata = {
  title: "Advertise on Snacc",
  description:
    "Get your hustle seen on campus. Promote a snacc to the students you want, on the campuses you pick, and only pay when people actually see it.",
  alternates: { canonical: ADVERTISE_PATH },
}

export default async function AdvertisePage() {
  const info = await getAdsInfo()
  if (!isAdvertisable(info)) notFound()

  const pricing = advertisePricing(info)

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <div className="mx-auto w-full max-w-6xl sm:px-6 sm:pt-4">
        <div className="landing-frame overflow-hidden sm:rounded-[2.5rem]">
          <SiteHeader />
          <AdvertiseHero campuses={info.campuses} start={pricing.start} />
        </div>
      </div>

      <AdvertiserGrid />
      <TargetingSpotlight />
      <AdvertiseSteps />
      <PricingBand pricing={pricing} />
      <Faq questions={advertiseQuestions(info)} />
      <AdvertiseCta />
      <SiteFooter />
    </div>
  )
}
