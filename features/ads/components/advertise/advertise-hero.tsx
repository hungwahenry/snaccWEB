import { ArrowDownIcon } from "lucide-react"
import Link from "next/link"
import { SocialProof } from "@/components/marketing/social-proof"
import { PROMOTIONS_PATH } from "../../routes"
import { HOW_IT_WORKS_ID } from "../../utils/advertise"
import { AdvertiseDeck } from "./advertise-deck"

export function AdvertiseHero({
  campuses,
  start,
}: {
  campuses: number
  start: string
}) {
  return (
    <section className="grid items-center gap-6 px-6 pt-12 pb-10 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-6 lg:px-16 lg:py-20">
      <div className="flex flex-col items-start gap-6">
        <SocialProof campuses={campuses} />

        <h1 className="text-[2.75rem] leading-[0.95] font-black tracking-tighter text-foreground uppercase sm:text-6xl xl:text-7xl">
          Get your
          <br />
          hustle seen
          <br />
          on campus.
        </h1>

        <p className="max-w-md text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
          Promote your snacc to the students you want, on the campuses you pick.
          Start from {start}, and only pay when people actually see it.
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link
            href={PROMOTIONS_PATH}
            className="inline-flex items-center rounded-full bg-foreground px-6 py-3 text-base font-semibold text-background transition-transform hover:scale-[1.02]"
          >
            Start promoting
          </Link>
          <Link
            href={`#${HOW_IT_WORKS_ID}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:underline"
          >
            See how it works
            <ArrowDownIcon className="size-4" />
          </Link>
        </div>
      </div>

      <AdvertiseDeck />
    </section>
  )
}
