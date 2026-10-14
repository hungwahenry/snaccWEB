import { Eyebrow } from "@/components/ui/eyebrow"
import { cn } from "@/lib/utils"

const GROUPS: { label: string; chips: string[]; picked: string[] }[] = [
  {
    label: "Campuses",
    chips: ["UNILAG", "LASU", "YABATECH", "UI"],
    picked: ["UNILAG", "LASU", "YABATECH"],
  },
  {
    label: "Who",
    chips: ["Students", "Graduates", "Class of 2027"],
    picked: ["Students", "Class of 2027"],
  },
  {
    label: "Uses Snacc on",
    chips: ["iPhone", "Android", "Web"],
    picked: ["iPhone", "Android"],
  },
  {
    label: "Into",
    chips: ["#afrobeats", "#fashion", "#food"],
    picked: ["#fashion", "#food"],
  },
]

export function TargetingSpotlight() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="grid items-center gap-12 overflow-hidden rounded-[2.5rem] border border-white/10 bg-neutral-950 px-6 py-14 text-white sm:px-10 lg:grid-cols-2 lg:gap-10 lg:px-16 lg:py-20">
        <div className="flex flex-col items-start gap-5">
          <Eyebrow className="text-white/60">Targeting</Eyebrow>
          <h2 className="text-4xl font-black tracking-tight text-balance sm:text-5xl">
            Reach exactly who you want.
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-pretty text-white/70">
            Pick campuses, whole regions or kinds of school. Then narrow it
            down: students or graduates, class year,
            gender, iPhone or Android, and what they&apos;re into.
          </p>
        </div>

        <div aria-hidden className="flex justify-center lg:justify-end">
          <AudienceCard />
        </div>
      </div>
    </section>
  )
}

function AudienceCard() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md sm:p-8">
      {GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-2">
          <span className="text-xs font-bold tracking-wider text-white/50 uppercase">
            {group.label}
          </span>
          <div className="flex flex-wrap gap-2">
            {group.chips.map((chip) => (
              <span
                key={chip}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-bold",
                  group.picked.includes(chip)
                    ? "bg-white text-neutral-950"
                    : "bg-white/10 text-white/60"
                )}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-0.5 border-t border-white/10 pt-5">
        <span className="text-3xl font-black tracking-tight">
          ≈ 14,200 students
        </span>
        <span className="text-sm text-white/60">active this month</span>
      </div>
    </div>
  )
}
