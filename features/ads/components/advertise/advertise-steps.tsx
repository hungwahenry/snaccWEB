import { Eyebrow } from "@/components/ui/eyebrow"
import { HOW_IT_WORKS_ID } from "../../utils/advertise"

const STEPS = [
  {
    title: "Post it",
    line: "Put what you want people to see on Snacc: a flyer, a menu, a clip. Add a button like Order now or Book now that opens your link.",
  },
  {
    title: "Pick your people",
    line: "Choose who sees it, how long it runs and what you want to spend, then pay from your Snacc wallet.",
  },
  {
    title: "Go live",
    line: "We check it, usually within a few hours. Then it shows up in feeds, clips and Discover, and you watch the views come in.",
  },
]

export function AdvertiseSteps() {
  return (
    <section
      id={HOW_IT_WORKS_ID}
      className="mx-auto w-full max-w-6xl scroll-mt-6 px-4 py-16 sm:px-6 lg:py-24"
    >
      <div className="mb-10 flex flex-col gap-3 px-2">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="max-w-2xl text-3xl font-black tracking-tight text-balance sm:text-5xl">
          Live in three steps.
        </h2>
      </div>

      <ol className="grid gap-4 lg:grid-cols-3">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="flex flex-col gap-10 rounded-[2rem] bg-muted p-6 sm:p-8"
          >
            <span className="text-6xl font-black tracking-tighter text-primary tabular-nums">
              {index + 1}
            </span>
            <span className="flex flex-col gap-2">
              <span className="text-2xl font-black tracking-tight">
                {step.title}
              </span>
              <span className="text-base leading-snug text-pretty text-muted-foreground">
                {step.line}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
