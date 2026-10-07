import type { PremiumBenefit } from "../types"
import { benefitIcon } from "../utils/icons"

export function BenefitGrid({ benefits }: { benefits: PremiumBenefit[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {benefits.map((benefit) => {
        const Icon = benefitIcon(benefit.icon)

        return (
          <li
            key={benefit.key}
            className="flex flex-col gap-2.5 rounded-2xl border bg-background/75 p-4"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-premium/15">
              <Icon className="size-[18px] text-premium" />
            </span>
            <p className="text-[15px] leading-5 font-bold text-foreground">
              {benefit.label}
            </p>
            <p className="text-[13px] leading-[18px] text-pretty text-muted-foreground">
              {benefit.description}
            </p>
          </li>
        )
      })}
    </ul>
  )
}
