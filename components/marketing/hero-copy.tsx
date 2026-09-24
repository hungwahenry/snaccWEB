import { cn } from "@/lib/utils"
import { avatar } from "./snacc-deck"
import { SocialProof } from "./social-proof"

export function HeroCopy({
  campuses,
  heading: Heading = "h1",
}: {
  campuses: number | null
  heading?: "h1" | "h2"
}) {
  return (
    <>
      <SocialProof campuses={campuses} />

      <Heading className="text-[2.75rem] leading-[0.95] font-black tracking-tighter text-foreground uppercase sm:text-6xl xl:text-7xl">
        What&apos;s <FacePill seeds={["ada", "tunde"]} />
        <br />
        happening
        <br />
        on campus?
      </Heading>

      <p className="max-w-md text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
        Snacc is the coolest social app for your university. Posts, clips,
        anonymous messages, and money, all in one place.
      </p>
    </>
  )
}

function FacePill({ seeds }: { seeds: string[] }) {
  return (
    <span
      aria-hidden
      className="mx-[0.05em] inline-flex h-[0.78em] -translate-y-[0.06em] items-center rounded-full bg-primary/15 px-[0.1em] align-middle"
    >
      {seeds.map((seed, index) => (
        <img
          key={seed}
          src={avatar(seed)}
          alt=""
          className={cn(
            "size-[0.62em] rounded-full bg-muted ring-[0.04em] ring-background",
            index > 0 && "-ml-[0.18em]"
          )}
        />
      ))}
    </span>
  )
}
