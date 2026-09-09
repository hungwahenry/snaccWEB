import type { PremiumBenefit } from "../types"
import { benefitIcon } from "../utils/icons"

export function BenefitList({ benefits }: { benefits: PremiumBenefit[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {benefits.map((benefit) => {
        const Icon = benefitIcon(benefit.icon)

        return (
          <li key={benefit.key} className="flex gap-3">
            <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium">{benefit.label}</p>
              <p className="text-sm text-pretty text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
