import { BadgeCheckIcon } from "lucide-react"
import { PremiumBadge } from "../flair"

export function AuthorBadges({
  official,
  premium,
  size = 16,
}: {
  official: boolean
  premium: boolean
  size?: number
}) {
  return (
    <>
      {official ? (
        <BadgeCheckIcon
          role="img"
          aria-label="Official account"
          className="shrink-0 text-foreground"
          size={size}
        />
      ) : null}
      <PremiumBadge premium={premium} size={size} />
    </>
  )
}
