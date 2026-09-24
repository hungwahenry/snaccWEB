import { redirect } from "next/navigation"
import { DownloadBand } from "@/components/marketing/download-band"
import { Faq } from "@/components/marketing/faq"
import { FeatureGrid } from "@/components/marketing/feature-grid"
import { Hero } from "@/components/marketing/hero"
import { MoneySpotlight } from "@/components/marketing/money-spotlight"
import { SiteFooter } from "@/components/marketing/site-footer"
import { SiteHeader } from "@/components/marketing/site-header"
import { WhySnacc } from "@/components/marketing/why-snacc"
import { HOME_PATH } from "@/features/feed/routes"
import { countCampuses } from "@/features/universities/api/public"
import { hasSession } from "@/lib/auth-server"

export default async function Home() {
  if (await hasSession()) redirect(HOME_PATH)

  const campuses = await countCampuses()

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden">
      <div className="mx-auto w-full max-w-6xl sm:px-6 sm:pt-4">
        <div className="landing-frame overflow-hidden sm:rounded-[2.5rem]">
          <SiteHeader />
          <Hero campuses={campuses} />
        </div>
      </div>

      <FeatureGrid />
      <MoneySpotlight />
      <WhySnacc />
      <Faq />
      <DownloadBand
        title="Get Snacc."
        line="The feed, the clips, the ghosts, the money — everything your campus is up to, in your pocket. Free on iOS and Android."
      />
      <SiteFooter />
    </div>
  )
}
