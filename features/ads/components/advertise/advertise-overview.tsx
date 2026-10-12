import Link from "next/link"
import { Eyebrow } from "@/components/ui/eyebrow"
import { formatNumber } from "@/lib/format"
import { PROMOTIONS_PATH } from "../../routes"
import type { AdsInfo } from "../../types"
import {
  ADVERTISE_STEPS,
  advertiseFacts,
  VIEW_RULE,
} from "../../utils/advertise"

export function AdvertiseOverview({ info }: { info: AdsInfo }) {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col items-start gap-4">
        <Eyebrow>Advertise on Snacc</Eyebrow>
        <h1 className="text-4xl font-extrabold tracking-tight text-balance">
          Put your snacc in front of students
        </h1>
        <p className="max-w-xl text-lg text-pretty text-muted-foreground">
          Promote a snacc to students on {formatNumber(info.campuses)} campuses.
          Choose who sees it, set a budget, and pay only for views.
        </p>
        <Link
          href={PROMOTIONS_PATH}
          className="mt-2 inline-flex items-center rounded-full bg-foreground px-6 py-3 text-base font-semibold text-background transition-transform hover:scale-[1.02]"
        >
          Start promoting
        </Link>
      </div>

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {advertiseFacts(info).map((fact) => (
          <div
            key={fact.label}
            className="flex flex-col gap-1 rounded-2xl bg-muted p-4"
          >
            <dt className="text-sm text-muted-foreground">{fact.label}</dt>
            <dd className="text-base font-semibold text-foreground">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      <section className="flex flex-col gap-4">
        <Eyebrow>How it works</Eyebrow>
        <ol className="flex flex-col gap-5">
          {ADVERTISE_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background tabular-nums">
                {index + 1}
              </span>
              <div className="flex flex-col gap-0.5 pt-1">
                <p className="font-semibold text-foreground">{step.title}</p>
                <p className="text-pretty text-muted-foreground">{step.line}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-3">
        <Eyebrow>What counts as a view</Eyebrow>
        <p className="text-pretty text-muted-foreground">{VIEW_RULE}</p>
      </section>

      {info.prohibited.length > 0 ? (
        <section className="flex flex-col gap-3">
          <Eyebrow>What we don&apos;t promote</Eyebrow>
          <ul className="flex flex-wrap gap-2">
            {info.prohibited.map((label) => (
              <li
                key={label}
                className="rounded-full border border-border px-3 py-1.5 text-sm text-foreground"
              >
                {label}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
