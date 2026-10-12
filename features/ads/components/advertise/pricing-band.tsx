import { CheckIcon } from "lucide-react"
import { Eyebrow } from "@/components/ui/eyebrow"
import type { AdvertisePricing } from "../../utils/advertise"

const PROMISES = [
  "Only pay for real views",
  "Pause or stop any time",
  "Unspent budget comes back",
]

export function PricingBand({ pricing }: { pricing: AdvertisePricing }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:pb-24">
      <div className="grid items-center gap-12 overflow-hidden rounded-[2.5rem] bg-muted px-6 py-14 sm:px-10 lg:grid-cols-2 lg:gap-10 lg:px-16 lg:py-20">
        <div className="flex flex-col items-start gap-5">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="text-4xl font-black tracking-tight text-balance sm:text-5xl">
            Start with {pricing.start}.
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-pretty text-muted-foreground">
            You set the budget and how long it runs. You only pay when someone
            actually sees your snacc, and whatever&apos;s left when it ends goes
            back to your wallet.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-[2rem] border border-border bg-background p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col items-center gap-1">
              {pricing.views ? (
                <>
                  <span className="text-sm font-semibold text-muted-foreground">
                    A {pricing.start} budget gets you about
                  </span>
                  <span className="text-5xl font-black tracking-tighter text-primary sm:text-6xl">
                    {pricing.views}
                  </span>
                  <span className="text-lg font-extrabold">views</span>
                </>
              ) : null}
              <span className="text-sm text-pretty text-muted-foreground">
                {pricing.rate}
              </span>
            </div>

            <ul className="flex w-full flex-col gap-3 border-t border-border pt-6 text-left">
              {PROMISES.map((promise) => (
                <li
                  key={promise}
                  className="flex items-center gap-3 text-base font-semibold"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CheckIcon className="size-3.5" strokeWidth={3} />
                  </span>
                  {promise}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
