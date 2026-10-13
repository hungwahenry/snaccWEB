import {
  MegaphoneIcon,
  MicVocalIcon,
  PartyPopperIcon,
  StoreIcon,
} from "lucide-react"
import { Eyebrow } from "@/components/ui/eyebrow"
import { FeatureCard, type Feature } from "@/components/marketing/feature-grid"
import { FEATURE_COLORS } from "@/components/marketing/palette"

const ADVERTISERS: Feature[] = [
  {
    icon: StoreIcon,
    name: "Campus hustles",
    line: "Food, hair, fashion, gadgets. Turn scrolls into orders from people right on your campus.",
    color: FEATURE_COLORS.moments,
  },
  {
    icon: PartyPopperIcon,
    name: "Events and parties",
    line: "Fill the hall. Get your party, show or match day in front of the schools that will pull up.",
    color: FEATURE_COLORS.hangouts,
  },
  {
    icon: MicVocalIcon,
    name: "Creators and artists",
    line: "New song, new video, new page. Put it where thousands of students are already scrolling.",
    color: FEATURE_COLORS.clips,
  },
  {
    icon: MegaphoneIcon,
    name: "Brands",
    line: "Reach students across the country, or only the campuses and regions that matter to you.",
    color: FEATURE_COLORS.feed,
  },
]

export function AdvertiserGrid() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="mb-10 flex flex-col gap-3 px-2">
        <Eyebrow>Who it&apos;s for</Eyebrow>
        <h2 className="max-w-2xl text-3xl font-black tracking-tight text-balance sm:text-5xl">
          Got something to sell, show or fill? This is for you.
        </h2>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ADVERTISERS.map((advertiser) => (
          <FeatureCard key={advertiser.name} {...advertiser} />
        ))}
      </ul>
    </section>
  )
}
