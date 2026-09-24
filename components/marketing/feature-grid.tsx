import {
  BanknoteIcon,
  ClapperboardIcon,
  GhostIcon,
  NewspaperIcon,
  PartyPopperIcon,
  SparklesIcon,
  type LucideIcon,
} from "lucide-react"
import { Eyebrow } from "@/components/ui/eyebrow"
import { cn } from "@/lib/utils"
import { FEATURE_COLORS } from "./palette"

type Feature = {
  icon: LucideIcon
  name: string
  line: string
  color: string
  wide?: boolean
}

const FEATURES: Feature[] = [
  {
    icon: NewspaperIcon,
    name: "Campus feed",
    line: "Your campus, every campus, and the people you follow. Text, pics, GIFs, polls, voice notes, whatever's on your mind.",
    color: FEATURE_COLORS.feed,
    wide: true,
  },
  {
    icon: ClapperboardIcon,
    name: "Clips",
    line: "Short videos from students near you. Swipe, and they play.",
    color: FEATURE_COLORS.clips,
  },
  {
    icon: GhostIcon,
    name: "Anonymous messages",
    line: "Send a message as a ghost. Stay hidden, or show yourself when you're ready.",
    color: FEATURE_COLORS.ghost,
  },
  {
    icon: BanknoteIcon,
    name: "Money",
    line: "Send and receive money with just a username. Instant and free.",
    color: FEATURE_COLORS.money,
  },
  {
    icon: SparklesIcon,
    name: "Moments",
    line: "Photos and thoughts that don't stick around. See who watched, and react before it's gone.",
    color: FEATURE_COLORS.moments,
  },
  {
    icon: PartyPopperIcon,
    name: "Hangouts",
    line: "Plan something on campus, a game night, a link-up, a study session. People join in, and everyone going gets a group chat.",
    color: FEATURE_COLORS.hangouts,
    wide: true,
  },
]

export function FeatureGrid() {
  return (
    <section
      id="features"
      className="mx-auto w-full max-w-6xl scroll-mt-6 px-4 py-16 sm:px-6 lg:py-24"
    >
      <div className="mb-10 flex flex-col gap-3 px-2">
        <Eyebrow>What&apos;s inside</Eyebrow>
        <h2 className="max-w-2xl text-3xl font-black tracking-tight text-balance sm:text-5xl">
          Everything your campus does, in one app.
        </h2>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.name} {...feature} />
        ))}
      </ul>
    </section>
  )
}

function FeatureCard({ icon: Icon, name, line, color, wide }: Feature) {
  return (
    <li
      className={cn(
        "flex min-h-60 flex-col justify-between rounded-[2rem] p-6 text-white sm:min-h-64",
        wide && "sm:col-span-2"
      )}
      style={{ backgroundColor: color }}
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-white/20">
        <Icon className="size-6" />
      </span>
      <span className="flex flex-col gap-2">
        <span className="text-2xl font-black tracking-tight">{name}</span>
        <span className="max-w-sm text-base leading-snug text-white/85">
          {line}
        </span>
      </span>
    </li>
  )
}
