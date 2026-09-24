import { CheckIcon } from "lucide-react"
import { Eyebrow } from "@/components/ui/eyebrow"
import { cn } from "@/lib/utils"
import { avatar } from "./snacc-deck"

const GREEN = "#4ADE80"

const CHIPS = [
  {
    text: "₦500 for suya 🍢",
    who: "from @ada_l",
    className: "-top-5 -left-3 rotate-[-6deg] sm:-left-10",
  },
  {
    text: "₦1,200 ride to town 🚕",
    who: "to @zee",
    className: "-right-3 -bottom-5 rotate-[4deg] sm:-right-8",
  },
]

export function MoneySpotlight() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="grid items-center gap-12 overflow-hidden rounded-[2.5rem] border border-white/10 bg-neutral-950 px-6 py-14 text-white sm:px-10 lg:grid-cols-2 lg:gap-10 lg:px-16 lg:py-20">
        <div className="flex flex-col items-start gap-5">
          <Eyebrow className="text-white/60">Money</Eyebrow>
          <h2 className="text-4xl font-black tracking-tight text-balance sm:text-5xl">
            Send money with just a username.
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-pretty text-white/70">
            No account number, no bank app. Pay anyone on your campus in
            seconds, or share your link and get paid. Instant and free.
          </p>
        </div>

        <div aria-hidden className="flex justify-center py-6 lg:justify-end">
          <div className="relative w-full max-w-sm">
            <Receipt />
            {CHIPS.map((chip) => (
              <span
                key={chip.text}
                className={cn(
                  "absolute z-10 flex flex-col rounded-2xl border border-white/10 bg-neutral-900 px-4 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)]",
                  chip.className
                )}
              >
                <span className="text-sm font-bold whitespace-nowrap">
                  {chip.text}
                </span>
                <span className="text-xs text-white/50">{chip.who}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Receipt() {
  return (
    <div className="flex flex-col items-center gap-5 rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center backdrop-blur-md">
      <span
        className="flex size-14 items-center justify-center rounded-full text-neutral-950"
        style={{ backgroundColor: GREEN }}
      >
        <CheckIcon className="size-7" strokeWidth={3} />
      </span>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-white/60">You sent</span>
        <span
          className="text-6xl font-black tracking-tighter sm:text-7xl"
          style={{ color: GREEN }}
        >
          ₦2,000
        </span>
      </div>

      <div className="flex items-center gap-2.5 rounded-full bg-white/10 py-1.5 pr-4 pl-1.5">
        <img
          src={avatar("tunde")}
          alt=""
          className="size-7 rounded-full bg-white/10"
        />
        <span className="text-sm font-bold">Tunde</span>
        <span className="text-sm text-white/60">@tundex</span>
      </div>

      <span className="text-xs font-semibold tracking-wide text-white/50 uppercase">
        Instant · Free · Just now
      </span>
    </div>
  )
}
